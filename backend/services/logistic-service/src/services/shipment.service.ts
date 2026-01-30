import { ShipmentRepository } from '../repositories/shipment.repository';
import { TrackingRepository } from '../repositories/tracking.repository';
import { WarehouseRepository } from '../repositories/warehouse.repository';
import {
  CreateShipmentDTO,
  UpdateShipmentDTO,
  BookShipmentDTO,
  CreateTrackingEventDTO,
  ShipmentStatus,
  PaginationOptions
} from '../types';
import { outboxService } from './outbox.service';
import { NotFoundError, BadRequestError, ShipmentError } from '../middleware/error-handler';
import { prisma } from '../lib/prisma';
import axios from 'axios';
import { getServiceAuthHeaders } from '../utils/serviceAuth';
import { Prisma } from '../generated/prisma';
import { withRetry } from '../lib/retry';

// Defaults aligned with MICROSERVICE_ARCHITECTURE_PLAN.md (order-service: 3006, notification-service: 3008)
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3006';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3008';

const OUTBOUND_HTTP_TIMEOUT_MS = (() => {
  const raw = process.env.OUTBOUND_HTTP_TIMEOUT_MS;
  const parsed = raw ? Number.parseInt(raw, 10) : 5000;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5000;
})();

const OUTBOUND_HTTP_RETRIES = (() => {
  const raw = process.env.OUTBOUND_HTTP_RETRIES;
  const parsed = raw ? Number.parseInt(raw, 10) : 2;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 2;
})();

function isRetryableAxiosError(err: any) {
  const code = err?.code as string | undefined;
  const retryableCodes = new Set([
    'ECONNABORTED',
    'ETIMEDOUT',
    'ECONNRESET',
    'ENOTFOUND',
    'EAI_AGAIN',
    'ECONNREFUSED'
  ]);
  if (code && retryableCodes.has(code)) return true;

  const status = err?.response?.status as number | undefined;
  if (typeof status === 'number' && status >= 500) return true;

  // If Axios never got a response (network error), allow retry
  if (err?.isAxiosError && err?.response === undefined) return true;

  return false;
}

export class ShipmentService {
  private shipmentRepository: ShipmentRepository;
  private trackingRepository: TrackingRepository;
  private warehouseRepository: WarehouseRepository;

  constructor() {
    this.shipmentRepository = new ShipmentRepository();
    this.trackingRepository = new TrackingRepository();
    this.warehouseRepository = new WarehouseRepository();
  }

  // =============================================================================
  // Shipment CRUD
  // =============================================================================

  async createShipment(data: CreateShipmentDTO) {
    let origin = data.origin;

    // If no origin provided, use default warehouse
    if (!origin) {
      const defaultWarehouse = await this.warehouseRepository.findDefault();
      if (!defaultWarehouse) {
        throw new BadRequestError('No default warehouse configured and no origin address provided');
      }
      origin = {
        name: defaultWarehouse.contactName,
        phone: defaultWarehouse.contactPhone,
        address: defaultWarehouse.address,
        district: defaultWarehouse.district || undefined,
        city: defaultWarehouse.city,
        province: defaultWarehouse.province,
        postalCode: defaultWarehouse.postalCode,
        latitude: defaultWarehouse.latitude ? Number(defaultWarehouse.latitude) : undefined,
        longitude: defaultWarehouse.longitude ? Number(defaultWarehouse.longitude) : undefined
      };
    }

    return prisma.$transaction(async (tx) => {
      const shipment = await this.shipmentRepository.create({ ...data, origin }, tx);
      await outboxService.shipmentCreated(shipment, tx);
      return shipment;
    });
  }

  async getShipmentById(id: string) {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }
    return shipment;
  }

  async getShipmentByNumber(shipmentNumber: string) {
    const shipment = await this.shipmentRepository.findByShipmentNumber(shipmentNumber);
    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }
    return shipment;
  }

  async getShipmentByOrderId(orderId: string) {
    return this.shipmentRepository.findByOrderId(orderId);
  }

  async getShipmentByTrackingNumber(trackingNumber: string) {
    const shipment = await this.shipmentRepository.findByTrackingNumber(trackingNumber);
    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }
    return shipment;
  }

  async getShipmentsByUserId(userId: string, options?: PaginationOptions) {
    return this.shipmentRepository.findByUserId(userId, options);
  }

  async getAllShipments(options?: PaginationOptions & { status?: ShipmentStatus }) {
    return this.shipmentRepository.findAll(options);
  }

  async updateShipment(id: string, data: UpdateShipmentDTO) {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    return this.shipmentRepository.update(id, data);
  }

  // =============================================================================
  // Shipment Status Management
  // =============================================================================

  private async publishStatusChange(
    tx: Prisma.TransactionClient,
    shipmentId: string,
    status: ShipmentStatus,
    additionalData?: Partial<UpdateShipmentDTO>
  ) {
    const before = await this.shipmentRepository.findById(shipmentId, tx);
    if (!before) {
      throw new NotFoundError('Shipment not found');
    }

    const previousStatus = before.status;
    const updatedShipment = await this.shipmentRepository.updateStatus(
      shipmentId,
      status,
      additionalData,
      tx
    );

    await outboxService.shipmentStatusChanged(
      {
        ...updatedShipment,
        failureReason: additionalData?.failureReason,
        receiverName: additionalData?.receiverName
      },
      previousStatus,
      tx
    );

    return { before, updatedShipment, previousStatus };
  }

  async bookShipment(data: BookShipmentDTO) {
    const { before, updatedShipment } = await prisma.$transaction(async (tx) => {
      const shipment = await this.shipmentRepository.findById(data.shipmentId, tx);
      if (!shipment) {
        throw new NotFoundError('Shipment not found');
      }
      if (shipment.status !== 'pending') {
        throw new ShipmentError(`Cannot book shipment with status: ${shipment.status}`);
      }

      const { before, updatedShipment } = await this.publishStatusChange(tx, data.shipmentId, 'booked', {
        ...(data.trackingNumber !== undefined && { trackingNumber: data.trackingNumber }),
        ...(data.waybillId !== undefined && { waybillId: data.waybillId }),
        ...(data.biteshipOrderId !== undefined && { biteshipOrderId: data.biteshipOrderId }),
        ...(data.estimatedDelivery !== undefined && { estimatedDelivery: data.estimatedDelivery })
      });

      return { before, updatedShipment };
    });

    await this.updateOrderShipmentStatus(before.orderId, 'booked', updatedShipment.trackingNumber);
    return updatedShipment;
  }

  async updateShipmentStatus(
    shipmentId: string,
    status: ShipmentStatus,
    additionalData?: Partial<UpdateShipmentDTO>
  ) {
    const { before, updatedShipment } = await prisma.$transaction(async (tx) => {
      return this.publishStatusChange(tx, shipmentId, status, additionalData);
    });

    await this.updateOrderShipmentStatus(before.orderId, status, updatedShipment.trackingNumber);

    if (['delivered', 'failed', 'out_for_delivery'].includes(status)) {
      await this.sendShipmentNotification(
        updatedShipment.userId,
        updatedShipment.orderId,
        updatedShipment.shipmentNumber,
        status
      );
    }

    return updatedShipment;
  }

  async markDelivered(
    shipmentId: string,
    receiverName?: string,
    proofOfDeliveryUrl?: string,
    signature?: string
  ) {
    return this.updateShipmentStatus(shipmentId, 'delivered', {
      receiverName,
      proofOfDeliveryUrl,
      signature
    });
  }

  async markFailed(shipmentId: string, failureReason: string) {
    return this.updateShipmentStatus(shipmentId, 'failed', { failureReason });
  }

  async cancelShipment(shipmentId: string) {
    const { before, updatedShipment } = await prisma.$transaction(async (tx) => {
      const shipment = await this.shipmentRepository.findById(shipmentId, tx);
      if (!shipment) {
        throw new NotFoundError('Shipment not found');
      }
      if (!['pending', 'booked'].includes(shipment.status)) {
        throw new ShipmentError(`Cannot cancel shipment with status: ${shipment.status}`);
      }

      const { before, updatedShipment } = await this.publishStatusChange(tx, shipmentId, 'cancelled');
      return { before, updatedShipment };
    });

    await this.updateOrderShipmentStatus(before.orderId, 'cancelled', updatedShipment.trackingNumber);
    return updatedShipment;
  }

  // =============================================================================
  // Tracking Management
  // =============================================================================

  async addTrackingEvent(data: CreateTrackingEventDTO) {
    type ShipmentWithTracking = NonNullable<Awaited<ReturnType<ShipmentRepository['findById']>>>;
    type StatusChange = { before: ShipmentWithTracking; updatedShipment: ShipmentWithTracking; newStatus: ShipmentStatus };

    const { trackingEvent, statusChange } = await prisma.$transaction(async (tx) => {
      const shipment = await this.shipmentRepository.findById(data.shipmentId, tx);
      if (!shipment) {
        throw new NotFoundError('Shipment not found');
      }

      const trackingEvent = await this.trackingRepository.create(data, tx);
      await outboxService.trackingUpdated(shipment, trackingEvent, tx);

      const newStatus = this.mapTrackingStatusToShipmentStatus(data.status);
      if (newStatus && newStatus !== shipment.status) {
        const { before, updatedShipment } = await this.publishStatusChange(tx, data.shipmentId, newStatus);
        return { trackingEvent, statusChange: { before, updatedShipment, newStatus } satisfies StatusChange };
      }

      return { trackingEvent, statusChange: null as StatusChange | null };
    });

    if (statusChange) {
      await this.updateOrderShipmentStatus(statusChange.before.orderId, statusChange.newStatus, statusChange.updatedShipment.trackingNumber);
      if (['delivered', 'failed', 'out_for_delivery'].includes(statusChange.newStatus)) {
        await this.sendShipmentNotification(
          statusChange.updatedShipment.userId,
          statusChange.updatedShipment.orderId,
          statusChange.updatedShipment.shipmentNumber,
          statusChange.newStatus
        );
      }
    }

    return trackingEvent;
  }

  async getTrackingHistory(shipmentId: string) {
    const shipment = await this.shipmentRepository.findById(shipmentId);
    if (!shipment) {
      throw new NotFoundError('Shipment not found');
    }

    return this.trackingRepository.findByShipmentId(shipmentId);
  }

  // =============================================================================
  // Statistics
  // =============================================================================

  async getShipmentStats(startDate: Date, endDate: Date) {
    return this.shipmentRepository.getShipmentStats(startDate, endDate);
  }

  // =============================================================================
  // Private Helper Methods
  // =============================================================================

  private mapTrackingStatusToShipmentStatus(trackingStatus: string): ShipmentStatus | null {
    const statusMap: Record<string, ShipmentStatus> = {
      // Common tracking statuses
      'picked_up': 'picked_up',
      'pickup': 'picked_up',
      'in_transit': 'in_transit',
      'transit': 'in_transit',
      'on_the_way': 'in_transit',
      'at_destination': 'at_destination_hub',
      'destination_hub': 'at_destination_hub',
      'out_for_delivery': 'out_for_delivery',
      'with_courier': 'out_for_delivery',
      'delivered': 'delivered',
      'received': 'delivered',
      'failed': 'failed',
      'undelivered': 'failed',
      'returned': 'returned',
      'return_to_sender': 'returned'
    };

    const normalizedStatus = trackingStatus.toLowerCase().replace(/[-\s]/g, '_');
    return statusMap[normalizedStatus] || null;
  }

  private async updateOrderShipmentStatus(
    orderId: string,
    status: ShipmentStatus,
    trackingNumber?: string | null
  ) {
    try {
      await withRetry(
        async () => {
          await axios.put(
            `${ORDER_SERVICE_URL}/api/orders/${orderId}/shipment-status`,
            {
              shipmentStatus: status,
              ...(trackingNumber && { trackingNumber })
            },
            {
              headers: {
                ...getServiceAuthHeaders()
              },
              timeout: OUTBOUND_HTTP_TIMEOUT_MS
            }
          );
        },
        {
          retries: OUTBOUND_HTTP_RETRIES,
          minDelayMs: 200,
          maxDelayMs: 2000,
          factor: 2,
          jitterRatio: 0.2,
          isRetryable: isRetryableAxiosError,
          onRetry: ({ attempt, delayMs, error }) => {
            console.warn(
              `Retrying order-service shipment status update (attempt ${attempt}, delay ${delayMs}ms):`,
              (error as any)?.message || error
            );
          }
        }
      );
    } catch (error: any) {
      console.error(`Failed to update order ${orderId} shipment status:`, error.message);
      // Don't throw - this is a notification, not critical
    }
  }

  private async sendShipmentNotification(
    userId: string,
    orderId: string,
    shipmentNumber: string,
    status: ShipmentStatus
  ) {
    const messages: Record<string, { title: string; message: string }> = {
      out_for_delivery: {
        title: 'Out for Delivery',
        message: `Your order ${shipmentNumber} is out for delivery and will arrive soon!`
      },
      delivered: {
        title: 'Order Delivered',
        message: `Your order ${shipmentNumber} has been delivered successfully!`
      },
      failed: {
        title: 'Delivery Failed',
        message: `Delivery attempt for ${shipmentNumber} failed. We will retry soon.`
      }
    };

    const notification = messages[status];
    if (!notification) return;

    try {
      await axios.post(
        `${NOTIFICATION_SERVICE_URL}/api/notifications`,
        {
          userId,
          type: `shipment_${status}`,
          title: notification.title,
          message: notification.message,
          actionUrl: `/orders/${orderId}`,
          relatedId: orderId
        },
        {
          headers: {
            ...getServiceAuthHeaders()
          },
          timeout: OUTBOUND_HTTP_TIMEOUT_MS
        }
      );
    } catch (error: any) {
      console.error('Failed to send shipment notification:', error.message);
    }
  }
}

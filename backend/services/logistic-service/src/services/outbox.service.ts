import { prisma } from '../lib/prisma';
import { ShipmentStatus } from '../types';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '../generated/prisma';

/**
 * Outbox Service
 *
 * Publishes domain events to the ServiceOutbox table for eventual delivery
 * to other services via Kafka/message broker.
 */

// =============================================================================
// Event Types
// =============================================================================

export type ShipmentEventType =
  | 'shipment.created'
  | 'shipment.booked'
  | 'shipment.awaiting_pickup'
  | 'shipment.picked_up'
  | 'shipment.in_transit'
  | 'shipment.at_destination_hub'
  | 'shipment.out_for_delivery'
  | 'shipment.delivered'
  | 'shipment.failed'
  | 'shipment.returned'
  | 'shipment.cancelled';

export type TrackingEventType = 'tracking.updated';

export type EventType = ShipmentEventType | TrackingEventType;

// =============================================================================
// Event Payloads
// =============================================================================

export interface ShipmentCreatedPayload {
  shipmentId: string;
  shipmentNumber: string;
  orderId: string;
  userId: string;
  courier: string;
  serviceType: string | null;
  shippingCost: number;
  totalCost: number;
  originCity: string;
  destCity: string;
  createdAt: string;
}

export interface ShipmentStatusPayload {
  shipmentId: string;
  shipmentNumber: string;
  orderId: string;
  userId: string;
  status: ShipmentStatus;
  previousStatus?: ShipmentStatus;
  trackingNumber: string | null;
  waybillId?: string | null;
  biteshipOrderId?: string | null;
  estimatedDelivery?: string | null;
  proofOfDeliveryUrl?: string | null;
  timestamp: string;
  failureReason?: string | null;
  receiverName?: string | null;
}

export interface TrackingUpdatedPayload {
  shipmentId: string;
  shipmentNumber: string;
  orderId: string;
  trackingNumber: string | null;
  latestStatus: string;
  latestDescription: string | null;
  latestLocation: string | null;
  eventTime: string;
}

// =============================================================================
// Outbox Service
// =============================================================================

export class OutboxService {
  private getDb(tx?: Prisma.TransactionClient) {
    return tx ?? prisma;
  }

  /**
   * Publish an event to the outbox
   */
  async publish(
    aggregateType: 'Shipment' | 'Tracking',
    aggregateId: string,
    eventType: EventType,
    payload: Record<string, any>,
    metadata?: Record<string, any>,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    await this.getDb(tx).serviceOutbox.create({
      data: {
        aggregateType,
        aggregateId,
        eventType,
        payload,
        ...(metadata !== undefined && { metadata })
      }
    });
  }

  // =============================================================================
  // Shipment Events
  // =============================================================================

  async shipmentCreated(shipment: {
    id: string;
    shipmentNumber: string;
    orderId: string;
    userId: string;
    courier: string;
    serviceType: string | null;
    shippingCost: Decimal;
    totalCost: Decimal;
    originCity: string;
    destCity: string;
    createdAt: Date;
  }, tx?: Prisma.TransactionClient): Promise<void> {
    const payload: ShipmentCreatedPayload = {
      shipmentId: shipment.id,
      shipmentNumber: shipment.shipmentNumber,
      orderId: shipment.orderId,
      userId: shipment.userId,
      courier: shipment.courier,
      serviceType: shipment.serviceType,
      shippingCost: Number(shipment.shippingCost),
      totalCost: Number(shipment.totalCost),
      originCity: shipment.originCity,
      destCity: shipment.destCity,
      createdAt: shipment.createdAt.toISOString()
    };

    await this.publish('Shipment', shipment.id, 'shipment.created', payload, undefined, tx);
  }

  async shipmentStatusChanged(
    shipment: {
      id: string;
      shipmentNumber: string;
      orderId: string;
      userId: string;
      status: ShipmentStatus;
      trackingNumber: string | null;
      waybillId?: string | null;
      biteshipOrderId?: string | null;
      estimatedDelivery?: Date | null;
      proofOfDeliveryUrl?: string | null;
      failureReason?: string | null;
      receiverName?: string | null;
    },
    previousStatus?: ShipmentStatus,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const payload: ShipmentStatusPayload = {
      shipmentId: shipment.id,
      shipmentNumber: shipment.shipmentNumber,
      orderId: shipment.orderId,
      userId: shipment.userId,
      status: shipment.status,
      previousStatus,
      trackingNumber: shipment.trackingNumber,
      waybillId: shipment.waybillId,
      biteshipOrderId: shipment.biteshipOrderId,
      estimatedDelivery: shipment.estimatedDelivery ? shipment.estimatedDelivery.toISOString() : null,
      proofOfDeliveryUrl: shipment.proofOfDeliveryUrl,
      timestamp: new Date().toISOString(),
      failureReason: shipment.failureReason,
      receiverName: shipment.receiverName
    };

    // Map status to event type
    const eventType = `shipment.${shipment.status}` as ShipmentEventType;
    await this.publish('Shipment', shipment.id, eventType, payload, undefined, tx);
  }

  // =============================================================================
  // Tracking Events
  // =============================================================================

  async trackingUpdated(
    shipment: {
      id: string;
      shipmentNumber: string;
      orderId: string;
      trackingNumber: string | null;
    },
    trackingEvent: {
      status: string;
      description: string | null;
      location: string | null;
      eventTime: Date;
    },
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const payload: TrackingUpdatedPayload = {
      shipmentId: shipment.id,
      shipmentNumber: shipment.shipmentNumber,
      orderId: shipment.orderId,
      trackingNumber: shipment.trackingNumber,
      latestStatus: trackingEvent.status,
      latestDescription: trackingEvent.description,
      latestLocation: trackingEvent.location,
      eventTime: trackingEvent.eventTime.toISOString()
    };

    await this.publish('Tracking', shipment.id, 'tracking.updated', payload, undefined, tx);
  }
}

// Singleton instance
export const outboxService = new OutboxService();

import { Request, Response } from 'express';
import { ShipmentService } from '../services/shipment.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { ShipmentStatus } from '../types';
import { asyncHandler, ForbiddenError, NotFoundError } from '../middleware/error-handler';

export class ShipmentController {
  private service: ShipmentService;

  constructor() {
    this.service = new ShipmentService();
  }

  // =============================================================================
  // Public Endpoints
  // =============================================================================
  trackShipment = asyncHandler(async (req: Request, res: Response) => {
    const { trackingNumber } = req.params;
    const shipment = await this.service.getShipmentByTrackingNumber(trackingNumber);

    res.json({
      success: true,
      data: {
        shipmentNumber: shipment.shipmentNumber,
        trackingNumber: shipment.trackingNumber,
        courier: shipment.courier,
        courierName: shipment.courierName,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery,
        origin: {
          city: shipment.originCity,
          province: shipment.originProvince
        },
        destination: {
          city: shipment.destCity,
          province: shipment.destProvince
        },
        trackingEvents: shipment.trackingEvents
      }
    });
  });

  // =============================================================================
  // User Endpoints (Authenticated)
  // =============================================================================
  createShipment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const shipment = await this.service.createShipment({
      ...req.body,
      userId
    });

    res.status(201).json({
      success: true,
      data: shipment
    });
  });

  getUserShipments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await this.service.getShipmentsByUserId(userId, { page, limit });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  });

  getShipmentById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const shipment = await this.service.getShipmentById(id);

    // Users can only view their own shipments
    if (req.user!.role !== 'admin' && shipment.userId !== req.user!.id) {
      throw new ForbiddenError('Access denied');
    }

    res.json({
      success: true,
      data: shipment
    });
  });

  getShipmentByOrderId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { orderId } = req.params;
    const shipment = await this.service.getShipmentByOrderId(orderId);

    if (!shipment) {
      throw new NotFoundError('No shipment found for this order');
    }

    // Users can only view their own shipments
    if (req.user!.role !== 'admin' && shipment.userId !== req.user!.id) {
      throw new ForbiddenError('Access denied');
    }

    res.json({
      success: true,
      data: shipment
    });
  });

  getTrackingHistory = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const shipment = await this.service.getShipmentById(id);

    // Users can only view their own shipments
    if (req.user!.role !== 'admin' && shipment.userId !== req.user!.id) {
      throw new ForbiddenError('Access denied');
    }

    const trackingEvents = await this.service.getTrackingHistory(id);

    res.json({
      success: true,
      data: trackingEvents
    });
  });

  cancelShipment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const shipment = await this.service.getShipmentById(id);

    // Users can only cancel their own shipments
    if (req.user!.role !== 'admin' && shipment.userId !== req.user!.id) {
      throw new ForbiddenError('Access denied');
    }

    const cancelledShipment = await this.service.cancelShipment(id);

    res.json({
      success: true,
      data: cancelledShipment
    });
  });

  // =============================================================================
  // Internal Endpoints (Service-to-Service)
  // =============================================================================
  createShipmentInternal = asyncHandler(async (req: Request, res: Response) => {
    const shipment = await this.service.createShipment(req.body);

    res.status(201).json({
      success: true,
      data: shipment
    });
  });

  bookShipmentInternal = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const shipment = await this.service.bookShipment({
      shipmentId: id,
      ...req.body
    });

    res.json({
      success: true,
      data: shipment
    });
  });

  updateStatusInternal = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, ...additionalData } = req.body;

    const shipment = await this.service.updateShipmentStatus(
      id,
      status as ShipmentStatus,
      additionalData
    );

    res.json({
      success: true,
      data: shipment
    });
  });

  getByOrderIdInternal = asyncHandler(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const shipment = await this.service.getShipmentByOrderId(orderId);

    if (!shipment) {
      throw new NotFoundError('No shipment found for this order');
    }

    res.json({
      success: true,
      data: shipment
    });
  });
}

export const shipmentController = new ShipmentController();

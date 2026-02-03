import { Request, Response } from 'express';
import { RateService } from '../services/rate.service';
import { asyncHandler } from '../middleware/error-handler';

export class RateController {
  private service: RateService;

  constructor() {
    this.service = new RateService();
  }

  getShippingRates = asyncHandler(async (req: Request, res: Response) => {
    const rates = await this.service.getRates(req.body);

    res.json({
      success: true,
      data: rates
    });
  });

  getAvailableCouriers = asyncHandler(async (_req: Request, res: Response) => {
    const couriers = await this.service.getActiveCouriers();

    res.json({
      success: true,
      data: couriers
    });
  });

  getQuickEstimate = asyncHandler(async (req: Request, res: Response) => {
    const { originPostalCode, destPostalCode, weightGrams } = req.body;

    const rates = await this.service.getRates({
      originPostalCode,
      destPostalCode,
      weightGrams
    });

    // Return cheapest and fastest options
    const sortedByPrice = [...rates].sort((a, b) => a.rate - b.rate);
    const sortedBySpeed = [...rates].sort((a, b) => {
      const daysA = parseInt(a.estimatedDays?.split('-')[0] || '999');
      const daysB = parseInt(b.estimatedDays?.split('-')[0] || '999');
      return daysA - daysB;
    });

    res.json({
      success: true,
      data: {
        cheapest: sortedByPrice[0] || null,
        fastest: sortedBySpeed[0] || null,
        allRates: rates
      }
    });
  });

  getShippingRatesInternal = asyncHandler(async (req: Request, res: Response) => {
    const rates = await this.service.getRates(req.body);

    res.json({
      success: true,
      data: rates
    });
  });
}

export const rateController = new RateController();

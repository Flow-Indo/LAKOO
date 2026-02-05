import { CourierRepository } from '../repositories/courier.repository';
import { RateCacheRepository, CachedRate } from '../repositories/rate-cache.repository';
import { GetRatesDTO, ShippingRateResponse, CourierIntegration, CourierService } from '../types';
import { biteshipClient } from '../config/biteship';
import { productClient } from '../clients/product.client';
import { BadRequestError } from '../middleware/error-handler';

export class RateService {
  private courierRepository: CourierRepository;
  private rateCacheRepository: RateCacheRepository;

  constructor() {
    this.courierRepository = new CourierRepository();
    this.rateCacheRepository = new RateCacheRepository();
  }

  private toNumber(value: any): number | undefined {
    if (value === null || value === undefined) return undefined;
    const n = typeof value === 'number' ? value : Number(value?.toNumber?.() ?? value);
    return Number.isFinite(n) ? n : undefined;
  }

  private normalizePackageDetails(input: GetRatesDTO): {
    originPostalCode: string;
    destPostalCode: string;
    weightGrams: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    itemValue?: number;
    couriers?: string[];
  } {
    const lengthCm = this.toNumber((input as any).lengthCm) ?? 10;
    const widthCm = this.toNumber((input as any).widthCm) ?? 10;
    const heightCm = this.toNumber((input as any).heightCm) ?? 10;

    const qty = Math.max(1, Math.floor(Number((input as any).quantity ?? 1) || 1));
    const baseWeight = Math.floor(Number((input as any).weightGrams ?? 0) || 0);
    const weightGrams = baseWeight > 0 ? baseWeight * qty : 0;

    return {
      originPostalCode: input.originPostalCode,
      destPostalCode: input.destPostalCode,
      weightGrams,
      lengthCm,
      widthCm,
      heightCm,
      itemValue: (input as any).itemValue,
      couriers: (input as any).couriers
    };
  }

  private async resolveRateRequest(data: GetRatesDTO) {
    const resolved: GetRatesDTO = { ...data };

    if (data.productId) {
      const product = await productClient.fetchProduct(data.productId);

      // Source-of-truth: if product specifies dimensions, prefer them over caller-provided values.
      // (Prevents clients from accidentally pricing shipments with wrong sizes.)
      const productLength = this.toNumber((product as any).lengthCm);
      const productWidth = this.toNumber((product as any).widthCm);
      const productHeight = this.toNumber((product as any).heightCm);
      if (productLength !== undefined) resolved.lengthCm = productLength;
      if (productWidth !== undefined) resolved.widthCm = productWidth;
      if (productHeight !== undefined) resolved.heightCm = productHeight;

      // Weight: source-of-truth should come from product DB.
      // Prefer variant weight (if provided and present), else product weight, else fall back to request weight.
      let weightSetFromVariant = false;
      if (data.variantId) {
        const variant = await productClient.fetchVariant(data.variantId);
        const variantWeight = variant?.weightGrams ?? undefined;
        if (typeof variantWeight === 'number' && variantWeight > 0) {
          resolved.weightGrams = variantWeight as any;
          weightSetFromVariant = true;
        }
      }

      const productWeight = (product as any).weightGrams as number | null | undefined;
      if (!weightSetFromVariant && typeof productWeight === 'number' && productWeight > 0) {
        resolved.weightGrams = productWeight as any;
      }

      // Default item value from product price if missing.
      if (resolved.itemValue === undefined) {
        const price = this.toNumber((product as any).baseSellPrice);
        if (price && price > 0) resolved.itemValue = price;
      }
    }

    const normalized = this.normalizePackageDetails(resolved);
    if (!normalized.weightGrams || normalized.weightGrams <= 0) {
      throw new BadRequestError('weightGrams is required (or productId must have weightGrams)');
    }

    return normalized;
  }

  private async getRatesFromBiteshipFallback(data: GetRatesDTO): Promise<ShippingRateResponse[]> {
    try {
      const biteshipRates = await biteshipClient.getRates({
        originPostalCode: data.originPostalCode,
        destPostalCode: data.destPostalCode,
        weightGrams: data.weightGrams,
        lengthCm: data.lengthCm,
        widthCm: data.widthCm,
        heightCm: data.heightCm,
        itemValue: data.itemValue,
        couriers: data.couriers
      });

      const rates = biteshipRates.map((r) => ({
        courier: r.courierCode,
        courierName: r.courierName,
        serviceCode: r.serviceCode,
        serviceName: r.serviceName,
        serviceType: null,
        rate: r.rate,
        estimatedDays: r.estimatedDays ?? null,
        supportsCod: false,
        supportsInsurance: true
      }));

      rates.sort((a, b) => a.rate - b.rate);
      return rates;
    } catch (error: any) {
      // Local friendliness: allow returning empty rates when Biteship isn't configured.
      const allowUnconfigured =
        String(process.env.ALLOW_UNCONFIGURED_SHIPPING_RATES || 'false').toLowerCase() === 'true';

      if (allowUnconfigured || process.env.NODE_ENV === 'development') {
        console.warn('Biteship rates unavailable (development mode):', error?.message || error);
        return [];
      }
      throw error;
    }
  }

  /**
   * Backwards-compatible alias used by controllers.
   */
  async getRates(data: GetRatesDTO): Promise<ShippingRateResponse[]> {
    return this.getShippingRates(data);
  }

  /**
   * Get shipping rates for a given route and weight
   */
  async getShippingRates(data: GetRatesDTO): Promise<ShippingRateResponse[]> {
    const resolved = await this.resolveRateRequest(data);
    const { originPostalCode, destPostalCode, weightGrams, lengthCm, widthCm, heightCm, couriers } = resolved;

    // If Biteship isn't configured, fail fast instead of hanging the checkout flow.
    // The caller (order-service / test script) can fall back to a default shipping cost.
    const allowUnconfigured =
      String(process.env.ALLOW_UNCONFIGURED_SHIPPING_RATES || 'false').toLowerCase() === 'true';
    if (!process.env.BITESHIP_API_KEY && allowUnconfigured) {
      return [];
    }

    // Get active couriers
    let activeCouriers: CourierIntegration[] = [];
    try {
      activeCouriers = await this.courierRepository.findAllCouriers(true);
    } catch (error: any) {
      // If courier tables aren't migrated yet, fall back to direct Biteship pricing.
      if (allowUnconfigured || process.env.NODE_ENV === 'development') {
        return this.getRatesFromBiteshipFallback(resolved);
      }
      throw error;
    }

    // Filter by requested couriers if specified
    if (couriers && couriers.length > 0) {
      activeCouriers = activeCouriers.filter((c: CourierIntegration) => couriers.includes(c.courierCode));
    }

    if (activeCouriers.length === 0) {
      return this.getRatesFromBiteshipFallback(resolved);
    }

    const rates: ShippingRateResponse[] = [];
    const missingRates: { courier: string; services: string[] }[] = [];

    // Check cache for each courier's services
    for (const courier of activeCouriers) {
      for (const service of courier.services) {
        const cached = await this.rateCacheRepository.get(
          originPostalCode,
          destPostalCode,
          weightGrams,
          lengthCm,
          widthCm,
          heightCm,
          courier.courierCode,
          service.serviceCode
        );

        if (cached) {
          rates.push({
            courier: courier.courierCode,
            courierName: courier.courierName,
            serviceCode: service.serviceCode,
            serviceName: service.serviceName,
            serviceType: service.serviceType,
            rate: Number(cached.rate),
            estimatedDays: cached.estimatedDays,
            supportsCod: courier.supportsCod,
            supportsInsurance: courier.supportsInsurance
          });
        } else {
          // Track missing rates
          const existingMissing = missingRates.find(m => m.courier === courier.courierCode);
          if (existingMissing) {
            existingMissing.services.push(service.serviceCode);
          } else {
            missingRates.push({
              courier: courier.courierCode,
              services: [service.serviceCode]
            });
          }
        }
      }
    }

    // Fetch missing rates from Biteship
    if (missingRates.length > 0) {
      try {
        const biteshipRates = await biteshipClient.getRates({
          originPostalCode,
          destPostalCode,
          weightGrams,
          lengthCm,
          widthCm,
          heightCm,
          itemValue: resolved.itemValue,
          couriers: missingRates.map(m => m.courier)
        });

        // Cache and add new rates
        const ratesToCache: CachedRate[] = [];

        for (const rate of biteshipRates) {
          const courier = activeCouriers.find((c: CourierIntegration) => c.courierCode === rate.courierCode);
          if (!courier) continue;

          const service = courier.services.find((s: CourierService) => s.serviceCode === rate.serviceCode);

          // Apply rate multiplier
          const finalRate = rate.rate * Number(courier.rateMultiplier || 1);

          rates.push({
            courier: rate.courierCode,
            courierName: courier.courierName,
            serviceCode: rate.serviceCode,
            serviceName: service?.serviceName || rate.serviceName,
            serviceType: service?.serviceType || null,
            rate: finalRate,
            estimatedDays: rate.estimatedDays || service?.estimatedDays || null,
            supportsCod: courier.supportsCod,
            supportsInsurance: courier.supportsInsurance
          });

          ratesToCache.push({
            originPostalCode,
            destPostalCode,
            weightGrams,
            lengthCm,
            widthCm,
            heightCm,
            courier: rate.courierCode,
            serviceCode: rate.serviceCode,
            rate: finalRate,
            estimatedDays: rate.estimatedDays
          });
        }

        // Bulk cache rates
        if (ratesToCache.length > 0) {
          await this.rateCacheRepository.bulkSet(ratesToCache);
        }
      } catch (error: any) {
        console.error('Failed to fetch rates from Biteship:', error.message);
        // Return whatever we have from cache
      }
    }

    // Sort by rate (cheapest first)
    rates.sort((a, b) => a.rate - b.rate);

    return rates;
  }

  /**
   * Public-facing list of active couriers (no secrets like apiKey).
   */
  async getActiveCouriers() {
    const couriers = await this.courierRepository.findAllCouriers(true);

    return couriers.map((courier: CourierIntegration) => ({
      id: courier.id,
      courierCode: courier.courierCode,
      courierName: courier.courierName,
      supportsCod: courier.supportsCod,
      supportsInsurance: courier.supportsInsurance,
      supportsPickup: courier.supportsPickup,
      supportsDropoff: courier.supportsDropoff,
      supportsRealTimeTracking: courier.supportsRealTimeTracking,
      rateMultiplier: courier.rateMultiplier ? Number(courier.rateMultiplier) : 1,
      logoUrl: courier.logoUrl,
      displayOrder: courier.displayOrder,
      services: courier.services.map((service: CourierService) => ({
        id: service.id,
        serviceCode: service.serviceCode,
        serviceName: service.serviceName,
        serviceType: service.serviceType,
        estimatedDays: service.estimatedDays,
        displayOrder: service.displayOrder
      }))
    }));
  }

  /**
   * Clear rate cache for a specific route
   */
  async clearRateCache(originPostalCode: string, destPostalCode: string) {
    return this.rateCacheRepository.clearByRoute(originPostalCode, destPostalCode);
  }

  /**
   * Clear all expired cache entries
   */
  async clearExpiredCache() {
    return this.rateCacheRepository.clearExpired();
  }

  /**
   * Clear all rate cache
   */
  async clearAllCache() {
    return this.rateCacheRepository.clearAll();
  }
}

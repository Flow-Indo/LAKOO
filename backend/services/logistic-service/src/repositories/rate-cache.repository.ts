import { prisma } from '../lib/prisma';

export interface CachedRate {
  originPostalCode: string;
  destPostalCode: string;
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  courier: string;
  serviceCode: string;
  rate: number;
  estimatedDays?: string;
}

export class RateCacheRepository {
  private readonly defaultTtlHours = 24;

  private isCacheSchemaError(err: any) {
    const code = err?.code as string | undefined;
    if (code === 'P2021' || code === 'P2022') return true; // table/column missing
    const message = String(err?.message || '');
    return message.includes('does not exist') || message.includes('Unknown column');
  }

  async get(
    originPostalCode: string,
    destPostalCode: string,
    weightGrams: number,
    lengthCm: number,
    widthCm: number,
    heightCm: number,
    courier: string,
    serviceCode: string
  ) {
    let cached: any = null;
    try {
      cached = await prisma.shippingRateCache.findUnique({
        where: {
          originPostalCode_destPostalCode_weightGrams_lengthCm_widthCm_heightCm_courier_serviceCode: {
            originPostalCode,
            destPostalCode,
            weightGrams,
            lengthCm,
            widthCm,
            heightCm,
            courier,
            serviceCode
          }
        }
      });
    } catch (err: any) {
      // Development resilience: if the cache table/schema isn't migrated yet, treat as cache-miss.
      if (process.env.NODE_ENV === 'development' && this.isCacheSchemaError(err)) {
        console.warn('Rate cache unavailable (development mode); skipping cache lookup.');
        return null;
      }
      throw err;
    }

    // Return null if expired
    if (cached && cached.expiresAt < new Date()) {
      await this.delete(cached.id);
      return null;
    }

    return cached;
  }

  async set(data: CachedRate, ttlHours?: number) {
    const ttl = ttlHours || parseInt(process.env.RATE_CACHE_TTL_HOURS || String(this.defaultTtlHours));
    const expiresAt = new Date(Date.now() + ttl * 60 * 60 * 1000);

    try {
      return await prisma.shippingRateCache.upsert({
        where: {
          originPostalCode_destPostalCode_weightGrams_lengthCm_widthCm_heightCm_courier_serviceCode: {
            originPostalCode: data.originPostalCode,
            destPostalCode: data.destPostalCode,
            weightGrams: data.weightGrams,
            lengthCm: data.lengthCm,
            widthCm: data.widthCm,
            heightCm: data.heightCm,
            courier: data.courier,
            serviceCode: data.serviceCode
          }
        },
        create: {
          originPostalCode: data.originPostalCode,
          destPostalCode: data.destPostalCode,
          weightGrams: data.weightGrams,
          lengthCm: data.lengthCm,
          widthCm: data.widthCm,
          heightCm: data.heightCm,
          courier: data.courier,
          serviceCode: data.serviceCode,
          rate: data.rate,
          estimatedDays: data.estimatedDays,
          expiresAt
        },
        update: {
          rate: data.rate,
          estimatedDays: data.estimatedDays,
          expiresAt
        }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development' && this.isCacheSchemaError(err)) {
        return null;
      }
      throw err;
    }
  }

  async bulkSet(rates: CachedRate[], ttlHours?: number) {
    const ttl = ttlHours || parseInt(process.env.RATE_CACHE_TTL_HOURS || String(this.defaultTtlHours));
    const expiresAt = new Date(Date.now() + ttl * 60 * 60 * 1000);

    // Use transaction for bulk upsert
    const operations = rates.map(rate =>
      prisma.shippingRateCache.upsert({
        where: {
          originPostalCode_destPostalCode_weightGrams_lengthCm_widthCm_heightCm_courier_serviceCode: {
            originPostalCode: rate.originPostalCode,
            destPostalCode: rate.destPostalCode,
            weightGrams: rate.weightGrams,
            lengthCm: rate.lengthCm,
            widthCm: rate.widthCm,
            heightCm: rate.heightCm,
            courier: rate.courier,
            serviceCode: rate.serviceCode
          }
        },
        create: {
          originPostalCode: rate.originPostalCode,
          destPostalCode: rate.destPostalCode,
          weightGrams: rate.weightGrams,
          lengthCm: rate.lengthCm,
          widthCm: rate.widthCm,
          heightCm: rate.heightCm,
          courier: rate.courier,
          serviceCode: rate.serviceCode,
          rate: rate.rate,
          estimatedDays: rate.estimatedDays,
          expiresAt
        },
        update: {
          rate: rate.rate,
          estimatedDays: rate.estimatedDays,
          expiresAt
        }
      })
    );

    try {
      return await prisma.$transaction(operations);
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development' && this.isCacheSchemaError(err)) {
        return [];
      }
      throw err;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.shippingRateCache.delete({
        where: { id }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development' && this.isCacheSchemaError(err)) {
        return null;
      }
      throw err;
    }
  }

  async clearExpired() {
    try {
      return await prisma.shippingRateCache.deleteMany({
        where: {
          expiresAt: { lt: new Date() }
        }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development' && this.isCacheSchemaError(err)) {
        return { count: 0 };
      }
      throw err;
    }
  }

  async clearAll() {
    try {
      return await prisma.shippingRateCache.deleteMany({});
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development' && this.isCacheSchemaError(err)) {
        return { count: 0 };
      }
      throw err;
    }
  }

  async clearByRoute(originPostalCode: string, destPostalCode: string) {
    try {
      return await prisma.shippingRateCache.deleteMany({
        where: {
          originPostalCode,
          destPostalCode
        }
      });
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development' && this.isCacheSchemaError(err)) {
        return { count: 0 };
      }
      throw err;
    }
  }
}

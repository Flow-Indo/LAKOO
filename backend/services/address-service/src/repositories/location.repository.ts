import { Prisma } from '../generated/prisma';
import { prisma } from '../lib/prisma';

type ListOptions = {
  search?: string;
  isActive?: boolean;
};

function toDecimal(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  return new Prisma.Decimal(value as any);
}

export class LocationRepository {
  // =============================================================================
  // Province
  // =============================================================================

  async listProvinces(options: ListOptions = {}) {
    return prisma.province.findMany({
      where: {
        ...(options.isActive !== undefined ? { isActive: options.isActive } : {}),
        ...(options.search
          ? {
              OR: [
                { name: { contains: options.search, mode: 'insensitive' } },
                { code: { contains: options.search, mode: 'insensitive' } }
              ]
            }
          : {})
      },
      orderBy: { name: 'asc' }
    });
  }

  async getProvince(id: string) {
    return prisma.province.findUnique({ where: { id } });
  }

  async createProvince(data: {
    code: string;
    name: string;
    altNames?: string[];
    latitude?: number | string | null;
    longitude?: number | string | null;
    isActive?: boolean;
  }) {
    return prisma.province.create({
      data: {
        code: data.code,
        name: data.name,
        altNames: data.altNames ?? [],
        latitude: toDecimal(data.latitude),
        longitude: toDecimal(data.longitude),
        isActive: data.isActive ?? true
      }
    });
  }

  async updateProvince(id: string, data: Partial<{
    code: string;
    name: string;
    altNames: string[];
    latitude: number | string | null;
    longitude: number | string | null;
    isActive: boolean;
  }>) {
    return prisma.province.update({
      where: { id },
      data: {
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.altNames !== undefined ? { altNames: data.altNames } : {}),
        ...(data.latitude !== undefined ? { latitude: toDecimal(data.latitude) } : {}),
        ...(data.longitude !== undefined ? { longitude: toDecimal(data.longitude) } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {})
      }
    });
  }

  async deactivateProvince(id: string) {
    return prisma.province.update({ where: { id }, data: { isActive: false } });
  }

  // =============================================================================
  // City
  // =============================================================================

  async listCities(options: ListOptions & { provinceId?: string } = {}) {
    return prisma.city.findMany({
      where: {
        ...(options.provinceId ? { provinceId: options.provinceId } : {}),
        ...(options.isActive !== undefined ? { isActive: options.isActive } : {}),
        ...(options.search
          ? {
              OR: [
                { name: { contains: options.search, mode: 'insensitive' } },
                { code: { contains: options.search, mode: 'insensitive' } }
              ]
            }
          : {})
      },
      orderBy: { name: 'asc' }
    });
  }

  async getCity(id: string) {
    return prisma.city.findUnique({ where: { id } });
  }

  async createCity(data: {
    provinceId: string;
    code: string;
    name: string;
    type: 'kota' | 'kabupaten';
    altNames?: string[];
    latitude?: number | string | null;
    longitude?: number | string | null;
    isActive?: boolean;
  }) {
    return prisma.city.create({
      data: {
        provinceId: data.provinceId,
        code: data.code,
        name: data.name,
        type: data.type as any,
        altNames: data.altNames ?? [],
        latitude: toDecimal(data.latitude),
        longitude: toDecimal(data.longitude),
        isActive: data.isActive ?? true
      }
    });
  }

  async updateCity(id: string, data: Partial<{
    provinceId: string;
    code: string;
    name: string;
    type: 'kota' | 'kabupaten';
    altNames: string[];
    latitude: number | string | null;
    longitude: number | string | null;
    isActive: boolean;
  }>) {
    return prisma.city.update({
      where: { id },
      data: {
        ...(data.provinceId !== undefined ? { provinceId: data.provinceId } : {}),
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.type !== undefined ? { type: data.type as any } : {}),
        ...(data.altNames !== undefined ? { altNames: data.altNames } : {}),
        ...(data.latitude !== undefined ? { latitude: toDecimal(data.latitude) } : {}),
        ...(data.longitude !== undefined ? { longitude: toDecimal(data.longitude) } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {})
      }
    });
  }

  async deactivateCity(id: string) {
    return prisma.city.update({ where: { id }, data: { isActive: false } });
  }

  // =============================================================================
  // District
  // =============================================================================

  async listDistricts(options: ListOptions & { cityId?: string } = {}) {
    return prisma.district.findMany({
      where: {
        ...(options.cityId ? { cityId: options.cityId } : {}),
        ...(options.isActive !== undefined ? { isActive: options.isActive } : {}),
        ...(options.search
          ? {
              OR: [
                { name: { contains: options.search, mode: 'insensitive' } },
                { code: { contains: options.search, mode: 'insensitive' } }
              ]
            }
          : {})
      },
      orderBy: { name: 'asc' }
    });
  }

  async getDistrict(id: string) {
    return prisma.district.findUnique({ where: { id } });
  }

  async createDistrict(data: {
    cityId: string;
    code: string;
    name: string;
    altNames?: string[];
    latitude?: number | string | null;
    longitude?: number | string | null;
    isActive?: boolean;
  }) {
    return prisma.district.create({
      data: {
        cityId: data.cityId,
        code: data.code,
        name: data.name,
        altNames: data.altNames ?? [],
        latitude: toDecimal(data.latitude),
        longitude: toDecimal(data.longitude),
        isActive: data.isActive ?? true
      }
    });
  }

  async updateDistrict(id: string, data: Partial<{
    cityId: string;
    code: string;
    name: string;
    altNames: string[];
    latitude: number | string | null;
    longitude: number | string | null;
    isActive: boolean;
  }>) {
    return prisma.district.update({
      where: { id },
      data: {
        ...(data.cityId !== undefined ? { cityId: data.cityId } : {}),
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.altNames !== undefined ? { altNames: data.altNames } : {}),
        ...(data.latitude !== undefined ? { latitude: toDecimal(data.latitude) } : {}),
        ...(data.longitude !== undefined ? { longitude: toDecimal(data.longitude) } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {})
      }
    });
  }

  async deactivateDistrict(id: string) {
    return prisma.district.update({ where: { id }, data: { isActive: false } });
  }

  // =============================================================================
  // Village
  // =============================================================================

  async listVillages(options: ListOptions & { districtId?: string; postalCode?: string } = {}) {
    return prisma.village.findMany({
      where: {
        ...(options.districtId ? { districtId: options.districtId } : {}),
        ...(options.postalCode ? { postalCode: options.postalCode } : {}),
        ...(options.isActive !== undefined ? { isActive: options.isActive } : {}),
        ...(options.search
          ? {
              OR: [
                { name: { contains: options.search, mode: 'insensitive' } },
                { code: { contains: options.search, mode: 'insensitive' } }
              ]
            }
          : {})
      },
      orderBy: { name: 'asc' }
    });
  }

  async getVillage(id: string) {
    return prisma.village.findUnique({ where: { id } });
  }

  async createVillage(data: {
    districtId: string;
    code: string;
    name: string;
    type: 'kelurahan' | 'desa';
    postalCode?: string | null;
    altNames?: string[];
    latitude?: number | string | null;
    longitude?: number | string | null;
    isActive?: boolean;
  }) {
    return prisma.village.create({
      data: {
        districtId: data.districtId,
        code: data.code,
        name: data.name,
        type: data.type as any,
        postalCode: data.postalCode ?? null,
        altNames: data.altNames ?? [],
        latitude: toDecimal(data.latitude),
        longitude: toDecimal(data.longitude),
        isActive: data.isActive ?? true
      }
    });
  }

  async updateVillage(id: string, data: Partial<{
    districtId: string;
    code: string;
    name: string;
    type: 'kelurahan' | 'desa';
    postalCode: string | null;
    altNames: string[];
    latitude: number | string | null;
    longitude: number | string | null;
    isActive: boolean;
  }>) {
    return prisma.village.update({
      where: { id },
      data: {
        ...(data.districtId !== undefined ? { districtId: data.districtId } : {}),
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.type !== undefined ? { type: data.type as any } : {}),
        ...(data.postalCode !== undefined ? { postalCode: data.postalCode } : {}),
        ...(data.altNames !== undefined ? { altNames: data.altNames } : {}),
        ...(data.latitude !== undefined ? { latitude: toDecimal(data.latitude) } : {}),
        ...(data.longitude !== undefined ? { longitude: toDecimal(data.longitude) } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {})
      }
    });
  }

  async deactivateVillage(id: string) {
    return prisma.village.update({ where: { id }, data: { isActive: false } });
  }

  // =============================================================================
  // PostalCode
  // =============================================================================

  async listPostalCodes(options: { postalCode?: string; cityName?: string; provinceName?: string } = {}) {
    return prisma.postalCode.findMany({
      where: {
        ...(options.postalCode ? { postalCode: options.postalCode } : {}),
        ...(options.cityName ? { cityName: { contains: options.cityName, mode: 'insensitive' } } : {}),
        ...(options.provinceName ? { provinceName: { contains: options.provinceName, mode: 'insensitive' } } : {})
      },
      orderBy: [{ postalCode: 'asc' }, { cityName: 'asc' }]
    });
  }

  async getPostalCode(id: string) {
    return prisma.postalCode.findUnique({ where: { id } });
  }

  async createPostalCode(data: {
    postalCode: string;
    villageName?: string | null;
    districtName?: string | null;
    cityName: string;
    provinceName: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    biteshipAreaId?: string | null;
  }) {
    return prisma.postalCode.create({
      data: {
        postalCode: data.postalCode,
        villageName: data.villageName ?? null,
        districtName: data.districtName ?? null,
        cityName: data.cityName,
        provinceName: data.provinceName,
        latitude: toDecimal(data.latitude),
        longitude: toDecimal(data.longitude),
        biteshipAreaId: data.biteshipAreaId ?? null
      }
    });
  }

  async updatePostalCode(id: string, data: Partial<{
    postalCode: string;
    villageName: string | null;
    districtName: string | null;
    cityName: string;
    provinceName: string;
    latitude: number | string | null;
    longitude: number | string | null;
    biteshipAreaId: string | null;
  }>) {
    return prisma.postalCode.update({
      where: { id },
      data: {
        ...(data.postalCode !== undefined ? { postalCode: data.postalCode } : {}),
        ...(data.villageName !== undefined ? { villageName: data.villageName } : {}),
        ...(data.districtName !== undefined ? { districtName: data.districtName } : {}),
        ...(data.cityName !== undefined ? { cityName: data.cityName } : {}),
        ...(data.provinceName !== undefined ? { provinceName: data.provinceName } : {}),
        ...(data.latitude !== undefined ? { latitude: toDecimal(data.latitude) } : {}),
        ...(data.longitude !== undefined ? { longitude: toDecimal(data.longitude) } : {}),
        ...(data.biteshipAreaId !== undefined ? { biteshipAreaId: data.biteshipAreaId } : {})
      }
    });
  }

  async deletePostalCode(id: string) {
    return prisma.postalCode.delete({ where: { id } });
  }
}


import { LocationRepository } from '../repositories/location.repository';
import { BadRequestError, NotFoundError } from './address.service';

export class LocationService {
  private repository: LocationRepository;

  constructor() {
    this.repository = new LocationRepository();
  }

  // Province
  async listProvinces(params: { search?: string; isActive?: boolean }) {
    return this.repository.listProvinces(params);
  }

  async getProvince(id: string) {
    const province = await this.repository.getProvince(id);
    if (!province) throw new NotFoundError('Province not found');
    return province;
  }

  async createProvince(data: any) {
    if (!data?.code || !data?.name) throw new BadRequestError('code and name are required');
    return this.repository.createProvince(data);
  }

  async updateProvince(id: string, data: any) {
    await this.getProvince(id);
    return this.repository.updateProvince(id, data);
  }

  async deleteProvince(id: string) {
    await this.getProvince(id);
    return this.repository.deactivateProvince(id);
  }

  // City
  async listCities(params: { provinceId?: string; search?: string; isActive?: boolean }) {
    return this.repository.listCities(params);
  }

  async getCity(id: string) {
    const city = await this.repository.getCity(id);
    if (!city) throw new NotFoundError('City not found');
    return city;
  }

  async createCity(data: any) {
    if (!data?.provinceId || !data?.code || !data?.name || !data?.type) {
      throw new BadRequestError('provinceId, code, name, and type are required');
    }
    return this.repository.createCity(data);
  }

  async updateCity(id: string, data: any) {
    await this.getCity(id);
    return this.repository.updateCity(id, data);
  }

  async deleteCity(id: string) {
    await this.getCity(id);
    return this.repository.deactivateCity(id);
  }

  // District
  async listDistricts(params: { cityId?: string; search?: string; isActive?: boolean }) {
    return this.repository.listDistricts(params);
  }

  async getDistrict(id: string) {
    const district = await this.repository.getDistrict(id);
    if (!district) throw new NotFoundError('District not found');
    return district;
  }

  async createDistrict(data: any) {
    if (!data?.cityId || !data?.code || !data?.name) {
      throw new BadRequestError('cityId, code, and name are required');
    }
    return this.repository.createDistrict(data);
  }

  async updateDistrict(id: string, data: any) {
    await this.getDistrict(id);
    return this.repository.updateDistrict(id, data);
  }

  async deleteDistrict(id: string) {
    await this.getDistrict(id);
    return this.repository.deactivateDistrict(id);
  }

  // Village
  async listVillages(params: { districtId?: string; postalCode?: string; search?: string; isActive?: boolean }) {
    return this.repository.listVillages(params);
  }

  async getVillage(id: string) {
    const village = await this.repository.getVillage(id);
    if (!village) throw new NotFoundError('Village not found');
    return village;
  }

  async createVillage(data: any) {
    if (!data?.districtId || !data?.code || !data?.name || !data?.type) {
      throw new BadRequestError('districtId, code, name, and type are required');
    }
    return this.repository.createVillage(data);
  }

  async updateVillage(id: string, data: any) {
    await this.getVillage(id);
    return this.repository.updateVillage(id, data);
  }

  async deleteVillage(id: string) {
    await this.getVillage(id);
    return this.repository.deactivateVillage(id);
  }

  // Postal codes
  async listPostalCodes(params: { postalCode?: string; cityName?: string; provinceName?: string }) {
    return this.repository.listPostalCodes(params);
  }

  async getPostalCode(id: string) {
    const row = await this.repository.getPostalCode(id);
    if (!row) throw new NotFoundError('Postal code not found');
    return row;
  }

  async createPostalCode(data: any) {
    if (!data?.postalCode || !data?.cityName || !data?.provinceName) {
      throw new BadRequestError('postalCode, cityName, and provinceName are required');
    }
    return this.repository.createPostalCode(data);
  }

  async updatePostalCode(id: string, data: any) {
    await this.getPostalCode(id);
    return this.repository.updatePostalCode(id, data);
  }

  async deletePostalCode(id: string) {
    await this.getPostalCode(id);
    return this.repository.deletePostalCode(id);
  }
}


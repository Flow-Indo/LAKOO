import { type RequestHandler, Request, Response } from 'express';
import { LocationService } from '../services/location.service';
import { asyncHandler } from '../utils/asyncHandler';

export class LocationController {
  private service: LocationService;

  constructor() {
    this.service = new LocationService();
  }

  private parseOptionalBoolean(value: unknown): boolean | undefined {
    if (value === undefined) return undefined;
    if (value === true || value === false) return value;
    if (typeof value === 'string') {
      if (value === 'true') return true;
      if (value === 'false') return false;
    }
    return undefined;
  }

  // Province
  listProvinces: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const isActive = this.parseOptionalBoolean(req.query.isActive);
    const data = await this.service.listProvinces({
      search: (req.query.search as string | undefined) || undefined,
      isActive
    });
    res.json({ success: true, data });
  });

  getProvince: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getProvince(req.params.id!);
    res.json({ success: true, data });
  });

  createProvince: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createProvince(req.body);
    res.status(201).json({ success: true, data });
  });

  updateProvince: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateProvince(req.params.id!, req.body);
    res.json({ success: true, data });
  });

  deleteProvince: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.deleteProvince(req.params.id!);
    res.json({ success: true, data });
  });

  // City
  listCities: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const isActive = this.parseOptionalBoolean(req.query.isActive);
    const data = await this.service.listCities({
      provinceId: (req.query.provinceId as string | undefined) || undefined,
      search: (req.query.search as string | undefined) || undefined,
      isActive
    });
    res.json({ success: true, data });
  });

  getCity: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getCity(req.params.id!);
    res.json({ success: true, data });
  });

  createCity: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createCity(req.body);
    res.status(201).json({ success: true, data });
  });

  updateCity: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateCity(req.params.id!, req.body);
    res.json({ success: true, data });
  });

  deleteCity: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.deleteCity(req.params.id!);
    res.json({ success: true, data });
  });

  // District
  listDistricts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const isActive = this.parseOptionalBoolean(req.query.isActive);
    const data = await this.service.listDistricts({
      cityId: (req.query.cityId as string | undefined) || undefined,
      search: (req.query.search as string | undefined) || undefined,
      isActive
    });
    res.json({ success: true, data });
  });

  getDistrict: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getDistrict(req.params.id!);
    res.json({ success: true, data });
  });

  createDistrict: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createDistrict(req.body);
    res.status(201).json({ success: true, data });
  });

  updateDistrict: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateDistrict(req.params.id!, req.body);
    res.json({ success: true, data });
  });

  deleteDistrict: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.deleteDistrict(req.params.id!);
    res.json({ success: true, data });
  });

  // Village
  listVillages: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const isActive = this.parseOptionalBoolean(req.query.isActive);
    const data = await this.service.listVillages({
      districtId: (req.query.districtId as string | undefined) || undefined,
      postalCode: (req.query.postalCode as string | undefined) || undefined,
      search: (req.query.search as string | undefined) || undefined,
      isActive
    });
    res.json({ success: true, data });
  });

  getVillage: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getVillage(req.params.id!);
    res.json({ success: true, data });
  });

  createVillage: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createVillage(req.body);
    res.status(201).json({ success: true, data });
  });

  updateVillage: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updateVillage(req.params.id!, req.body);
    res.json({ success: true, data });
  });

  deleteVillage: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.deleteVillage(req.params.id!);
    res.json({ success: true, data });
  });

  // Postal codes
  listPostalCodes: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.listPostalCodes({
      postalCode: (req.query.postalCode as string | undefined) || undefined,
      cityName: (req.query.cityName as string | undefined) || undefined,
      provinceName: (req.query.provinceName as string | undefined) || undefined
    });
    res.json({ success: true, data });
  });

  getPostalCode: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.getPostalCode(req.params.id!);
    res.json({ success: true, data });
  });

  createPostalCode: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.createPostalCode(req.body);
    res.status(201).json({ success: true, data });
  });

  updatePostalCode: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.updatePostalCode(req.params.id!, req.body);
    res.json({ success: true, data });
  });

  deletePostalCode: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const data = await this.service.deletePostalCode(req.params.id!);
    res.json({ success: true, data });
  });
}

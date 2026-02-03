import { Router, type Router as ExpressRouter } from 'express';
import { body, param, query } from 'express-validator';
import { LocationController } from '../controllers/location.controller';
import { gatewayOrInternalAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router: ExpressRouter = Router();
const controller = new LocationController();

router.use(gatewayOrInternalAuth);

const idParam = [param('id').isUUID().withMessage('id must be a valid UUID')];

// =============================================================================
// Provinces
// =============================================================================

/**
 * @swagger
 * /api/locations/provinces:
 *   get:
 *     summary: List provinces
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of provinces
 */
router.get(
  '/provinces',
  [query('search').optional().isString(), query('isActive').optional().isBoolean().toBoolean()],
  validateRequest,
  controller.listProvinces
);

/**
 * @swagger
 * /api/locations/provinces/{id}:
 *   get:
 *     summary: Get province by id
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/provinces/:id', idParam, validateRequest, controller.getProvince);

/**
 * @swagger
 * /api/locations/provinces:
 *   post:
 *     summary: Create province
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name]
 *             properties:
 *               code: { type: string }
 *               name: { type: string }
 *               altNames: { type: array, items: { type: string } }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Province created
 */
router.post(
  '/provinces',
  requireRole('admin', 'internal'),
  [
    body('code').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('altNames').optional().isArray(),
    body('altNames.*').optional().isString(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.createProvince
);

/**
 * @swagger
 * /api/locations/provinces/{id}:
 *   patch:
 *     summary: Update province
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code: { type: string }
 *               name: { type: string }
 *               altNames: { type: array, items: { type: string } }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Province updated
 */
router.patch(
  '/provinces/:id',
  requireRole('admin', 'internal'),
  [
    ...idParam,
    body('code').optional().isString().notEmpty(),
    body('name').optional().isString().notEmpty(),
    body('altNames').optional().isArray(),
    body('altNames.*').optional().isString(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.updateProvince
);

/**
 * @swagger
 * /api/locations/provinces/{id}:
 *   delete:
 *     summary: Delete province
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Province deleted
 */
router.delete(
  '/provinces/:id',
  requireRole('admin', 'internal'),
  idParam,
  validateRequest,
  controller.deleteProvince
);

// =============================================================================
// Cities
// =============================================================================

/**
 * @swagger
 * /api/locations/cities:
 *   get:
 *     summary: List cities
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of cities
 */
router.get(
  '/cities',
  [
    query('provinceId').optional().isUUID(),
    query('search').optional().isString(),
    query('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.listCities
);

/**
 * @swagger
 * /api/locations/cities/{id}:
 *   get:
 *     summary: Get city by id
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/cities/:id', idParam, validateRequest, controller.getCity);

/**
 * @swagger
 * /api/locations/cities:
 *   post:
 *     summary: Create city
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [provinceId, code, name, type]
 *             properties:
 *               provinceId: { type: string, format: uuid }
 *               code: { type: string }
 *               name: { type: string }
 *               type: { type: string, enum: [kota, kabupaten] }
 *               altNames: { type: array, items: { type: string } }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: City created
 */
router.post(
  '/cities',
  requireRole('admin', 'internal'),
  [
    body('provinceId').isUUID(),
    body('code').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('type').isIn(['kota', 'kabupaten']),
    body('altNames').optional().isArray(),
    body('altNames.*').optional().isString(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.createCity
);

/**
 * @swagger
 * /api/locations/cities/{id}:
 *   patch:
 *     summary: Update city
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               provinceId: { type: string, format: uuid }
 *               code: { type: string }
 *               name: { type: string }
 *               type: { type: string, enum: [kota, kabupaten] }
 *               altNames: { type: array, items: { type: string } }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: City updated
 */
router.patch(
  '/cities/:id',
  requireRole('admin', 'internal'),
  [
    ...idParam,
    body('provinceId').optional().isUUID(),
    body('code').optional().isString().notEmpty(),
    body('name').optional().isString().notEmpty(),
    body('type').optional().isIn(['kota', 'kabupaten']),
    body('altNames').optional().isArray(),
    body('altNames.*').optional().isString(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.updateCity
);

/**
 * @swagger
 * /api/locations/cities/{id}:
 *   delete:
 *     summary: Delete city
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: City deleted
 */
router.delete(
  '/cities/:id',
  requireRole('admin', 'internal'),
  idParam,
  validateRequest,
  controller.deleteCity
);

// =============================================================================
// Districts
// =============================================================================

/**
 * @swagger
 * /api/locations/districts:
 *   get:
 *     summary: List districts
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: cityId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of districts
 */
router.get(
  '/districts',
  [query('cityId').optional().isUUID(), query('search').optional().isString(), query('isActive').optional().isBoolean().toBoolean()],
  validateRequest,
  controller.listDistricts
);

/**
 * @swagger
 * /api/locations/districts/{id}:
 *   get:
 *     summary: Get district by id
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/districts/:id', idParam, validateRequest, controller.getDistrict);

/**
 * @swagger
 * /api/locations/districts:
 *   post:
 *     summary: Create district
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cityId, code, name]
 *             properties:
 *               cityId: { type: string, format: uuid }
 *               code: { type: string }
 *               name: { type: string }
 *               altNames: { type: array, items: { type: string } }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: District created
 */
router.post(
  '/districts',
  requireRole('admin', 'internal'),
  [
    body('cityId').isUUID(),
    body('code').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('altNames').optional().isArray(),
    body('altNames.*').optional().isString(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.createDistrict
);

/**
 * @swagger
 * /api/locations/districts/{id}:
 *   patch:
 *     summary: Update district
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cityId: { type: string, format: uuid }
 *               code: { type: string }
 *               name: { type: string }
 *               altNames: { type: array, items: { type: string } }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: District updated
 */
router.patch(
  '/districts/:id',
  requireRole('admin', 'internal'),
  [
    ...idParam,
    body('cityId').optional().isUUID(),
    body('code').optional().isString().notEmpty(),
    body('name').optional().isString().notEmpty(),
    body('altNames').optional().isArray(),
    body('altNames.*').optional().isString(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.updateDistrict
);

/**
 * @swagger
 * /api/locations/districts/{id}:
 *   delete:
 *     summary: Delete district
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: District deleted
 */
router.delete(
  '/districts/:id',
  requireRole('admin', 'internal'),
  idParam,
  validateRequest,
  controller.deleteDistrict
);

// =============================================================================
// Villages
// =============================================================================

/**
 * @swagger
 * /api/locations/villages:
 *   get:
 *     summary: List villages
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: districtId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: postalCode
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of villages
 */
router.get(
  '/villages',
  [
    query('districtId').optional().isUUID(),
    query('postalCode').optional().isString(),
    query('search').optional().isString(),
    query('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.listVillages
);

/**
 * @swagger
 * /api/locations/villages/{id}:
 *   get:
 *     summary: Get village by id
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/villages/:id', idParam, validateRequest, controller.getVillage);

/**
 * @swagger
 * /api/locations/villages:
 *   post:
 *     summary: Create village
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [districtId, code, name, type]
 *             properties:
 *               districtId: { type: string, format: uuid }
 *               code: { type: string }
 *               name: { type: string }
 *               type: { type: string, enum: [kelurahan, desa] }
 *               postalCode: { type: string }
 *               altNames: { type: array, items: { type: string } }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               isActive: { type: boolean }
 *     responses:
 *       201:
 *         description: Village created
 */
router.post(
  '/villages',
  requireRole('admin', 'internal'),
  [
    body('districtId').isUUID(),
    body('code').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('type').isIn(['kelurahan', 'desa']),
    body('postalCode').optional().isString(),
    body('altNames').optional().isArray(),
    body('altNames.*').optional().isString(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.createVillage
);

/**
 * @swagger
 * /api/locations/villages/{id}:
 *   patch:
 *     summary: Update village
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               districtId: { type: string, format: uuid }
 *               code: { type: string }
 *               name: { type: string }
 *               type: { type: string, enum: [kelurahan, desa] }
 *               postalCode: { type: string }
 *               altNames: { type: array, items: { type: string } }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Village updated
 */
router.patch(
  '/villages/:id',
  requireRole('admin', 'internal'),
  [
    ...idParam,
    body('districtId').optional().isUUID(),
    body('code').optional().isString().notEmpty(),
    body('name').optional().isString().notEmpty(),
    body('type').optional().isIn(['kelurahan', 'desa']),
    body('postalCode').optional().isString(),
    body('altNames').optional().isArray(),
    body('altNames.*').optional().isString(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('isActive').optional().isBoolean().toBoolean()
  ],
  validateRequest,
  controller.updateVillage
);

/**
 * @swagger
 * /api/locations/villages/{id}:
 *   delete:
 *     summary: Delete village
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Village deleted
 */
router.delete(
  '/villages/:id',
  requireRole('admin', 'internal'),
  idParam,
  validateRequest,
  controller.deleteVillage
);

// =============================================================================
// Postal codes
// =============================================================================

/**
 * @swagger
 * /api/locations/postal-codes:
 *   get:
 *     summary: List postal codes
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: postalCode
 *         schema: { type: string }
 *       - in: query
 *         name: cityName
 *         schema: { type: string }
 *       - in: query
 *         name: provinceName
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of postal codes
 */
router.get(
  '/postal-codes',
  [
    query('postalCode').optional().isString(),
    query('cityName').optional().isString(),
    query('provinceName').optional().isString()
  ],
  validateRequest,
  controller.listPostalCodes
);

/**
 * @swagger
 * /api/locations/postal-codes/{id}:
 *   get:
 *     summary: Get postal code by id
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 */
router.get('/postal-codes/:id', idParam, validateRequest, controller.getPostalCode);

/**
 * @swagger
 * /api/locations/postal-codes:
 *   post:
 *     summary: Create postal code
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [postalCode, cityName, provinceName]
 *             properties:
 *               postalCode: { type: string }
 *               villageName: { type: string }
 *               districtName: { type: string }
 *               cityName: { type: string }
 *               provinceName: { type: string }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               biteshipAreaId: { type: string }
 *     responses:
 *       201:
 *         description: Postal code created
 */
router.post(
  '/postal-codes',
  requireRole('admin', 'internal'),
  [
    body('postalCode').isString().notEmpty(),
    body('villageName').optional().isString(),
    body('districtName').optional().isString(),
    body('cityName').isString().notEmpty(),
    body('provinceName').isString().notEmpty(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('biteshipAreaId').optional().isString()
  ],
  validateRequest,
  controller.createPostalCode
);

/**
 * @swagger
 * /api/locations/postal-codes/{id}:
 *   patch:
 *     summary: Update postal code
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postalCode: { type: string }
 *               villageName: { type: string }
 *               districtName: { type: string }
 *               cityName: { type: string }
 *               provinceName: { type: string }
 *               latitude: { type: number, minimum: -90, maximum: 90 }
 *               longitude: { type: number, minimum: -180, maximum: 180 }
 *               biteshipAreaId: { type: string }
 *     responses:
 *       200:
 *         description: Postal code updated
 */
router.patch(
  '/postal-codes/:id',
  requireRole('admin', 'internal'),
  [
    ...idParam,
    body('postalCode').optional().isString().notEmpty(),
    body('villageName').optional().isString(),
    body('districtName').optional().isString(),
    body('cityName').optional().isString().notEmpty(),
    body('provinceName').optional().isString().notEmpty(),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).toFloat(),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).toFloat(),
    body('biteshipAreaId').optional().isString()
  ],
  validateRequest,
  controller.updatePostalCode
);

/**
 * @swagger
 * /api/locations/postal-codes/{id}:
 *   delete:
 *     summary: Delete postal code
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Postal code deleted
 */
router.delete(
  '/postal-codes/:id',
  requireRole('admin', 'internal'),
  idParam,
  validateRequest,
  controller.deletePostalCode
);

export default router;


import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { ProductController } from '../controllers/product.controller';
import { gatewayOrInternalAuth, internalServiceAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
const router: Router = Router();
const controller = new ProductController();

// =============================================================================
// Validators
// =============================================================================

const productIdParam = [param('id').isUUID().withMessage('Invalid product ID')];

const variantIdParam = [param('variantId').isUUID().withMessage('Invalid variant ID')];

const listProductsValidators = [
  query('sellerId').optional().isUUID().withMessage('Invalid sellerId'),
  query('categoryId').optional().isUUID().withMessage('Invalid categoryId'),
  query('status')
    .optional()
    .isIn(['draft', 'pending_approval', 'approved', 'rejected', 'inactive', 'out_of_stock'])
    .withMessage('Invalid status'),
  query('search').optional().isString().withMessage('search must be a string'),
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('page must be an integer >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('limit must be an integer 1..100')
];

const createProductValidators = [
  body('categoryId').isUUID().withMessage('Invalid categoryId'),
  body('sellerId').optional({ nullable: true }).isUUID().withMessage('Invalid sellerId'),
  body('name').isString().trim().isLength({ min: 3, max: 255 }).withMessage('name must be 3..255 chars'),
  body('baseSellPrice').isNumeric().withMessage('baseSellPrice must be a number'),
  body('baseCostPrice').optional().isNumeric().withMessage('baseCostPrice must be a number'),
  body('description').optional().isString().withMessage('description must be a string'),
  body('shortDescription').optional().isString().isLength({ max: 500 }).withMessage('shortDescription max 500 chars'),
  body('primaryImageUrl').optional().isURL().withMessage('primaryImageUrl must be a valid URL'),
  body('weightGrams').optional().isInt({ min: 0 }).toInt().withMessage('weightGrams must be a non-negative integer'),
  body('lengthCm').optional().isNumeric().withMessage('lengthCm must be a number'),
  body('widthCm').optional().isNumeric().withMessage('widthCm must be a number'),
  body('heightCm').optional().isNumeric().withMessage('heightCm must be a number'),
  body('tags').optional().isArray().withMessage('tags must be an array'),
  body('tags.*').optional().isString().withMessage('tags must be strings'),
  body('grosirUnitSize').optional().isInt({ min: 1 }).toInt().withMessage('grosirUnitSize must be >= 1')
];

const updateProductValidators = [
  ...productIdParam,
  body('categoryId').optional().isUUID().withMessage('Invalid categoryId'),
  body('name').optional().isString().trim().isLength({ min: 3, max: 255 }).withMessage('name must be 3..255 chars'),
  body('description').optional().isString().withMessage('description must be a string'),
  body('shortDescription').optional().isString().isLength({ max: 500 }).withMessage('shortDescription max 500 chars'),
  body('baseSellPrice').optional().isNumeric().withMessage('baseSellPrice must be a number'),
  body('baseCostPrice').optional().isNumeric().withMessage('baseCostPrice must be a number'),
  body('weightGrams').optional().isInt({ min: 0 }).toInt().withMessage('weightGrams must be a non-negative integer'),
  body('lengthCm').optional().isNumeric().withMessage('lengthCm must be a number'),
  body('widthCm').optional().isNumeric().withMessage('widthCm must be a number'),
  body('heightCm').optional().isNumeric().withMessage('heightCm must be a number'),
  body('status')
    .optional()
    .isIn(['draft', 'pending_approval', 'approved', 'rejected', 'inactive', 'out_of_stock'])
    .withMessage('Invalid status'),
  body('primaryImageUrl').optional().isURL().withMessage('primaryImageUrl must be a valid URL'),
  body('material').optional().isString().withMessage('material must be a string'),
  body('careInstructions').optional().isString().withMessage('careInstructions must be a string'),
  body('countryOfOrigin').optional().isString().withMessage('countryOfOrigin must be a string'),
  body('tags').optional().isArray().withMessage('tags must be an array'),
  body('tags.*').optional().isString().withMessage('tags must be strings'),
  body('grosirUnitSize').optional().isInt({ min: 1 }).toInt().withMessage('grosirUnitSize must be >= 1')
];

const addImagesValidators = [
  ...productIdParam,
  body('images').isArray({ min: 1 }).withMessage('images must be a non-empty array'),
  body('images.*.imageUrl').isURL().withMessage('images[].imageUrl must be a valid URL'),
  body('images.*.sortOrder').optional().isInt({ min: 0 }).toInt().withMessage('images[].sortOrder must be >= 0'),
  body('images.*.altText')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 255 })
    .withMessage('images[].altText max 255 chars')
];

const createVariantValidators = [
  ...productIdParam,
  body('sku').isString().notEmpty().withMessage('sku is required'),
  body('color').isString().notEmpty().withMessage('color is required'),
  body('size').isString().notEmpty().withMessage('size is required'),
  body('costPrice').isNumeric().withMessage('costPrice must be a number'),
  body('sellPrice').isNumeric().withMessage('sellPrice must be a number'),
  body('barcode').optional().isString().withMessage('barcode must be a string'),
  body('sortOrder').optional().isInt({ min: 0 }).toInt().withMessage('sortOrder must be >= 0'),
  body('isDefault').optional().isBoolean().toBoolean().withMessage('isDefault must be boolean'),
  body('isActive').optional().isBoolean().toBoolean().withMessage('isActive must be boolean')
];

const batchTaggableValidators = [
  body('productIds')
    .isArray({ min: 1, max: 50 })
    .withMessage('productIds must be an array of 1..50 UUIDs'),
  body('productIds.*').isUUID().withMessage('productIds must be UUIDs')
];

const bundleCompositionValidators = [
  ...productIdParam,
  body('compositions').isArray({ min: 1 }).withMessage('compositions must be a non-empty array'),
  body('compositions.*.variantId')
    .optional({ nullable: true })
    .isUUID()
    .withMessage('compositions[].variantId must be a UUID or null'),
  body('compositions.*.unitsInBundle')
    .isInt({ min: 1 })
    .toInt()
    .withMessage('compositions[].unitsInBundle must be an integer >= 1')
];

const warehouseInventoryConfigValidators = [
  ...productIdParam,
  body('configs').isArray({ min: 1 }).withMessage('configs must be a non-empty array'),
  body('configs.*.variantId')
    .optional({ nullable: true })
    .isUUID()
    .withMessage('configs[].variantId must be a UUID or null'),
  body('configs.*.maxStockLevel')
    .isInt({ min: 0 })
    .toInt()
    .withMessage('configs[].maxStockLevel must be an integer >= 0'),
  body('configs.*.reorderThreshold')
    .isInt({ min: 0 })
    .toInt()
    .withMessage('configs[].reorderThreshold must be an integer >= 0')
];

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  gatewayOrInternalAuth,
  requireRole('admin', 'internal'),
  createProductValidators,
  validateRequest,
  controller.createProduct
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: factoryId
 *         schema:
 *           type: string
 *         description: Filter by factory ID
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, active, inactive]
 *         description: Filter by product status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', listProductsValidators, validateRequest, controller.getProducts);

/**
 * @swagger
 * /api/products/id/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/id/:id', productIdParam, validateRequest, controller.getProductById);

/**
 * @swagger
 * /api/products/{id}/taggable:
 *   get:
 *     summary: Check if product can be tagged in posts
 *     description: Returns product info for tagging if product is approved
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product taggability info
 *       404:
 *         description: Product not found
 */
router.get('/:id/taggable', internalServiceAuth, productIdParam, validateRequest, controller.checkTaggable);

/**
 * @swagger
 * /api/products/batch-taggable:
 *   post:
 *     summary: Batch check if products can be tagged
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Products taggability info
 */
router.post('/batch-taggable', internalServiceAuth, batchTaggableValidators, validateRequest, controller.batchCheckTaggable);

/**
 * @swagger
 * /api/products/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.patch(
  '/:id',
  gatewayOrInternalAuth,
  requireRole('admin', 'internal'),
  updateProductValidators,
  validateRequest,
  controller.updateProduct
);

/**
 * @swagger
 * /api/products/{id}/publish:
 *   patch:
 *     summary: Publish product (change status from draft to active)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product published successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.patch(
  '/:id/publish',
  gatewayOrInternalAuth,
  requireRole('admin', 'internal'),
  productIdParam,
  validateRequest,
  controller.publishProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (soft delete - sets status to inactive)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:id',
  gatewayOrInternalAuth,
  requireRole('admin', 'internal'),
  productIdParam,
  validateRequest,
  controller.deleteProduct
);

/**
 * @swagger
 * /api/products/{id}/images:
 *   post:
 *     summary: Add images to product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: https://example.com/image.jpg
 *                     sortOrder:
 *                       type: integer
 *                       example: 1
 *     responses:
 *       201:
 *         description: Images added successfully
 *       404:
 *         description: Product not found
 */
router.post(
  '/:id/images',
  gatewayOrInternalAuth,
  requireRole('admin', 'internal'),
  addImagesValidators,
  validateRequest,
  controller.addImages
);

/**
 * @swagger
 * /api/products/{id}/variants:
 *   post:
 *     summary: Add variant to product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVariant'
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 *       404:
 *         description: Product not found
 */
router.post(
  '/:id/variants',
  gatewayOrInternalAuth,
  requireRole('admin', 'internal'),
  createVariantValidators,
  validateRequest,
  controller.createVariant
);
router.get('/variants/:variantId', gatewayOrInternalAuth, variantIdParam, validateRequest, controller.getVariantById);

// ============= Grosir Config Management =============

/**
 * @swagger
 * /api/products/{id}/grosir-config:
 *   get:
 *     summary: Get grosir configuration for a product
 *     tags: [Grosir Config]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Grosir configuration
 *       404:
 *         description: Product not found
 */
router.get('/:id/grosir-config', gatewayOrInternalAuth, productIdParam, validateRequest, controller.getGrosirConfig);

/**
 * @swagger
 * /api/products/{id}/bundle-composition:
 *   post:
 *     summary: Set grosir bundle composition
 *     description: Define how many units of each variant go into a wholesale bundle
 *     tags: [Grosir Config]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - compositions
 *             properties:
 *               compositions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - unitsInBundle
 *                   properties:
 *                     variantId:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *                       description: Variant ID (null for base product)
 *                     unitsInBundle:
 *                       type: integer
 *                       minimum: 1
 *                       description: How many units of this variant in one wholesale bundle
 *           example:
 *             compositions:
 *               - variantId: "s-variant-uuid"
 *                 unitsInBundle: 4
 *               - variantId: "m-variant-uuid"
 *                 unitsInBundle: 4
 *               - variantId: "l-variant-uuid"
 *                 unitsInBundle: 4
 *     responses:
 *       200:
 *         description: Bundle composition set successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 */
router.post(
  '/:id/bundle-composition',
  gatewayOrInternalAuth,
  requireRole('admin', 'internal'),
  bundleCompositionValidators,
  validateRequest,
  controller.setBundleComposition
);

/**
 * @swagger
 * /api/products/{id}/warehouse-inventory-config:
 *   post:
 *     summary: Set warehouse inventory configuration
 *     description: Define max stock level and reorder threshold for warehouse inventory
 *     tags: [Grosir Config]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - configs
 *             properties:
 *               configs:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - maxStockLevel
 *                     - reorderThreshold
 *                   properties:
 *                     variantId:
 *                       type: string
 *                       format: uuid
 *                       nullable: true
 *                       description: Variant ID (null for base product)
 *                     maxStockLevel:
 *                       type: integer
 *                       minimum: 0
 *                       description: Maximum units warehouse will hold for this variant
 *                     reorderThreshold:
 *                       type: integer
 *                       minimum: 0
 *                       description: Order new bundle when stock falls to this level
 *           example:
 *             configs:
 *               - variantId: "s-variant-uuid"
 *                 maxStockLevel: 100
 *                 reorderThreshold: 20
 *               - variantId: "m-variant-uuid"
 *                 maxStockLevel: 120
 *                 reorderThreshold: 30
 *               - variantId: "l-variant-uuid"
 *                 maxStockLevel: 80
 *                 reorderThreshold: 15
 *     responses:
 *       200:
 *         description: Warehouse inventory configuration set successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 */
router.post(
  '/:id/warehouse-inventory-config',
  gatewayOrInternalAuth,
  requireRole('admin', 'internal'),
  warehouseInventoryConfigValidators,
  validateRequest,
  controller.setWarehouseInventoryConfig
);

// Keep catch-all slug route LAST to avoid collisions with more specific routes
router.get('/:slug', controller.getProductBySlug);

export default router;

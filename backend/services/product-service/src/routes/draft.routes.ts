import { Router, type Router as ExpressRouter } from 'express';
import { body } from 'express-validator';
import { gatewayAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { draftController } from '../controllers/draft.controller';

const router: ExpressRouter = Router();

// All draft routes require gateway authentication
router.use(gatewayAuth);

// =============================================================================
// Validation Rules
// =============================================================================

const createDraftValidators = [
  body('categoryId')
    .isUUID()
    .withMessage('Valid category ID is required'),
  body('name')
    .isString()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isString()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('shortDescription')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Short description must be less than 500 characters'),
  body('baseSellPrice')
    .isNumeric()
    .custom((value) => value > 0)
    .withMessage('Base sell price must be greater than 0'),
  body('images')
    .isArray({ min: 3 })
    .withMessage('At least 3 images are required'),
  body('images.*')
    .isURL()
    .withMessage('Each image must be a valid URL'),
  body('variants')
    .isArray({ min: 1 })
    .withMessage('At least 1 variant is required'),
  body('variants.*.color')
    .isString()
    .notEmpty()
    .withMessage('Variant color is required'),
  body('variants.*.size')
    .isString()
    .notEmpty()
    .withMessage('Variant size is required'),
  body('variants.*.sellPrice')
    .isNumeric()
    .custom((value) => value > 0)
    .withMessage('Variant sell price must be greater than 0'),
  body('weightGrams')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Weight must be a positive integer'),
  body('material')
    .optional()
    .isString()
    .withMessage('Material must be a string'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateDraftValidators = [
  body('categoryId')
    .optional()
    .isUUID()
    .withMessage('Valid category ID is required'),
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),
  body('description')
    .optional()
    .isString()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('baseSellPrice')
    .optional()
    .isNumeric()
    .custom((value) => value > 0)
    .withMessage('Base sell price must be greater than 0'),
  body('images')
    .optional()
    .isArray({ min: 3 })
    .withMessage('At least 3 images are required'),
  body('variants')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least 1 variant is required')
];

// =============================================================================
// Routes
// =============================================================================

/**
 * @swagger
 * /api/drafts:
 *   post:
 *     summary: Create a new product draft
 *     tags: [Drafts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDraft'
 *     responses:
 *       201:
 *         description: Draft created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  createDraftValidators,
  validateRequest,
  draftController.createDraft
);

/**
 * @swagger
 * /api/drafts/my-drafts:
 *   get:
 *     summary: Get my drafts
 *     tags: [Drafts]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [draft, pending, approved, rejected, changes_requested]
 *     responses:
 *       200:
 *         description: List of drafts
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/my-drafts',
  draftController.getMyDrafts
);

/**
 * @swagger
 * /api/drafts/{id}:
 *   get:
 *     summary: Get draft by ID (own drafts only)
 *     tags: [Drafts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Draft details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draft not found
 */
router.get(
  '/:id',
  draftController.getDraftById
);

/**
 * @swagger
 * /api/drafts/{id}:
 *   put:
 *     summary: Update draft (only if status is draft/changes_requested)
 *     tags: [Drafts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDraft'
 *     responses:
 *       200:
 *         description: Draft updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draft not found
 */
router.put(
  '/:id',
  updateDraftValidators,
  validateRequest,
  draftController.updateDraft
);

/**
 * @swagger
 * /api/drafts/{id}/submit:
 *   post:
 *     summary: Submit draft for review
 *     tags: [Drafts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Draft submitted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draft not found
 */
router.post(
  '/:id/submit',
  draftController.submitDraft
);

/**
 * @swagger
 * /api/drafts/{id}:
 *   delete:
 *     summary: Delete draft (only if status is draft/rejected/changes_requested)
 *     tags: [Drafts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Draft deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draft not found
 */
router.delete(
  '/:id',
  draftController.deleteDraft
);

export default router;

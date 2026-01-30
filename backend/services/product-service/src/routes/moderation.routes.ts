import { Router, type Router as ExpressRouter } from 'express';
import { body } from 'express-validator';
import { gatewayAuth, requireRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { moderationController } from '../controllers/moderation.controller';

const router: ExpressRouter = Router();

// All moderation routes require gateway authentication AND admin/moderator role
router.use(gatewayAuth);
router.use(requireRole('admin', 'moderator'));

// =============================================================================
// Validation Rules
// =============================================================================

const rejectDraftValidators = [
  body('reason')
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters')
];

const requestChangesValidators = [
  body('feedback')
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Feedback must be between 10 and 500 characters')
];

const updatePriorityValidators = [
  body('priority')
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, normal, high, urgent')
];

// =============================================================================
// Routes
// =============================================================================

/**
 * @swagger
 * /api/moderation/pending:
 *   get:
 *     summary: Get pending drafts for moderation
 *     tags: [Moderation]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pending drafts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/pending',
  moderationController.getPendingDrafts
);

/**
 * @swagger
 * /api/moderation/queue:
 *   get:
 *     summary: Get moderation queue
 *     tags: [Moderation]
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Queue items
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/queue',
  moderationController.getQueue
);

/**
 * @swagger
 * /api/moderation/my-queue:
 *   get:
 *     summary: Get my assigned moderation queue
 *     tags: [Moderation]
 *     parameters:
 *       - in: query
 *         name: includeCompleted
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: My queue items
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/my-queue',
  moderationController.getMyQueue
);

/**
 * @swagger
 * /api/moderation/{id}/assign:
 *   post:
 *     summary: Assign a moderation item to self
 *     tags: [Moderation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Assigned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.post(
  '/:id/assign',
  moderationController.assignDraft
);

/**
 * @swagger
 * /api/moderation/{id}/approve:
 *   post:
 *     summary: Approve draft and create product
 *     tags: [Moderation]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Approved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.post(
  '/:id/approve',
  moderationController.approveDraft
);

/**
 * @swagger
 * /api/moderation/{id}/reject:
 *   post:
 *     summary: Reject draft
 *     tags: [Moderation]
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
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rejected
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.post(
  '/:id/reject',
  rejectDraftValidators,
  validateRequest,
  moderationController.rejectDraft
);

/**
 * @swagger
 * /api/moderation/{id}/request-changes:
 *   post:
 *     summary: Request changes on a draft
 *     tags: [Moderation]
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
 *             type: object
 *             required: [feedback]
 *             properties:
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Changes requested
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.post(
  '/:id/request-changes',
  requestChangesValidators,
  validateRequest,
  moderationController.requestChanges
);

/**
 * @swagger
 * /api/moderation/{id}/priority:
 *   post:
 *     summary: Update moderation priority
 *     tags: [Moderation]
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
 *             type: object
 *             required: [priority]
 *             properties:
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high, urgent]
 *     responses:
 *       200:
 *         description: Priority updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.post(
  '/:id/priority',
  updatePriorityValidators,
  validateRequest,
  moderationController.updatePriority
);

/**
 * @swagger
 * /api/moderation/stats:
 *   get:
 *     summary: Get moderation statistics
 *     tags: [Moderation]
 *     responses:
 *       200:
 *         description: Stats
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/stats',
  moderationController.getStats
);

export default router;

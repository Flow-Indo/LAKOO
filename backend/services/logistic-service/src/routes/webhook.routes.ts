import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';

const router: import('express').Router = Router();

// Biteship webhooks
/**
 * @swagger
 * /api/webhooks/biteship:
 *   post:
 *     summary: Biteship webhook receiver
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post('/biteship', webhookController.handleBiteshipWebhook);

// Test endpoint (dev only) - do not register in production
if (process.env.NODE_ENV !== 'production') {
  /**
   * @swagger
   * /api/webhooks/biteship/test:
   *   post:
   *     summary: Test Biteship webhook (development only)
   *     tags: [Webhooks]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Test processed
   */
  router.post('/biteship/test', webhookController.testBiteshipWebhook);
}

export default router;

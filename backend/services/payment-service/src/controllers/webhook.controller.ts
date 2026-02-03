import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { PaymentService } from '../services/payment.service';
import { CryptoUtils } from '../utils/crypto.utils';

export class WebhookController {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  handleXenditCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get webhook verification token from environment
      const webhookVerificationToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN || '';
      const receivedSignature = (req.headers['x-callback-token'] as string | undefined) ?? '';

      // Fail closed in production when the verification token is missing.
      if (process.env.NODE_ENV === 'production' && !webhookVerificationToken) {
        console.error('XENDIT_WEBHOOK_VERIFICATION_TOKEN not configured');
        res.status(500).json({ error: 'Webhook verification not configured' });
        return;
      }

      // Dev fallback: allow local testing if token is intentionally unset.
      if (!(process.env.NODE_ENV === 'development' && !webhookVerificationToken)) {
        // Verify webhook signature using callback token comparison
        if (!CryptoUtils.verifyXenditWebhook('', receivedSignature, webhookVerificationToken)) {
          console.warn('Invalid webhook signature received');
          res.status(403).json({ error: 'Invalid webhook signature' });
          return;
        }
      }

      const callbackData = req.body;
      const eventId = callbackData.id || callbackData.external_id;
      const webhookType = callbackData.status || 'unknown';

      // Check if webhook already processed using PaymentGatewayLog
      const existingLog = await prisma.paymentGatewayLog.findFirst({
        where: {
          isWebhook: true,
          webhookType: webhookType,
          requestBody: {
            path: ['id'],
            equals: callbackData.id || eventId
          }
        }
      });

      if (existingLog) {
        console.log(`Webhook event ${eventId} already processed - ignoring`);
        res.json({ received: true, message: 'Already processed' });
        return;
      }

      // Find payment by gateway transaction ID
      const payment = await prisma.payment.findFirst({
        where: { gatewayTransactionId: callbackData.id }
      });

      // Log the webhook
      await prisma.paymentGatewayLog.create({
        data: {
          paymentId: payment?.id,
          action: `webhook_${webhookType.toLowerCase()}`,
          requestMethod: 'POST',
          requestUrl: '/api/webhooks/xendit/invoice',
          requestBody: callbackData,
          responseStatus: 200,
          isWebhook: true,
          webhookType: webhookType
        }
      });

      if (callbackData.status === 'PAID') {
        await this.paymentService.handlePaidCallback(callbackData);
      } else if (callbackData.status === 'EXPIRED') {
        await this.paymentService.handleExpiredCallback(callbackData);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  };
}

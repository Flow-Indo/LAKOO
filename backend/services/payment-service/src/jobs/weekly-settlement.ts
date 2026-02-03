/**
 * Weekly Settlement Job
 * Creates a reconciliation settlement record for the payment gateway (Xendit).
 *
 * Note: LAKOO does not have "factoryId" identifiers. Seller payouts/settlements are a separate concern
 * and should be driven by Seller/Wallet services + the CommissionLedger, not Payment.metadata.
 */

import { prisma } from '../lib/prisma';

interface SettlementSummary {
  settlementDate: Date;
  paymentGateway: string;
  totalAmount: number;
  paymentCount: number;
  totalFees: number;
  netAmount: number;
  totalRefunds: number;
  refundAmount: number;
}

export async function weeklySettlementJob(options?: {
  periodStart?: Date;
  periodEnd?: Date;
  dryRun?: boolean;
}): Promise<{
  settlement: SettlementSummary | null;
  processedAt: Date;
  periodStart: Date;
  periodEnd: Date;
}> {
  console.log('[WeeklySettlementJob] Starting...');
  const startTime = Date.now();

  // Default to last 7 days if not specified
  const periodEnd = options?.periodEnd || new Date();
  const periodStart = options?.periodStart || new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

  const paymentGateway = 'xendit';

  // SettlementRecord.settlementDate is a DATE (no time). Use the period end date for idempotency.
  const settlementDate = new Date(periodEnd.toISOString().slice(0, 10));

  try {
    // Find all paid payments that haven't been settled
    const eligiblePayments = await prisma.payment.findMany({
      where: {
        status: 'paid',
        paidAt: {
          gte: periodStart,
          lt: periodEnd
        }
      },
      select: {
        id: true,
        amount: true,
        gatewayFee: true,
        netAmount: true,
        orderId: true
      }
    });

    if (eligiblePayments.length === 0) {
      console.log('[WeeklySettlementJob] No eligible payments found for settlement.');
      return {
        settlement: null,
        processedAt: new Date(),
        periodStart,
        periodEnd
      };
    }

    const totalAmount = eligiblePayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalFees = eligiblePayments.reduce((sum, p) => sum + Number(p.gatewayFee), 0);
    const netAmount = totalAmount - totalFees;

    const refundAgg = await prisma.refund.aggregate({
      where: {
        status: 'completed',
        completedAt: {
          gte: periodStart,
          lt: periodEnd
        }
      },
      _sum: { amount: true },
      _count: true
    });

    const totalRefunds = refundAgg._count;
    const refundAmount = Number(refundAgg._sum.amount || 0);

    const summary: SettlementSummary = {
      settlementDate,
      paymentGateway,
      totalAmount,
      paymentCount: eligiblePayments.length,
      totalFees,
      netAmount,
      totalRefunds,
      refundAmount
    };

    if (!options?.dryRun) {
      const existing = await prisma.settlementRecord.findUnique({
        where: {
          settlementDate_paymentGateway: {
            settlementDate,
            paymentGateway
          }
        }
      });

      if (existing) {
        console.log(`[WeeklySettlementJob] Settlement already exists for ${settlementDate.toISOString().slice(0, 10)} (${paymentGateway}) - skipping create.`);
      } else {
        await prisma.$transaction(async (tx) => {
          const created = await tx.settlementRecord.create({
            data: {
              settlementDate,
              paymentGateway,
              totalPayments: eligiblePayments.length,
              totalAmount,
              totalFees,
              netAmount,
              totalRefunds,
              refundAmount,
              notes: `Gateway settlement (${paymentGateway}) ${periodStart.toISOString()} - ${periodEnd.toISOString()}`
            }
          });

          // Publish settlement event to outbox for other services (aggregateId must be a UUID).
          await tx.serviceOutbox.create({
            data: {
              aggregateType: 'Settlement',
              aggregateId: created.id,
              eventType: 'settlement.completed',
              payload: {
                settlementId: created.id,
                settlementDate: created.settlementDate.toISOString().slice(0, 10),
                paymentGateway,
                periodStart: periodStart.toISOString(),
                periodEnd: periodEnd.toISOString(),
                totalPayments: eligiblePayments.length,
                totalAmount,
                totalFees,
                netAmount,
                totalRefunds,
                refundAmount,
                paymentIds: eligiblePayments.map(p => p.id)
              }
            }
          });
        });
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[WeeklySettlementJob] Completed in ${duration}ms. Processed ${eligiblePayments.length} payments.`);

    return {
      settlement: summary,
      processedAt: new Date(),
      periodStart,
      periodEnd
    };
  } catch (error) {
    console.error('[WeeklySettlementJob] Error:', error);
    throw error;
  }
}

// Run as standalone script
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  weeklySettlementJob({ dryRun })
    .then(result => {
      console.log('Job completed:', JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Job failed:', error);
      process.exit(1);
    });
}

import Xendit from 'xendit-node';

const xenditSecretKey = process.env.XENDIT_SECRET_KEY || '';

if (!xenditSecretKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('XENDIT_SECRET_KEY not set');
  }
  console.warn('XENDIT_SECRET_KEY not set - payment gateway will not work');
}

export const xenditClient = new Xendit({
  secretKey: xenditSecretKey
});

export const xenditInvoiceClient = xenditClient.Invoice;

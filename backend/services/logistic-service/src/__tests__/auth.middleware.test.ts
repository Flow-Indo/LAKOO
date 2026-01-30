import { internalServiceAuth } from '../middleware/auth';
import { generateServiceToken } from '../utils/serviceAuth';

describe('internalServiceAuth', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    process.env.NODE_ENV = 'production';
    process.env.SERVICE_SECRET = 'test-secret';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('rejects when x-service-name does not match signed token serviceName', async () => {
    const token = generateServiceToken('order-service', process.env.SERVICE_SECRET!);

    const req: any = {
      headers: {
        'x-service-auth': token,
        'x-service-name': 'payment-service'
      }
    };
    const res: any = {};
    const next = jest.fn();

    internalServiceAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0]![0];
    expect(err).toBeTruthy();
    expect(err.message).toMatch(/mismatch|Invalid service authentication token/i);
  });
});


import { internalServiceAuth } from '../middleware/auth';
import { generateServiceToken } from '../utils/serviceAuth';
import { UnauthorizedError } from '../middleware/error-handler';

describe('internalServiceAuth', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.NODE_ENV = 'test';
    process.env.SERVICE_SECRET = 'test-service-secret';
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('accepts a valid token when x-service-name matches the signed serviceName', () => {
    const serviceName = 'content-service';
    const token = generateServiceToken(serviceName, process.env.SERVICE_SECRET!);

    const req: any = {
      headers: {
        'x-service-auth': token,
        'x-service-name': serviceName
      }
    };
    const res: any = {};
    const next = jest.fn();

    internalServiceAuth(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({ id: serviceName, role: 'internal' });
  });

  it('rejects when x-service-name does not match the signed token serviceName', () => {
    const token = generateServiceToken('content-service', process.env.SERVICE_SECRET!);

    const req: any = {
      headers: {
        'x-service-auth': token,
        'x-service-name': 'warehouse-service'
      }
    };
    const res: any = {};
    const next = jest.fn();

    internalServiceAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0]?.[0];
    expect(err).toBeInstanceOf(UnauthorizedError);
    expect((err as UnauthorizedError).statusCode).toBe(401);
  });
});


import { gatewayAuth } from '../middleware/auth';

describe('gatewayAuth dev fallback role inference', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('infers moderator role for /api/moderation when no role headers/env', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.GATEWAY_SECRET_KEY;

    const req: any = {
      headers: {},
      originalUrl: '/api/moderation/pending'
    };
    const res: any = {};
    const next = jest.fn();

    gatewayAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
    expect(req.user.role).toBe('moderator');
  });

  it('infers admin role for /api/admin when no role headers/env', async () => {
    process.env.NODE_ENV = 'development';
    delete process.env.GATEWAY_SECRET_KEY;

    const req: any = {
      headers: {},
      originalUrl: '/api/admin/products'
    };
    const res: any = {};
    const next = jest.fn();

    gatewayAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.user).toBeDefined();
    expect(req.user.role).toBe('admin');
  });
});


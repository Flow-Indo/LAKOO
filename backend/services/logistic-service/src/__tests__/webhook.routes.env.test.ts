describe('webhook routes env gating', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('does not register /biteship/test when NODE_ENV=production', async () => {
    process.env.NODE_ENV = 'production';
    const router = (await import('../routes/webhook.routes')).default as any;
    const paths = (router.stack ?? [])
      .map((layer: any) => layer?.route?.path)
      .filter((p: any): p is string => typeof p === 'string');

    expect(paths).not.toContain('/biteship/test');
  });

  it('registers /biteship/test when NODE_ENV!=production', async () => {
    process.env.NODE_ENV = 'development';
    const router = (await import('../routes/webhook.routes')).default as any;
    const paths = (router.stack ?? [])
      .map((layer: any) => layer?.route?.path)
      .filter((p: any): p is string => typeof p === 'string');

    expect(paths).toContain('/biteship/test');
  });
});


import shipmentRoutes from '../routes/shipment.routes';

function routePaths(router: any): string[] {
  const stack = router?.stack ?? [];
  return stack
    .map((layer: any) => layer?.route?.path)
    .filter((p: any): p is string => typeof p === 'string');
}

describe('shipment routes ordering', () => {
  it('registers /order/:orderId before /:id to avoid route collision', () => {
    const paths = routePaths(shipmentRoutes);
    const orderIdx = paths.indexOf('/order/:orderId');
    const idIdx = paths.indexOf('/:id');

    expect(orderIdx).toBeGreaterThanOrEqual(0);
    expect(idIdx).toBeGreaterThanOrEqual(0);
    expect(orderIdx).toBeLessThan(idIdx);
  });
});


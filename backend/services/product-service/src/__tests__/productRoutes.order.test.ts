import productRoutes from '../routes/product.routes';

describe('product.routes route ordering', () => {
  it('keeps the catch-all /:slug route last', () => {
    const stack = (productRoutes as any).stack as Array<any>;
    const routeLayers = stack.filter(layer => layer.route);

    expect(routeLayers.length).toBeGreaterThan(0);
    const last = routeLayers[routeLayers.length - 1]!.route;

    expect(last.path).toBe('/:slug');
    expect(last.methods?.get).toBe(true);
  });
});


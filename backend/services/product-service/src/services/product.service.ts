import { ProductRepository  } from "../repositories/product.repository"; 
import { CreateProductDTO, UpdateProductDTO, ProductQuery, CreateVariantDTO } from "../types"; 
import { warehouseServiceClient } from "../clients/warehouse.client";

export class ProductService {
    private repository : ProductRepository;

    constructor() { 
        this.repository  = new ProductRepository();
    }

    async createProduct(data: CreateProductDTO) { 
        return this.repository.create(data);
    }
    async getProducts(query: ProductQuery) { 
        return this.repository.findAll(query);
    }
    async getProductById(id: string) { 
        const product = await this.repository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    async updateProduct(id: string, data: UpdateProductDTO) { 

        const product = await this.repository.update(id, data);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    async getVariantById(variantId: string) {
        const variant = await this.repository.findVariantById(variantId);
        if (!variant) {
            throw new Error('Variant not found');
        }
        return variant;
    }
    async createVariant(data: CreateVariantDTO) { 
        const product = await this.repository.createVariant(data);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    async getProductBySlug(slug: string) { 
        const product = await this.repository.findBySlug(slug);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    async deleteProduct(id: string) {
        return this.repository.delete(id);
    }
    async addProductImages(productId: string, images: { imageUrl: string; sortOrder: number }[]) {
        const product = await this.repository.findById(productId);
        if (!product) {
        throw new Error('Product not found');
        }
        return this.repository.addImages(productId, images);
    }
    async publishProduct(id: string) {
        const product = await this.repository.findById(id);
        if (!product) {
        throw new Error('Product not found');
        }
        return this.repository.publish(id);
    }

    // ============= Grosir Config Management (Simplified) =============

     /**
      * Set bundle composition for grosir - defines units per bundle for each variant
      */
    async setBundleComposition(productId: string, compositions: { variantId: string | null; unitsInBundle: number }[]) {
        const product = await this.repository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.sellerId) {
            throw new Error('Grosir configuration is only supported for house brand products');
        }

        // Validate units in bundle
        for (const comp of compositions) {
            if (comp.unitsInBundle < 1) {
                throw new Error('Units in bundle must be at least 1');
            }
        }

        const sizeBreakdown: Record<string, number> = {};
        let totalUnits = 0;
        let bundleCost = 0;

        for (const comp of compositions) {
            const units = comp.unitsInBundle;
            totalUnits += units;

            if (comp.variantId) {
                const variant = product.variants?.find(v => v.id === comp.variantId);
                if (!variant) {
                    throw new Error(`Variant not found: ${comp.variantId}`);
                }
                const sizeKey = variant.size || 'default';
                sizeBreakdown[sizeKey] = (sizeBreakdown[sizeKey] || 0) + units;

                const cost = (variant.costPrice as any)?.toNumber?.() ?? Number(variant.costPrice as any);
                bundleCost += cost * units;
            } else {
                sizeBreakdown['default'] = (sizeBreakdown['default'] || 0) + units;
                const cost = (product.baseCostPrice as any)?.toNumber?.() ?? Number(product.baseCostPrice as any);
                bundleCost += cost * units;
            }
        }

        await this.repository.update(productId, { grosirUnitSize: totalUnits });

        return warehouseServiceClient.updateBundleConfig({
            productId,
            bundleName: `${product.name} Bundle`,
            totalUnits,
            sizeBreakdown,
            bundleCost: bundleCost.toString()
        });
    }

    /**
     * Set warehouse inventory configuration - max stock and reorder thresholds
     */
    async setWarehouseInventoryConfig(productId: string, configs: { variantId: string | null; maxStockLevel: number; reorderThreshold: number }[]) {
        const product = await this.repository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.sellerId) {
            throw new Error('Warehouse inventory configuration is only supported for house brand products');
        }

        // Validate config values
        for (const config of configs) {
            if (config.maxStockLevel < 0) {
                throw new Error('Max stock level cannot be negative');
            }
            if (config.reorderThreshold < 0) {
                throw new Error('Reorder threshold cannot be negative');
            }
            if (config.reorderThreshold > config.maxStockLevel) {
                throw new Error('Reorder threshold cannot exceed max stock level');
            }
        }

        const variants = product.variants || [];
        const requestedVariantIds = new Set<string>();
        const applyToAll = configs.some(c => c.variantId === null);

        for (const cfg of configs) {
            if (cfg.variantId) requestedVariantIds.add(cfg.variantId);
        }

        const targets = applyToAll
            ? variants
            : variants.filter(v => requestedVariantIds.has(v.id));

        const existingInventory = await warehouseServiceClient.getAllInventory(productId);
        const existingVariantIds = new Set(existingInventory.map(row => row.variantId).filter((id): id is string => Boolean(id)));

        const createResults: Array<{ variantId: string; created: boolean; reason?: string }> = [];
        for (const target of targets) {
            const cfg = configs.find(c => c.variantId === null || c.variantId === target.id);
            if (!cfg) continue;

            if (existingVariantIds.has(target.id)) {
                createResults.push({ variantId: target.id, created: false });
                continue;
            }

            await warehouseServiceClient.ensureInventoryRecord({
                productId,
                variantId: target.id,
                sku: target.sku,
                maxStockLevel: cfg.maxStockLevel,
                reorderPoint: cfg.reorderThreshold,
                skipCheck: true
            });
            existingVariantIds.add(target.id);

            createResults.push({ variantId: target.id, created: true });
        }

        return { productId, results: createResults };
    }

    /**
     * Get grosir configuration - bundle composition and warehouse inventory settings
     */
    async getGrosirConfig(productId: string) {
        const product = await this.repository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.sellerId) {
            throw new Error('Grosir configuration is only supported for house brand products');
        }

        const status = await warehouseServiceClient.checkAllVariantsOverflow(productId);
        return {
            productId,
            grosirUnitSize: product.grosirUnitSize ?? null,
            warehouse: status
        };
    }
}

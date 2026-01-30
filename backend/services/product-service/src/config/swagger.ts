import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'LAKOO product-service API (products, categories, drafts, moderation, admin).',
      contact: {
        name: 'LAKOO Engineering'
      }
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || `http://localhost:${process.env.PORT || 3002}`,
        description: 'Server'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            categoryId: { type: 'string', format: 'uuid' },
            sellerId: { type: 'string', format: 'uuid', nullable: true },
            draftId: { type: 'string', format: 'uuid', nullable: true },
            productCode: { type: 'string', example: 'PRD-ABC123' },
            name: { type: 'string', example: 'Batik Pekalongan Premium' },
            slug: { type: 'string', example: 'batik-pekalongan-premium' },
            description: { type: 'string', example: 'High quality batik fabric' },
            shortDescription: { type: 'string', nullable: true },
            status: {
              type: 'string',
              enum: ['draft', 'pending_approval', 'approved', 'rejected', 'inactive', 'out_of_stock'],
              default: 'draft'
            },
            baseCostPrice: { type: 'number', example: 100000 },
            baseSellPrice: { type: 'number', example: 150000 },
            primaryImageUrl: { type: 'string', nullable: true },
            weightGrams: { type: 'integer', example: 200, nullable: true },
            lengthCm: { type: 'number', nullable: true },
            widthCm: { type: 'number', nullable: true },
            heightCm: { type: 'number', nullable: true },
            tags: { type: 'array', items: { type: 'string' } },
            grosirUnitSize: { type: 'integer', nullable: true, example: 12 },
            publishedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        CreateProduct: {
          type: 'object',
          required: ['categoryId', 'name', 'baseSellPrice'],
          properties: {
            categoryId: { type: 'string', format: 'uuid' },
            sellerId: { type: 'string', format: 'uuid', nullable: true },
            name: { type: 'string', example: 'Batik Pekalongan Premium' },
            description: { type: 'string', example: 'High quality batik fabric from Pekalongan' },
            shortDescription: { type: 'string', example: 'Premium batik fabric' },
            baseCostPrice: { type: 'number', example: 100000 },
            baseSellPrice: { type: 'number', example: 150000 },
            weightGrams: { type: 'integer', example: 200 },
            lengthCm: { type: 'number', example: 20 },
            widthCm: { type: 'number', example: 11.5 },
            heightCm: { type: 'number', example: 2 },
            primaryImageUrl: { type: 'string' },
            material: { type: 'string' },
            careInstructions: { type: 'string' },
            countryOfOrigin: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            grosirUnitSize: { type: 'integer', example: 12 }
          }
        },
        UpdateProduct: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            shortDescription: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
            baseCostPrice: { type: 'number' },
            baseSellPrice: { type: 'number' },
            weightGrams: { type: 'integer' },
            lengthCm: { type: 'number' },
            widthCm: { type: 'number' },
            heightCm: { type: 'number' },
            status: {
              type: 'string',
              enum: ['draft', 'pending_approval', 'approved', 'rejected', 'inactive', 'out_of_stock']
            },
            primaryImageUrl: { type: 'string' },
            material: { type: 'string' },
            careInstructions: { type: 'string' },
            countryOfOrigin: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            grosirUnitSize: { type: 'integer' }
          }
        },
        ProductVariant: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            productId: { type: 'string', format: 'uuid' },
            sku: { type: 'string', example: 'PRD-ABC123-RED-XL' },
            color: { type: 'string', example: 'RED' },
            size: { type: 'string', example: 'XL' },
            costPrice: { type: 'number', example: 100000 },
            sellPrice: { type: 'number', example: 150000 },
            weightGrams: { type: 'integer', nullable: true },
            imageUrl: { type: 'string', nullable: true },
            barcode: { type: 'string', nullable: true },
            sortOrder: { type: 'integer', default: 0 },
            isDefault: { type: 'boolean', default: false },
            isActive: { type: 'boolean', default: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            deletedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        CreateVariant: {
          type: 'object',
          required: ['sku', 'color', 'size', 'costPrice', 'sellPrice'],
          properties: {
            sku: { type: 'string', example: 'PRD-ABC123-RED-XL' },
            color: { type: 'string', example: 'RED' },
            colorHex: { type: 'string', example: '#FF0000' },
            colorName: { type: 'string', example: 'Crimson Red' },
            size: { type: 'string', example: 'XL' },
            sizeName: { type: 'string', example: 'Extra Large' },
            material: { type: 'string' },
            style: { type: 'string' },
            costPrice: { type: 'number', example: 100000 },
            sellPrice: { type: 'number', example: 150000 },
            weightGrams: { type: 'integer', nullable: true },
            imageUrl: { type: 'string', nullable: true },
            barcode: { type: 'string', nullable: true },
            sortOrder: { type: 'integer', default: 0 },
            isDefault: { type: 'boolean', default: false }
          }
        },
        Category: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                parentId: { type: 'string', format: 'uuid', nullable: true },
                name: { type: 'string', example: 'Batik & Textiles' },
                slug: { type: 'string', example: 'batik-textiles' },
                description: { type: 'string', nullable: true },
                imageUrl: { type: 'string', nullable: true },
                iconUrl: { type: 'string', nullable: true },
                displayOrder: { type: 'integer', default: 0 },
                level: { type: 'integer', default: 0 },
                path: { type: 'string', nullable: true },
                isActive: { type: 'boolean', default: true },
                isFeatured: { type: 'boolean', default: false },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                deletedAt: { type: 'string', format: 'date-time', nullable: true }
            }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            code: { type: 'string', nullable: true }
          }
        },
        ProductDraft: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            sellerId: { type: 'string', format: 'uuid' },
            categoryId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            shortDescription: { type: 'string', nullable: true },
            baseSellPrice: { type: 'number' },
            images: { type: 'array', items: { type: 'string' } },
            variants: { type: 'array', items: { type: 'object' } },
            weightGrams: { type: 'integer', nullable: true },
            lengthCm: { type: 'number', nullable: true },
            widthCm: { type: 'number', nullable: true },
            heightCm: { type: 'number', nullable: true },
            material: { type: 'string', nullable: true },
            careInstructions: { type: 'string', nullable: true },
            countryOfOrigin: { type: 'string', nullable: true },
            tags: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['draft', 'pending', 'approved', 'rejected', 'changes_requested'] },
            submittedAt: { type: 'string', format: 'date-time', nullable: true },
            reviewedAt: { type: 'string', format: 'date-time', nullable: true },
            reviewedBy: { type: 'string', format: 'uuid', nullable: true },
            rejectionReason: { type: 'string', nullable: true },
            moderationNotes: { type: 'string', nullable: true },
            productId: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateDraft: {
          type: 'object',
          required: ['categoryId', 'name', 'baseSellPrice', 'images', 'variants'],
          properties: {
            seller_id: { type: 'string', format: 'uuid' },
            categoryId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            shortDescription: { type: 'string', nullable: true },
            baseSellPrice: { type: 'number' },
            images: { type: 'array', items: { type: 'string', format: 'uri' } },
            variants: {
              type: 'array',
              items: {
                type: 'object',
                required: ['color', 'size', 'sellPrice'],
                properties: {
                  color: { type: 'string' },
                  colorHex: { type: 'string', nullable: true },
                  colorName: { type: 'string', nullable: true },
                  size: { type: 'string' },
                  sizeName: { type: 'string', nullable: true },
                  sellPrice: { type: 'number' },
                  imageUrl: { type: 'string', nullable: true }
                }
              }
            },
            weightGrams: { type: 'integer', nullable: true },
            lengthCm: { type: 'number', nullable: true },
            widthCm: { type: 'number', nullable: true },
            heightCm: { type: 'number', nullable: true },
            material: { type: 'string', nullable: true },
            careInstructions: { type: 'string', nullable: true },
            countryOfOrigin: { type: 'string', nullable: true },
            tags: { type: 'array', items: { type: 'string' } }
          }
        },
        UpdateDraft: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            shortDescription: { type: 'string', nullable: true },
            baseSellPrice: { type: 'number' },
            images: { type: 'array', items: { type: 'string', format: 'uri' } },
            variants: { type: 'array', items: { type: 'object' } },
            weightGrams: { type: 'integer', nullable: true },
            lengthCm: { type: 'number', nullable: true },
            widthCm: { type: 'number', nullable: true },
            heightCm: { type: 'number', nullable: true },
            material: { type: 'string', nullable: true },
            careInstructions: { type: 'string', nullable: true },
            countryOfOrigin: { type: 'string', nullable: true },
            tags: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    }
  },
  // Support both dev (tsx, TS sources) and prod (node dist, JS output)
  apis: [
    path.join(__dirname, '..', 'routes', '*.ts'),
    path.join(__dirname, '..', 'routes', '*.js')
  ]
};

export const swaggerSpec = swaggerJsdoc(options);

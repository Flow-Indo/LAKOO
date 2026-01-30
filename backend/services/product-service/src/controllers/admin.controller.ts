import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProductRepository } from '../repositories/product.repository';
import { prisma } from '../lib/prisma';

export class AdminController {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  // Product Management
  createProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await this.repository.create(req.body);
      res.status(201).json({
        message: 'Product created successfully',
        data: product
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Product with this SKU already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const product = await this.repository.update(id, req.body);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json({
        message: 'Product updated successfully',
        data: product
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.repository.delete(id);

      res.json({
        message: 'Product deleted successfully'
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  updateProductStatus = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      const product = await prisma.product.update({
        where: { id },
        data: {
          status
        }
      });

      res.json({
        message: 'Product status updated successfully',
        data: product
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  // Variant Management
  createVariant = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const variantData = {
        ...req.body,
        productId: id
      };

      const variant = await this.repository.createVariant(variantData);

      res.status(201).json({
        message: 'Variant created successfully',
        data: variant
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Variant with this SKU already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  updateVariant = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { variantId } = req.params;

      const variant = await prisma.productVariant.update({
        where: { id: variantId },
        data: {
          sku: req.body.sku,
          color: req.body.color,
          colorHex: req.body.colorHex,
          colorName: req.body.colorName,
          size: req.body.size,
          sizeName: req.body.sizeName,
          material: req.body.material,
          style: req.body.style,
          costPrice: req.body.costPrice,
          sellPrice: req.body.sellPrice,
          weightGrams: req.body.weightGrams,
          imageUrl: req.body.imageUrl,
          barcode: req.body.barcode,
          sortOrder: req.body.sortOrder,
          isDefault: req.body.isDefault,
          isActive: req.body.isActive
        }
      });

      res.json({
        message: 'Variant updated successfully',
        data: variant
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Variant not found' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  deleteVariant = async (req: Request, res: Response) => {
    try {
      const { variantId } = req.params;

      await prisma.productVariant.update({
        where: { id: variantId },
        data: {
          isActive: false,
          deletedAt: new Date()
        }
      });

      res.json({
        message: 'Variant deleted successfully'
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Variant not found' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  // Image Management
  addImages = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { images } = req.body;

      const createdImages = await prisma.productImage.createMany({
        data: images.map((img: any, index: number) => ({
          productId: id,
          imageUrl: img.imageUrl,
          altText: img.altText || null,
          displayOrder: img.displayOrder ?? index,
          isPrimary: index === 0
        }))
      });

      res.status(201).json({
        message: 'Images added successfully',
        count: createdImages.count
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  reorderImages = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { imageOrder } = req.body;

      // Update each image's display order
      const updates = imageOrder.map((item: { imageId: string; displayOrder: number }) =>
        prisma.productImage.update({
          where: { id: item.imageId },
          data: { displayOrder: item.displayOrder }
        })
      );

      await prisma.$transaction(updates);

      res.json({
        message: 'Images reordered successfully'
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  deleteImage = async (req: Request, res: Response) => {
    try {
      const { imageId } = req.params;

      await prisma.productImage.delete({
        where: { id: imageId }
      });

      res.json({
        message: 'Image deleted successfully'
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  // Bulk Operations
  bulkUpdate = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { products } = req.body;

      const updates = products.map((product: { id: string; data: any }) =>
        prisma.product.update({
          where: { id: product.id },
          data: {
            ...product.data
          }
        })
      );

      const results = await prisma.$transaction(updates);

      res.json({
        message: 'Products updated successfully',
        count: results.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  bulkDelete = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { productIds } = req.body;

      // Soft delete - set status to archived
      const result = await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: {
          status: 'inactive'
        }
      });

      res.json({
        message: 'Products deleted successfully',
        count: result.count
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  bulkImport = async (req: Request, res: Response) => {
    res.status(501).json({
      error: 'Not implemented',
      message: 'CSV import functionality is not yet implemented'
    });
  };

  // Category Management
  createCategory = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, parentId, iconUrl, displayOrder } = req.body;

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description,
          parentId: parentId || null,
          iconUrl: iconUrl || null,
          displayOrder: displayOrder || 0
        }
      });

      res.status(201).json({
        message: 'Category created successfully',
        data: category
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Category with this name already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  updateCategory = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, description, parentId, iconUrl, displayOrder } = req.body;

      const updateData: any = {
        updatedAt: new Date()
      };

      if (name !== undefined) {
        updateData.name = name;
        updateData.slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      if (description !== undefined) updateData.description = description;
      if (parentId !== undefined) updateData.parentId = parentId;
      if (iconUrl !== undefined) updateData.iconUrl = iconUrl;
      if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

      const category = await prisma.category.update({
        where: { id },
        data: updateData
      });

      res.json({
        message: 'Category updated successfully',
        data: category
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(500).json({ error: error.message });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if category has products
      const productCount = await prisma.product.count({
        where: { categoryId: id }
      });

      if (productCount > 0) {
        return res.status(400).json({
          error: 'Cannot delete category with associated products',
          productCount
        });
      }

      // Check if category has children
      const childCount = await prisma.category.count({
        where: { parentId: id }
      });

      if (childCount > 0) {
        return res.status(400).json({
          error: 'Cannot delete category with child categories',
          childCount
        });
      }

      await prisma.category.delete({
        where: { id }
      });

      res.json({
        message: 'Category deleted successfully'
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(500).json({ error: error.message });
    }
  };
}

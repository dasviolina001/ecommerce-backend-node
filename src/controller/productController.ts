import { Request, Response } from "express";

import { productService } from "../service/productService";

import { CustomError } from "../middleware/errorHandler";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const mainImagePath = files?.mainImage?.[0]?.path;
    const productImagesPaths =
      files?.productImages?.map((file) => file.path) || [];

    const productData: any = {
      productName: req.body.productName,
      shortDesc: req.body.shortDesc,
      longDesc: req.body.longDesc,

      mainImage: mainImagePath || req.body.mainImage,

      productImages:
        productImagesPaths.length > 0
          ? productImagesPaths
          : req.body.productImages
            ? JSON.parse(req.body.productImages)
            : [],

      youtubeLink: req.body.youtubeLink,
      size: req.body.size,

      expiryDate: req.body.expiryDate
        ? new Date(req.body.expiryDate)
        : undefined,

      buyingPrice: req.body.buyingPrice
        ? parseFloat(req.body.buyingPrice)
        : undefined,

      maximumRetailPrice: req.body.maximumRetailPrice
        ? parseFloat(req.body.maximumRetailPrice)
        : undefined,

      sellingPrice: req.body.sellingPrice
        ? parseFloat(req.body.sellingPrice)
        : undefined,

      quantity: req.body.quantity ? parseInt(req.body.quantity) : 0,

      paymentType: req.body.paymentType,

      dimensions: req.body.dimensions
        ? JSON.parse(req.body.dimensions)
        : undefined,

      metaData: req.body.metaData ? JSON.parse(req.body.metaData) : undefined,

      masterCategoryId: req.body.masterCategoryId,
      lastCategoryId: req.body.lastCategoryId,
      sizeChartId: req.body.sizeChartId,

      isFeatured: req.body.isFeatured === "true",
      isBestSelling: req.body.isBestSelling === "true",
      isNewCollection: req.body.isNewCollection === "true",
      isRelatedItem: req.body.isRelatedItem === "true",
      hasVariants: req.body.hasVariants === "true",
    };

    if (!productData.productName) {
      throw new CustomError("Product name is required", 400);
    }

    if (!productData.mainImage) {
      throw new CustomError(
        "Main image is required (upload file or provide URL)",
        400,
      );
    }

    if (!productData.masterCategoryId) {
      throw new CustomError("Master category ID is required", 400);
    }

    const product = await productService.createProduct(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    throw error;
  }
};

export const createProductWithVariants = async (
  req: Request,
  res: Response,
) => {
  try {
    const { product, variants } = req.body;

    if (!product) {
      throw new CustomError("Product data is required", 400);
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      throw new CustomError("At least one variant is required", 400);
    }

    const createdProduct = await productService.createProductWithVariants({
      product,
      variants,
    });

    res.status(201).json({
      success: true,
      data: createdProduct,
      message: `Product created with ${variants.length} variant(s)`,
    });
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    throw error;
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const filters: any = {
      categoryId: req.query.categoryId as string | undefined,
    };

    if (req.query.isFeatured !== undefined) {
      filters.isFeatured = req.query.isFeatured === "true";
    }

    if (req.query.isBestSelling !== undefined) {
      filters.isBestSelling = req.query.isBestSelling === "true";
    }

    if (req.query.isNewCollection !== undefined) {
      filters.isNewCollection = req.query.isNewCollection === "true";
    }

    if (req.query.minPrice !== undefined) {
      filters.minPrice = Number(req.query.minPrice);
    }

    if (req.query.maxPrice !== undefined) {
      filters.maxPrice = Number(req.query.maxPrice);
    }

    const result = await productService.getAllProducts(page, limit, filters);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    throw error;
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      throw new CustomError("Updates must be an array", 400);
    }

    const result = await productService.updateInventory(updates);
    res
      .status(200)
      .json({ success: true, message: "Inventory updated", data: result });
  } catch (error) {
    throw error;
  }
};

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
      sku: req.body.sku,
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
    const filesArray = req.files as Express.Multer.File[];

    let productData = null;
    let variantsData = null;

    try {
      productData = req.body.product ? JSON.parse(req.body.product) : null;
    } catch (e) {
      throw new CustomError(
        "Invalid product data format. Must be valid JSON.",
        400,
      );
    }

    try {
      variantsData = req.body.variants ? JSON.parse(req.body.variants) : null;
    } catch (e) {
      throw new CustomError(
        "Invalid variants data format. Must be valid JSON.",
        400,
      );
    }

    if (!productData) {
      throw new CustomError("Product data is required", 400);
    }

    if (
      !variantsData ||
      !Array.isArray(variantsData) ||
      variantsData.length === 0
    ) {
      throw new CustomError("At least one variant is required", 400);
    }

    const filesByField: { [key: string]: Express.Multer.File[] } = {};
    if (filesArray && Array.isArray(filesArray)) {
      filesArray.forEach((file) => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = [];
        }
        filesByField[file.fieldname].push(file);
      });
    }

    const mainImagePath = filesByField.mainImage?.[0]?.path;
    const productImagesPaths =
      filesByField.productImages?.map((file) => file.path) || [];

    const product = {
      ...productData,
      mainImage: mainImagePath || productData.mainImage,
      productImages:
        productImagesPaths.length > 0
          ? productImagesPaths
          : productData.productImages || [],
    };

    const processedVariants = variantsData.map(
      (variant: any, index: number) => {
        const variantImageField = `variantImage_${index}`;
        const variantImagesField = `variantImages_${index}`;

        const variantImagePath = filesByField[variantImageField]?.[0]?.path;
        const variantImagesPaths =
          filesByField[variantImagesField]?.map((file) => file.path) || [];

        return {
          ...variant,
          ...(variantImagePath && { variantImages: [variantImagePath] }),
          ...(variantImagesPaths.length > 0 && {
            variantImages: variantImagesPaths,
          }),
        };
      },
    );

    const createdProduct = await productService.createProductWithVariants({
      product,
      variants: processedVariants,
    });

    res.status(201).json({
      success: true,
      data: createdProduct,
      message: `Product created with ${variantsData.length} variant(s)`,
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

    if (req.query.includeInactive !== undefined) {
      filters.includeInactive = req.query.includeInactive === "true";
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

export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const result = await productService.getProductsByCategory(
      categoryId,
      page,
      limit,
    );

    res.status(200).json({ success: true, ...result });
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

export const getInventoryList = async (req: Request, res: Response) => {
  try {
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const inventoryList = await productService.getInventoryList(page, limit);
    res.status(200).json({ success: true, data: inventoryList });
  } catch (error) {
    throw error;
  }
};

export const updateProductWithVariants = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const filesArray = req.files as Express.Multer.File[];

    let productData = null;
    let variantsData = null;
    let deleteVariantIds = null;

    // Parse JSON data from form
    try {
      productData = req.body.product ? JSON.parse(req.body.product) : null;
    } catch (e) {
      throw new CustomError(
        "Invalid product data format. Must be valid JSON.",
        400,
      );
    }

    try {
      variantsData = req.body.variants ? JSON.parse(req.body.variants) : null;
    } catch (e) {
      throw new CustomError(
        "Invalid variants data format. Must be valid JSON.",
        400,
      );
    }

    try {
      deleteVariantIds = req.body.deleteVariantIds
        ? JSON.parse(req.body.deleteVariantIds)
        : null;
    } catch (e) {
      throw new CustomError(
        "Invalid deleteVariantIds format. Must be valid JSON.",
        400,
      );
    }

    // Organize uploaded files by field name
    const filesByField: { [key: string]: Express.Multer.File[] } = {};
    if (filesArray && Array.isArray(filesArray)) {
      filesArray.forEach((file) => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = [];
        }
        filesByField[file.fieldname].push(file);
      });
    }

    // Process product images if provided
    if (productData) {
      const mainImagePath = filesByField.mainImage?.[0]?.path;
      const productImagesPaths =
        filesByField.productImages?.map((file) => file.path) || [];

      if (mainImagePath) {
        productData.mainImage = mainImagePath;
      }

      if (productImagesPaths.length > 0) {
        productData.productImages = productImagesPaths;
      }
    }

    // Process variant images if variants are provided
    const processedVariants = variantsData?.map(
      (variant: any, index: number) => {
        const variantImageField = `variantImage_${index}`;
        const variantImagesField = `variantImages_${index}`;

        const variantImagePath = filesByField[variantImageField]?.[0]?.path;
        const variantImagesPaths =
          filesByField[variantImagesField]?.map((file) => file.path) || [];

        return {
          ...variant,
          ...(variantImagePath && { variantImages: [variantImagePath] }),
          ...(variantImagesPaths.length > 0 && {
            variantImages: variantImagesPaths,
          }),
        };
      },
    );

    const updatedProduct = await productService.updateProductWithVariants(id, {
      product: productData,
      variants: processedVariants,
      deleteVariantIds,
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product and variants updated successfully",
    });
  } catch (error) {
    throw error;
  }
};

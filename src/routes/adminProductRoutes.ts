import express from "express";

import {
  createProduct,
  createProductWithVariants,
  updateProduct,
  deleteProduct,
  updateInventory,
  getProducts,
  getProductById,
} from "../controller/productController";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import { asyncHandler } from "../middleware/errorHandler";

import { productImageUpload } from "../config/multer";

const router = express.Router();

router.post(
  "/with-variants",
  authMiddleware as any,
  adminAuthMiddleware as any,
  asyncHandler(createProductWithVariants),
);

router
  .route("/")
  .post(
    authMiddleware as any,
    adminAuthMiddleware as any,
    productImageUpload,
    asyncHandler(createProduct),
  )
  .get(
    authMiddleware as any,
    adminAuthMiddleware as any,
    asyncHandler(getProducts),
  );

router.patch(
  "/inventory/update",
  authMiddleware as any,
  adminAuthMiddleware as any,
  asyncHandler(updateInventory),
);

router.get(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  asyncHandler(getProductById),
);

router.put(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  asyncHandler(updateProduct),
);

router.delete(
  "/:id",
  authMiddleware as any,
  adminAuthMiddleware as any,
  asyncHandler(deleteProduct),
);

export default router;

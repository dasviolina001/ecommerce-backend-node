import express from "express";

import {
  getVariantById,
  getVariantsByProductId,
  getAvailableColors,
  getAvailableSizes,
  getAllVariants,
} from "../controller/productVariantController";

import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

// Get all variants across all products
router.get("/variants", asyncHandler(getAllVariants));

router.get("/:productId/variants", asyncHandler(getVariantsByProductId));


router.get("/:productId/variants/colors", asyncHandler(getAvailableColors));


router.get("/:productId/variants/sizes", asyncHandler(getAvailableSizes));


router.get("/:productId/variants/:variantId", asyncHandler(getVariantById));

export default router;

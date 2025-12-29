import { Router } from "express";

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controller/categoryController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", asyncHandler(createCategory));

router.put("/:categoryId", asyncHandler(updateCategory));

router.delete("/:categoryId", asyncHandler(deleteCategory));

export default router;

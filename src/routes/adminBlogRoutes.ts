import { Router } from "express";

import {
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controller/blogController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

import { blogImageUpload } from "../config/multer";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", blogImageUpload, asyncHandler(createBlog));

router.put("/:id", blogImageUpload, asyncHandler(updateBlog));

router.delete("/:id", asyncHandler(deleteBlog));

export default router;

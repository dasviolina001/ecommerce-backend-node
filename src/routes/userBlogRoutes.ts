import { Router } from "express";

import {
  getAllBlogs,
  getBlogById,
} from "../controller/blogController";

import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.get("/", asyncHandler(getAllBlogs));

router.get("/:id", asyncHandler(getBlogById));

export default router;

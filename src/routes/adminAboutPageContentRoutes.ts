import { Router } from "express";

import {
    createAboutPageContent,
    updateAboutPageContent,
    deleteAboutPageContent,
} from "../controller/aboutPageContentController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", asyncHandler(createAboutPageContent));

router.put("/:id", asyncHandler(updateAboutPageContent));

router.delete("/:id", asyncHandler(deleteAboutPageContent));

export default router;

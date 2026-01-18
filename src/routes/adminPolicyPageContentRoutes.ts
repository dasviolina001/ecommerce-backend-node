import { Router } from "express";

import {
    createPolicyPageContent,
    updatePolicyPageContent,
    deletePolicyPageContent,
} from "../controller/policyPageContentController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", asyncHandler(createPolicyPageContent));

router.put("/:id", asyncHandler(updatePolicyPageContent));

router.delete("/:id", asyncHandler(deletePolicyPageContent));

export default router;

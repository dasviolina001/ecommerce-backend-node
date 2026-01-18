import { Router } from "express";

import {
    getAllPolicyPageContent,
    getPolicyPageContentById,
} from "../controller/policyPageContentController";

import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.get("/", asyncHandler(getAllPolicyPageContent));

router.get("/:id", asyncHandler(getPolicyPageContentById));

export default router;

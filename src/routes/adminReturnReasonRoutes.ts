import { Router } from "express";

import {
    createReturnReason,
    getAllReturnReasons,
    getReturnReasonById,
    updateReturnReason,
    deleteReturnReason,
} from "../controller/returnReasonController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", asyncHandler(createReturnReason));

router.get("/", asyncHandler(getAllReturnReasons));

router.get("/:id", asyncHandler(getReturnReasonById));

router.put("/:id", asyncHandler(updateReturnReason));

router.delete("/:id", asyncHandler(deleteReturnReason));

export default router;

import { Router } from "express";

import {
    getAllReturnReasons,
    getReturnReasonById,
} from "../controller/returnReasonController";

import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.get("/", asyncHandler(getAllReturnReasons));

router.get("/:id", asyncHandler(getReturnReasonById));

export default router;

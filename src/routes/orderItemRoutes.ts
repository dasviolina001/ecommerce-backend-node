import { Router } from "express";

import { updateItemStatus } from "../controller/orderItemController";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.put("/:id/status", authMiddleware as any, adminAuthMiddleware as any, updateItemStatus);

export default router;

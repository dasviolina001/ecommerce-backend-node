import { Router } from "express";
import { updateItemStatus } from "../controller/orderItemController";
import { authMiddleware } from "../middleware/auth";
import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

// Only admins can update order item status for now
router.put("/:id/status", authMiddleware as any, adminAuthMiddleware as any, updateItemStatus);

export default router;

import { Router } from "express";

import {
    createOrUpdateDeliveryManagement,
    getDeliveryManagementByGroupId,
    getAllDeliveryManagements,
    deleteDeliveryManagement,
} from "../controller/deliveryManagementController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", asyncHandler(createOrUpdateDeliveryManagement));

router.get("/", asyncHandler(getAllDeliveryManagements));

router.get("/:pincodeGroupId", asyncHandler(getDeliveryManagementByGroupId));

router.delete("/:pincodeGroupId", asyncHandler(deleteDeliveryManagement));

export default router;

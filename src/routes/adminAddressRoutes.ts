import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import { asyncHandler } from "../middleware/errorHandler";

import * as addressController from "../controller/addressController";

const adminAddressRoutes = Router();

adminAddressRoutes.get("/all", authMiddleware as any, adminAuthMiddleware as any, asyncHandler(addressController.getAllAddresses));

export default adminAddressRoutes;

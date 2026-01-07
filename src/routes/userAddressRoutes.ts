import { Router } from "express";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import * as addressController from "../controller/addressController";

const userAddressRoutes = Router();

userAddressRoutes.use(authMiddleware as any)

userAddressRoutes.post("/create", asyncHandler(addressController.createAddress));

userAddressRoutes.get("/my-addresses", asyncHandler(addressController.getUserAddresses));

userAddressRoutes.put("/:id", asyncHandler(addressController.updateAddress));

userAddressRoutes.delete("/:id", asyncHandler(addressController.deleteAddress));

export default userAddressRoutes;

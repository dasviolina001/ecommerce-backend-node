import { Router } from "express";

import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  addBankDetails,
  updateBankDetailsController,
  getBankDetailsController,
} from "../controller/userController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));

router.get("/profile", authMiddleware as any, asyncHandler(getProfile));

router.put("/profile", authMiddleware as any, asyncHandler(updateProfile));

router.put("/change-password", authMiddleware as any, asyncHandler(changePassword));

router.post("/bank-details", authMiddleware as any, asyncHandler(addBankDetails));

router.put(
  "/bank-details",
  authMiddleware as any,
  asyncHandler(updateBankDetailsController)
);
router.get(
  "/bank-details",
  authMiddleware as any,
  asyncHandler(getBankDetailsController)
);

export default router;

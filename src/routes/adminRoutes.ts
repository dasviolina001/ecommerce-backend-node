import { Router } from "express";

import {
  registerAdmin,
  login,
  getAllUsers,
  getUserById,
  updateUserStatus,
  verifyUser,
  deleteUser,
  getUserBankDetails,
  getAllUserBankDetails,
} from "../controller/adminController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

import { validate } from "../middleware/validation";

import {
  registerAdminValidation,
  loginAdminValidation,
  userIdParamValidation,
  paginationQueryValidation,
  updateUserStatusValidation,
} from "../validators/adminValidators";

const router = Router();

router.post(
  "/register",
  validate(registerAdminValidation),
  asyncHandler(registerAdmin)
);

router.post("/login", validate(loginAdminValidation), asyncHandler(login));

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.get(
  "/users",
  validate(paginationQueryValidation),
  asyncHandler(getAllUsers)
);

router.get(
  "/users/:userId",
  validate(userIdParamValidation),
  asyncHandler(getUserById)
);

router.put(
  "/users/:userId/status",
  validate(updateUserStatusValidation),
  asyncHandler(updateUserStatus)
);

router.put(
  "/users/:userId/verify",
  validate(userIdParamValidation),
  asyncHandler(verifyUser)
);

router.delete(
  "/users/:userId",
  validate(userIdParamValidation),
  asyncHandler(deleteUser)
);

router.get(
  "/bank-details",
  validate(paginationQueryValidation),
  asyncHandler(getAllUserBankDetails)
);

router.get(
  "/bank-details/:userId",
  validate(userIdParamValidation),
  asyncHandler(getUserBankDetails)
);

export default router;

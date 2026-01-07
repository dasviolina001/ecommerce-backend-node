import { Router } from "express";

import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCouponById,
  getAllCoupons,
  toggleCouponStatus,
} from "../controller/adminCouponController";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import { validate } from "../middleware/validation";

import {
  createCouponValidation,
  updateCouponValidation,
  couponIdParamValidation,
  paginationQueryValidation,
  toggleCouponStatusValidation,
} from "../validators/couponValidators";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", validate(createCouponValidation), createCoupon);

router.get("/", validate(paginationQueryValidation), getAllCoupons);

router.get("/:couponId", validate(couponIdParamValidation), getCouponById);

router.put("/:couponId", validate(updateCouponValidation), updateCoupon);

router.delete("/:couponId", validate(couponIdParamValidation), deleteCoupon);

router.patch(
  "/:couponId/toggle-status",
  validate(couponIdParamValidation),
  validate(toggleCouponStatusValidation),
  toggleCouponStatus
);

export default router;

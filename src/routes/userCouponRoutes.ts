import { Router } from "express";

import {
  validateCoupon,
  applyCoupon,
  getAvailableCoupons,
  getMyCouponUsage,
  removeCouponFromCart,
} from "../controller/userCouponController";

import { authMiddleware } from "../middleware/auth";

import { validate } from "../middleware/validation";

import {
  validateCouponValidation,
  applyCouponValidation,
  paginationQueryValidation,
  cartIdParamValidation,
} from "../validators/couponValidators";

const router = Router();

router.post(
  "/validate",
  validate(validateCouponValidation),
  validateCoupon as any
);

router.use(authMiddleware as any);

router.post("/apply", validate(applyCouponValidation), applyCoupon as any);

router.get(
  "/available",
  validate(paginationQueryValidation),
  getAvailableCoupons as any
);

router.get("/my-usage", getMyCouponUsage as any);

router.delete(
  "/cart/:cartId",
  validate(cartIdParamValidation),
  removeCouponFromCart as any
);

export default router;

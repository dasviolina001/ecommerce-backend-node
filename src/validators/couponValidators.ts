import { body, param, query } from "express-validator";

export const createCouponValidation = [
  body("code").trim().notEmpty().withMessage("Coupon code is required"),
  body("type")
    .isIn(["FIXED", "PERCENTAGE"])
    .withMessage("Type must be FIXED or PERCENTAGE"),
  body("value")
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number"),
  body("minOrderValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Min order value must be a positive number"),
  body("maxDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max discount must be a positive number"),
  body("isStackable")
    .optional()
    .isBoolean()
    .withMessage("isStackable must be a boolean"),
  body("startsAt").isISO8601().withMessage("startsAt must be a valid date"),
  body("expiresAt").isISO8601().withMessage("expiresAt must be a valid date"),
  body("productIds")
    .optional()
    .isArray()
    .withMessage("productIds must be an array"),
  body("categoryIds")
    .optional()
    .isArray()
    .withMessage("categoryIds must be an array"),
];

export const updateCouponValidation = [
  param("couponId")
    .isInt({ min: 1 })
    .withMessage("Valid coupon ID is required"),
  body("code")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Coupon code cannot be empty"),
  body("type")
    .optional()
    .isIn(["FIXED", "PERCENTAGE"])
    .withMessage("Type must be FIXED or PERCENTAGE"),
  body("value")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Value must be a positive number"),
  body("minOrderValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Min order value must be a positive number"),
  body("maxDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max discount must be a positive number"),
  body("isStackable")
    .optional()
    .isBoolean()
    .withMessage("isStackable must be a boolean"),
  body("startsAt")
    .optional()
    .isISO8601()
    .withMessage("startsAt must be a valid date"),
  body("expiresAt")
    .optional()
    .isISO8601()
    .withMessage("expiresAt must be a valid date"),
];

export const couponIdParamValidation = [
  param("couponId")
    .isInt({ min: 1 })
    .withMessage("Valid coupon ID is required"),
];

export const paginationQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  query("code")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Code cannot be empty"),
];

export const toggleCouponStatusValidation = [
  param("couponId")
    .isInt({ min: 1 })
    .withMessage("Valid coupon ID is required"),
  body("isActive").isBoolean().withMessage("isActive must be a boolean"),
];

export const validateCouponValidation = [
  body("code").trim().notEmpty().withMessage("Coupon code is required"),
  body("cartTotal")
    .isFloat({ min: 0 })
    .withMessage("cartTotal must be a positive number"),
  body("productIds").isArray().withMessage("productIds must be an array"),
  body("categoryIds").isArray().withMessage("categoryIds must be an array"),
];

export const applyCouponValidation = [
  body("code").trim().notEmpty().withMessage("Coupon code is required"),
];

export const cartIdParamValidation = [
  param("cartId").trim().notEmpty().withMessage("Valid cart ID is required"),
];

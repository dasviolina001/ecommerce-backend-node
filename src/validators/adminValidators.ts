import { body, param, query } from "express-validator";

export const registerAdminValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email must be less than 255 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters"),
];

export const loginAdminValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 1 })
    .withMessage("Password cannot be empty"),
];

export const userIdParamValidation = [
  param("userId")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID()
    .withMessage("User ID must be a valid UUID"),
];

export const paginationQueryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be a positive integer between 1 and 100")
    .toInt(),
];

export const updateUserStatusValidation = [
  param("userId")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID()
    .withMessage("User ID must be a valid UUID"),

  body("isActive")
    .notEmpty()
    .withMessage("isActive field is required")
    .isBoolean()
    .withMessage("isActive must be a boolean value (true or false)")
    .toBoolean(),
];

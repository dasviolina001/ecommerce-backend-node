import { Request, Response } from "express";

import { validationResult } from "express-validator";

import { couponService } from "../service/couponService";

import { asyncHandler } from "../lib/asyncHandler";

export const createCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const {
      code,
      type,
      value,
      minOrderValue,
      maxDiscount,
      isStackable,
      startsAt,
      expiresAt,
      productIds,
      categoryIds,
    } = req.body;

    const coupon = await couponService.createCoupon({
      code,
      type,
      value,
      minOrderValue,
      maxDiscount,
      isStackable,
      startsAt,
      expiresAt,
      productIds,
      categoryIds,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  }
);

export const updateCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { couponId } = req.params;
    const {
      code,
      type,
      value,
      minOrderValue,
      maxDiscount,
      isStackable,
      startsAt,
      expiresAt,
    } = req.body;

    const updatedCoupon = await couponService.updateCoupon(parseInt(couponId), {
      code,
      type,
      value,
      minOrderValue,
      maxDiscount,
      isStackable,
      startsAt,
      expiresAt,
    });

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  }
);

export const deleteCoupon = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { couponId } = req.params;

    const result = await couponService.deleteCoupon(parseInt(couponId));

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);

export const getCouponById = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { couponId } = req.params;

    const coupon = await couponService.getCouponById(parseInt(couponId));

    res.status(200).json({
      success: true,
      message: "Coupon retrieved successfully",
      data: coupon,
    });
  }
);

export const getAllCoupons = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const isActive = req.query.isActive
      ? req.query.isActive === "true"
      : undefined;
    const code = req.query.code as string;

    const result = await couponService.getAllCoupons(page, limit, {
      isActive,
      code,
    });

    res.status(200).json({
      success: true,
      message: "Coupons retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  }
);

export const toggleCouponStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { couponId } = req.params;

    const { isActive } = req.body;

    const coupon = await couponService.toggleCouponStatus(
      parseInt(couponId),
      isActive
    );

    res.status(200).json({
      success: true,
      message: "Coupon status updated successfully",
      data: coupon,
    });
  }
);

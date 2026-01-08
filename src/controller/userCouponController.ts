import { Response } from "express";

import { validationResult } from "express-validator";

import { AuthRequest } from "../middleware/auth";

import { couponService } from "../service/couponService";

import { asyncHandler } from "../lib/asyncHandler";

import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";
 
export const validateCoupon = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { code, cartTotal, productIds, items } = req.body;

    let cartItems = items;
    if (!cartItems && productIds) {
      cartItems = productIds.map((id: string) => ({ productId: id }));
    }

    const coupon = await couponService.validateCouponForCart(
      code,
      cartTotal,
      cartItems || []
    );

    let discount = 0;

    if (coupon.type === "FIXED") {
      discount = coupon.value;
    } else if (coupon.type === "PERCENTAGE") {
      discount = (cartTotal * coupon.value) / 100;
    }

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: {
        coupon,
        discount,
        finalTotal: cartTotal - discount,
      },
    });
  }
);

export const applyCoupon = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { code } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User not authenticated", 401);
    }

    const coupon = await couponService.getCouponByCode(code);

    const existingUsage = await prisma.couponUser.findUnique({
      where: {
        couponId_userId: {
          couponId: coupon.id,
          userId,
        },
      },
    });

    if (existingUsage) {
      throw new CustomError("You have already used this coupon", 400);
    }

    await prisma.couponUser.create({
      data: {
        couponId: coupon.id,
        userId,
        usedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: coupon,
    });
  }
);

export const getAvailableCoupons = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const now = new Date();

    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        expiresAt: { gte: now },
      },
      include: {
        products: {
          select: { product: { select: { id: true, productName: true } } },
        },
        categories: {
          select: { category: { select: { id: true, name: true } } },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { expiresAt: "asc" },
    });

    const total = await prisma.coupon.count({
      where: {
        isActive: true,
        startsAt: { lte: now },
        expiresAt: { gte: now },
      },
    });

    res.status(200).json({
      success: true,
      message: "Available coupons retrieved successfully",
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

export const getMyCouponUsage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User not authenticated", 401);
    }

    const couponUsage = await prisma.couponUser.findMany({
      where: { userId },
      include: {
        coupon: {
          select: {
            id: true,
            code: true,
            type: true,
            value: true,
            createdAt: true,
            expiresAt: true,
          },
        },
      },
      orderBy: { usedAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Your coupon usage retrieved successfully",
      data: couponUsage,
    });
  }
);

export const removeCouponFromCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError("User not authenticated", 401);
    }

    const { cartId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new CustomError("Cart item not found", 404);
    }

    if (cart.userId !== userId) {
      throw new CustomError("Unauthorized to modify this cart item", 403);
    }

    await prisma.cart.update({
      where: { id: cartId },
      data: { couponCode: null },
    });

    res.status(200).json({
      success: true,
      message: "Coupon removed from cart successfully",
    });
  }
);

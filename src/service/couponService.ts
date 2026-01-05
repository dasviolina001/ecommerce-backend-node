import { prisma } from "../db/prisma";

import { CustomError } from "../middleware/errorHandler";

import { CouponType } from "../generated/prisma/client";

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  isStackable?: boolean;
  startsAt: Date;
  expiresAt: Date;
  productIds?: string[];
  categoryIds?: string[];
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {}

export const couponService = {
  async createCoupon(input: CreateCouponInput) {
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
    } = input;

    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      throw new CustomError("Coupon code already exists", 409);
    }

    if (new Date(startsAt) >= new Date(expiresAt)) {
      throw new CustomError("Expiry date must be after start date", 400);
    }

    try {
      const coupon = await prisma.coupon.create({
        data: {
          code: code.toUpperCase(),
          type,
          value,
          minOrderValue: minOrderValue || null,
          maxDiscount: maxDiscount || null,
          isStackable: isStackable || false,
          startsAt,
          expiresAt,
        },
      });

      if (productIds && productIds.length > 0) {
        for (const productId of productIds) {
          await prisma.couponProduct.create({
            data: {
              couponId: coupon.id,
              productId,
            },
          });
        }
      }

      if (categoryIds && categoryIds.length > 0) {
        for (const categoryId of categoryIds) {
          await prisma.couponCategory.create({
            data: {
              couponId: coupon.id,
              categoryId,
            },
          });
        }
      }

      return coupon;
    } catch (error) {
      throw error;
    }
  },

  async updateCoupon(couponId: number, input: UpdateCouponInput) {
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new CustomError("Coupon not found", 404);
    }

    if (input.code && input.code !== coupon.code) {
      const existingCoupon = await prisma.coupon.findUnique({
        where: { code: input.code.toUpperCase() },
      });

      if (existingCoupon) {
        throw new CustomError("Coupon code already exists", 409);
      }
    }

    if (input.startsAt && input.expiresAt) {
      if (new Date(input.startsAt) >= new Date(input.expiresAt)) {
        throw new CustomError("Expiry date must be after start date", 400);
      }
    } else if (input.expiresAt && !input.startsAt) {
      if (new Date(coupon.startsAt) >= new Date(input.expiresAt)) {
        throw new CustomError("Expiry date must be after start date", 400);
      }
    } else if (input.startsAt && !input.expiresAt) {
      if (new Date(input.startsAt) >= new Date(coupon.expiresAt)) {
        throw new CustomError("Expiry date must be after start date", 400);
      }
    }

    const updateData: any = {};
    if (input.code) updateData.code = input.code.toUpperCase();

    if (input.type) updateData.type = input.type;

    if (input.value !== undefined) updateData.value = input.value;

    if (input.minOrderValue !== undefined)
      updateData.minOrderValue = input.minOrderValue;

    if (input.maxDiscount !== undefined)
      updateData.maxDiscount = input.maxDiscount;

    if (input.isStackable !== undefined)
      updateData.isStackable = input.isStackable;

    if (input.startsAt) updateData.startsAt = input.startsAt;

    if (input.expiresAt) updateData.expiresAt = input.expiresAt;

    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: updateData,
    });

    return updatedCoupon;
  },

  async deleteCoupon(couponId: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new CustomError("Coupon not found", 404);
    }

    await prisma.coupon.delete({
      where: { id: couponId },
    });

    return { message: "Coupon deleted successfully" };
  },

  async getCouponById(couponId: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
      include: {
        products: {
          select: { product: { select: { id: true, productName: true } } },
        },
        categories: {
          select: { category: { select: { id: true, name: true } } },
        },
      },
    });

    if (!coupon) {
      throw new CustomError("Coupon not found", 404);
    }

    return coupon;
  },

  async getAllCoupons(
    page: number = 1,
    limit: number = 10,
    filters?: { isActive?: boolean; code?: string }
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    if (filters?.code) where.code = { contains: filters.code.toUpperCase() };

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        include: {
          products: { select: { productId: true } },
          categories: { select: { categoryId: true } },
          users: { select: { userId: true, usedAt: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.coupon.count({ where }),
    ]);

    return {
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getCouponByCode(code: string) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        products: {
          select: { product: { select: { id: true, productName: true } } },
        },
        categories: {
          select: { category: { select: { id: true, name: true } } },
        },
      },
    });

    if (!coupon) {
      throw new CustomError("Coupon not found", 404);
    }

    const now = new Date();

    if (!coupon.isActive) {
      throw new CustomError("Coupon is not active", 400);
    }

    if (now < coupon.startsAt) {
      throw new CustomError("Coupon is not yet valid", 400);
    }

    if (now > coupon.expiresAt) {
      throw new CustomError("Coupon has expired", 400);
    }

    return coupon;
  },

  async validateCouponForCart(
    couponCode: string,
    cartTotal: number,
    productIds: string[],
    categoryIds: string[]
  ) {
    const coupon = await this.getCouponByCode(couponCode);

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      throw new CustomError(
        `Minimum order value must be ${coupon.minOrderValue} to apply this coupon`,
        400
      );
    }

    const couponProducts = await prisma.couponProduct.findMany({
      where: { couponId: coupon.id },
    });

    const couponCategories = await prisma.couponCategory.findMany({
      where: { couponId: coupon.id },
    });

    if (couponProducts.length === 0 && couponCategories.length === 0) {
      return coupon;
    }

    const appliedProductIds = couponProducts.map((cp) => cp.productId);

    const appliedCategoryIds = couponCategories.map((cc) => cc.categoryId);

    const hasMatchingProduct = productIds.some((id) =>
      appliedProductIds.includes(id)
    );
    const hasMatchingCategory = categoryIds.some((id) =>
      appliedCategoryIds.includes(id)
    );

    if (appliedProductIds.length > 0 && appliedCategoryIds.length > 0) {
      if (!hasMatchingProduct && !hasMatchingCategory) {
        throw new CustomError(
          "This coupon is not applicable to items in your cart",
          400
        );
      }
    } else if (appliedProductIds.length > 0) {
      if (!hasMatchingProduct) {
        throw new CustomError(
          "This coupon is not applicable to items in your cart",
          400
        );
      }
    } else if (appliedCategoryIds.length > 0) {
      if (!hasMatchingCategory) {
        throw new CustomError(
          "This coupon is not applicable to items in your cart",
          400
        );
      }
    }

    return coupon;
  },

  async toggleCouponStatus(couponId: number, isActive: boolean) {
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    });

    if (!coupon) {
      throw new CustomError("Coupon not found", 404);
    }

    return prisma.coupon.update({
      where: { id: couponId },
      data: { isActive },
    });
  },
};

import { prisma } from "../db/prisma";

interface AddToWishlistInput {
  userId: string;
  productId: string;
}

export class WishlistService {
  async addToWishlist(input: AddToWishlistInput) {
    const { userId, productId } = input;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const existingWishlist = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existingWishlist) {
      throw new Error("Product already in wishlist");
    }

    return await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });
  }

  async getWishlistItems(userId: string) {
    return await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    return await prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async clearWishlist(userId: string) {
    return await prisma.wishlist.deleteMany({
      where: { userId },
    });
  }

  async getWishlistCount(userId: string) {
    return await prisma.wishlist.count({
      where: { userId },
    });
  }

  async isProductInWishlist(userId: string, productId: string) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    return !!wishlist;
  }
}

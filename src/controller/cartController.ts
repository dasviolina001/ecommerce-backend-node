import { Request, Response } from "express";

import { CartService } from "../service/cartService";

import { asyncHandler } from "../lib/asyncHandler";

const cartService = new CartService();

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const { productId, variantId, quantity } = req.body;

  if (!productId && !variantId) {
    res.status(400).json({ message: "Product ID or Variant ID is required" });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  const cartItem = await cartService.addToCart({
    userId,
    productId,
    variantId,
    quantity: quantity || 1,
  });

  res.status(201).json({
    message: "Item added to cart successfully",
    data: cartItem,
  });
});

export const getCartItems = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const cartItems = await cartService.getCartItems(userId);

    res.status(200).json({
      message: "Cart items retrieved successfully",
      count: cartItems.length,
      data: cartItems,
    });
  }
);

export const updateCartQuantity = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const { productId, variantId } = req.params;

    const { quantity } = req.body;

    if (!quantity) {
      res.status(400).json({ message: "Quantity is required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const cartItem = await cartService.updateCartQuantity({
      userId,
      productId,
      variantId,
      quantity,
    });

    res.status(200).json({
      message: "Cart quantity updated successfully",
      data: cartItem,
    });
  }
);

export const removeFromCart = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const { productId, variantId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    await cartService.removeFromCart(userId, productId, variantId);

    res.status(200).json({
      message: "Item removed from cart successfully",
    });
  }
);

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  await cartService.clearCart(userId);

  res.status(200).json({
    message: "Cart cleared successfully",
  });
});

export const getCartCount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const count = await cartService.getCartCount(userId);

    res.status(200).json({
      message: "Cart count retrieved successfully",
      data: count,
    });
  }
);

export const getCartTotal = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const cartTotal = await cartService.getCartTotal(userId);

    res.status(200).json({
      message: "Cart total retrieved successfully",
      data: cartTotal,
    });
  }
);

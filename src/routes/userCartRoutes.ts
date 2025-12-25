import { Router } from "express";

import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
  getCartTotal,
} from "../controller/cartController";

import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware as any);

router.post("/", addToCart);

router.get("/", getCartItems);

router.get("/count", getCartCount);

router.get("/total", getCartTotal);

router.put("/:productId", updateCartQuantity);

router.delete("/:productId", removeFromCart);

router.delete("/", clearCart);

export default router;

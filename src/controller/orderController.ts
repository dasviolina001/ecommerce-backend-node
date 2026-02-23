import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as orderService from "../service/orderService";

import { CustomError } from "../middleware/errorHandler";

import { OrderStatus } from "../generated/prisma/enums";

import { formatOrder, formatOrderList } from "../lib/formatter";


export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new CustomError("User not authenticated", 401);
        }

        const { addressId, items, paymentMethod, paymentId, couponCode, deliveryCharge } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new CustomError("Items are required", 400);
        }

        if (!addressId) {
            throw new CustomError("Address ID is required", 400);
        }

        if (!paymentMethod) {
            throw new CustomError("Payment method is required", 400);
        }

        const order = await orderService.createOrder({
            userId: req.user.id,
            addressId,
            items,
            paymentMethod,
            paymentId,
            couponCode,
            deliveryCharge: deliveryCharge ? parseFloat(deliveryCharge) : 0
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: formatOrder(order)
        });
    } catch (error) {
        throw error;
    }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new CustomError("User not authenticated", 401);
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await orderService.getUserOrders(req.user.id, page, limit);

        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: {
                ...result,
                orders: formatOrderList(result.orders)
            }
        });
    } catch (error) {
        throw error;
    }
}

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new CustomError("User not authenticated", 401);
        }

        const { orderId } = req.params;

        const order = await orderService.getOrderById(orderId);

        // Security check: Only allow user to see their own order (or admin, handled by admin route usually)
        if (order.userId !== req.user.id) {
            // We'll throw 404 to not leak existence, or 403. 403 is better for authz failures.
            throw new CustomError("Access denied", 403);
        }

        res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data: formatOrder(order)
        });
    } catch (error) {
        throw error;
    }
}

// Admin Methods

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const status = req.query.status as OrderStatus | undefined;

        const result = await orderService.getAllOrders(page, limit, status);

        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: {
                ...result,
                orders: formatOrderList(result.orders)
            }
        });
    } catch (error) {
        throw error;
    }
}

export const getAdminOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.params;
        const order = await orderService.getOrderById(orderId);

        res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data: formatOrder(order)
        });
    } catch (error) {
        throw error;
    }
}

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new CustomError("User not authenticated", 401);
        }

        const { orderId } = req.params;
        const { status, comment } = req.body;

        if (!status || !Object.values(OrderStatus).includes(status)) {
            throw new CustomError("Invalid order status", 400);
        }

        const updatedOrder = await orderService.updateOrderStatus(orderId, status, comment, req.user.id);

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        });
    } catch (error) {
        throw error;
    }
}

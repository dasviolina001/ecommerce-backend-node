import { Request, Response } from "express";

import { updateOrderItemStatus } from "../service/orderService";

import { asyncHandler } from "../lib/asyncHandler";

import { OrderStatus } from "../generated/prisma/enums";

export const updateItemStatus = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status, comment } = req.body;
        const userId = req.user?.id;

        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: "Item ID and status are required",
            });
        }

        if (!Object.values(OrderStatus).includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        try {
            const order = await updateOrderItemStatus(
                id,
                status as OrderStatus,
                comment,
                userId
            );

            return res.status(200).json({
                success: true,
                message: "Order item status updated successfully",
                data: order,
            });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Failed to update order item status",
            });
        }
    }
);

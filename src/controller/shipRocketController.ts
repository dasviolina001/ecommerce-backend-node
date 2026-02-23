import { Request, Response } from "express";

import { CustomError } from "../middleware/errorHandler";

import * as shipRocketService from "../service/shipRocketService";

export const createShipRocketOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const payload = req.body;
        const { orderId } = req.query;

        if (!payload || Object.keys(payload).length === 0) {
            throw new CustomError("Request payload is required", 400);
        }

        const shipRocketOrder = await shipRocketService.createShipRocketOrderWithDb(
            payload,
            orderId as string,
        );

        res.status(201).json({
            success: true,
            message: "ShipRocket order created successfully",
            data: shipRocketOrder,
        });
    } catch (error) {
        throw error;
    }
};

export const getShipRocketOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const order = await shipRocketService.getShipRocketOrderById(id);

        res.status(200).json({
            success: true,
            message: "ShipRocket order retrieved successfully",
            data: order,
        });
    } catch (error) {
        throw error;
    }
};

export const getAllShipRocketOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await shipRocketService.getAllShipRocketOrders(page, limit);

        res.status(200).json({
            success: true,
            message: "ShipRocket orders retrieved successfully",
            data: result,
        });
    } catch (error) {
        throw error;
    }
};

export const getShipRocketOrderTracking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shipmentId } = req.params;

        if (!shipmentId) {
            throw new CustomError("Shipment ID is required", 400);
        }

        const trackingData = await shipRocketService.getShipRocketOrderTracking(
            parseInt(shipmentId),
        );

        res.status(200).json({
            success: true,
            message: "Tracking data retrieved successfully",
            data: trackingData,
        });
    } catch (error) {
        throw error;
    }
};

export const getPickupLocations = async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await shipRocketService.getPickupLocations();

        res.status(200).json({
            success: true,
            message: "Pickup locations retrieved successfully",
            data: result,
        });
    } catch (error) {
        throw error;
    }
};
export const getPincodeAvailabilityAndDeliveryCharge = async (req: Request, res: Response): Promise<void> => {
    try {
        const { delivery_postcode, weight, cod } = req.query;

        if (!delivery_postcode) {
            throw new CustomError("Delivery postcode is required", 400);
        }

        // Static pickup for the time being
        const result = await shipRocketService.getPincodeAvailabilityAndDeliveryCharge(
            undefined,
            delivery_postcode as string,
            parseFloat(weight as string) || 0.25,
            parseInt(cod as string) || 0,
        );

        console.log("Result ", result);

        res.status(200).json({
            success: true,
            message: "Pincode serviceability and delivery charges retrieved successfully",
            data: result,
        });
    } catch (error) {
        throw error;
    }
};

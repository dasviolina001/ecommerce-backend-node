import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as returnReasonService from "../service/returnReasonService";

export const createReturnReason = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const returnReason = await returnReasonService.createReturnReason(req.body);

    res.status(201).json({
        success: true,
        message: "Return reason created successfully",
        data: returnReason,
    });
};

export const getAllReturnReasons = async (
    _req: Request | AuthRequest,
    res: Response,
): Promise<void> => {
    const returnReasons = await returnReasonService.getAllReturnReasons();

    res.status(200).json({
        success: true,
        message: "Return reasons retrieved successfully",
        data: returnReasons,
    });
};

export const getReturnReasonById = async (
    req: Request | AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    const returnReason = await returnReasonService.getReturnReasonById(id);

    res.status(200).json({
        success: true,
        message: "Return reason retrieved successfully",
        data: returnReason,
    });
};

export const updateReturnReason = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    const returnReason = await returnReasonService.updateReturnReason(
        id,
        req.body,
    );

    res.status(200).json({
        success: true,
        message: "Return reason updated successfully",
        data: returnReason,
    });
};

export const deleteReturnReason = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { id } = req.params;

    const returnReason = await returnReasonService.deleteReturnReason(id);

    res.status(200).json({
        success: true,
        message: "Return reason deleted successfully",
        data: returnReason,
    });
};

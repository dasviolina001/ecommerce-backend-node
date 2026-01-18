import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as policyPageContentService from "../service/policyPageContentService";

import { CustomError } from "../middleware/errorHandler";

export const createPolicyPageContent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new CustomError("User not authenticated", 401);
        }

        const { title, content } = req.body;

        if (!title || !content) {
            throw new CustomError("Title and content are required", 400);
        }

        const policyPageContent = await policyPageContentService.createPolicyPageContent({
            title,
            content,
        });

        res.status(201).json({
            success: true,
            message: "Policy page content created successfully",
            data: policyPageContent,
        });
    } catch (error) {
        throw error;
    }
};

export const updatePolicyPageContent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { title, content } = req.body;

        if (!id) {
            throw new CustomError("Policy page content ID is required", 400);
        }

        const policyPageContent = await policyPageContentService.updatePolicyPageContent(id, {
            title,
            content,
        });

        res.status(200).json({
            success: true,
            message: "Policy page content updated successfully",
            data: policyPageContent,
        });
    } catch (error) {
        throw error;
    }
};

export const deletePolicyPageContent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new CustomError("Policy page content ID is required", 400);
        }

        await policyPageContentService.deletePolicyPageContent(id);

        res.status(200).json({
            success: true,
            message: "Policy page content deleted successfully",
        });
    } catch (error) {
        throw error;
    }
};

export const getAllPolicyPageContent = async (_: Request, res: Response): Promise<void> => {
    try {
        const policyPageContent = await policyPageContentService.getAllPolicyPageContent();
        res.status(200).json({
            success: true,
            message: "Policy page content retrieved successfully",
            data: policyPageContent,
        });
    } catch (error) {
        throw error;
    }
};

export const getPolicyPageContentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new CustomError("Policy page content ID is required", 400);
        }
        const policyPageContent = await policyPageContentService.getPolicyPageContentById(id);

        if (!policyPageContent) {
            throw new CustomError("Policy page content not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Policy page content retrieved successfully",
            data: policyPageContent,
        });
    } catch (error) {
        throw error;
    }
};

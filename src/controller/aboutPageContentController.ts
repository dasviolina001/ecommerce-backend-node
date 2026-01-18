import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as aboutPageContentService from "../service/aboutPageContentService";

import { CustomError } from "../middleware/errorHandler";

export const createAboutPageContent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new CustomError("User not authenticated", 401);
        }

        const { title, content } = req.body;

        if (!title || !content) {
            throw new CustomError("Title and content are required", 400);
        }

        const aboutPageContent = await aboutPageContentService.createAboutPageContent({
            title,
            content,
        });

        res.status(201).json({
            success: true,
            message: "About page content created successfully",
            data: aboutPageContent,
        });
    } catch (error) {
        throw error;
    }
};

export const updateAboutPageContent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { title, content } = req.body;

        if (!id) {
            throw new CustomError("About page content ID is required", 400);
        }

        const aboutPageContent = await aboutPageContentService.updateAboutPageContent(id, {
            title,
            content,
        });

        res.status(200).json({
            success: true,
            message: "About page content updated successfully",
            data: aboutPageContent,
        });
    } catch (error) {
        throw error;
    }
};

export const deleteAboutPageContent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new CustomError("About page content ID is required", 400);
        }

        await aboutPageContentService.deleteAboutPageContent(id);

        res.status(200).json({
            success: true,
            message: "About page content deleted successfully",
        });
    } catch (error) {
        throw error;
    }
};

export const getAllAboutPageContent = async (_: Request, res: Response): Promise<void> => {
    try {
        const aboutPageContent = await aboutPageContentService.getAllAboutPageContent();
        res.status(200).json({
            success: true,
            message: "About page content retrieved successfully",
            data: aboutPageContent,
        });
    } catch (error) {
        throw error;
    }
};

export const getAboutPageContentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new CustomError("About page content ID is required", 400);
        }
        const aboutPageContent = await aboutPageContentService.getAboutPageContentById(id);

        if (!aboutPageContent) {
            throw new CustomError("About page content not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "About page content retrieved successfully",
            data: aboutPageContent,
        });
    } catch (error) {
        throw error;
    }
};

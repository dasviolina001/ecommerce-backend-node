import { Request, Response } from "express";

import { AuthRequest } from "../middleware/auth";

import * as contactPageInformationService from "../service/contactPageInformationService";

import { CustomError } from "../middleware/errorHandler";

export const createContactPageInformation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            throw new CustomError("User not authenticated", 401);
        }

        const { label, type, value } = req.body;

        if (!label || !type || !value) {
            throw new CustomError("Label, type, and value are required", 400);
        }

        const contactPageInformation = await contactPageInformationService.createContactPageInformation({
            label,
            type,
            value,
        });

        res.status(201).json({
            success: true,
            message: "Contact page information created successfully",
            data: contactPageInformation,
        });
    } catch (error) {
        throw error;
    }
};

export const updateContactPageInformation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { label, type, value } = req.body;

        if (!id) {
            throw new CustomError("Contact page information ID is required", 400);
        }

        const contactPageInformation = await contactPageInformationService.updateContactPageInformation(id, {
            label,
            type,
            value,
        });

        res.status(200).json({
            success: true,
            message: "Contact page information updated successfully",
            data: contactPageInformation,
        });
    } catch (error) {
        throw error;
    }
};

export const deleteContactPageInformation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new CustomError("Contact page information ID is required", 400);
        }

        await contactPageInformationService.deleteContactPageInformation(id);

        res.status(200).json({
            success: true,
            message: "Contact page information deleted successfully",
        });
    } catch (error) {
        throw error;
    }
};

export const getAllContactPageInformation = async (_: Request, res: Response): Promise<void> => {
    try {
        const contactPageInformation = await contactPageInformationService.getAllContactPageInformation();
        res.status(200).json({
            success: true,
            message: "Contact page information retrieved successfully",
            data: contactPageInformation,
        });
    } catch (error) {
        throw error;
    }
};

export const getContactPageInformationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new CustomError("Contact page information ID is required", 400);
        }
        const contactPageInformation = await contactPageInformationService.getContactPageInformationById(id);

        if (!contactPageInformation) {
            throw new CustomError("Contact page information not found", 404);
        }

        res.status(200).json({
            success: true,
            message: "Contact page information retrieved successfully",
            data: contactPageInformation,
        });
    } catch (error) {
        throw error;
    }
};

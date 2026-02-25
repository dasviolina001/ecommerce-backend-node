import { Request, Response } from "express";

import { popupService } from "../service/popupService";

import { CustomError } from "../middleware/errorHandler";

export const createPopup = async (req: Request, res: Response) => {
    try {
        const { name, isActive } = req.body;
        const file = req.file;

        if (!name) {
            throw new CustomError("Popup name is required", 400);
        }

        if (!file) {
            throw new CustomError("Popup image is required", 400);
        }

        const popup = await popupService.createPopup({
            name,
            imagePath: file.path,
            isActive: isActive !== undefined ? isActive === "true" || isActive === true : true,
        });

        res.status(201).json({ success: true, data: popup });
    } catch (error) {
        throw error;
    }
};

export const updatePopup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, isActive } = req.body;
        const file = req.file;

        const dataToUpdate: any = {};
        if (name) dataToUpdate.name = name;
        if (isActive !== undefined) dataToUpdate.isActive = isActive === "true" || isActive === true;
        if (file) dataToUpdate.imagePath = file.path;

        const popup = await popupService.updatePopup(id, dataToUpdate);

        res.status(200).json({ success: true, data: popup });
    } catch (error) {
        throw error;
    }
};

export const deletePopup = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await popupService.deletePopup(id);
        res.status(200).json(result);
    } catch (error) {
        throw error;
    }
};

export const getAllPopups = async (req: Request, res: Response) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        const result = await popupService.getAllPopups(page, limit);
        res.status(200).json({ success: true, ...result });
    } catch (error) {
        throw error;
    }
};

export const getActivePopups = async (_req: Request, res: Response) => {
    try {
        const popups = await popupService.getActivePopups();
        res.status(200).json({ success: true, data: popups });
    } catch (error) {
        throw error;
    }
};

export const getPopupById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const popup = await popupService.getPopupById(id);
        res.status(200).json({ success: true, data: popup });
    } catch (error) {
        throw error;
    }
};

import { prisma } from "../db/prisma";
import { CustomError } from "../middleware/errorHandler";
import fs from "fs";

export const popupService = {
    createPopup: async (data: { name: string; imagePath: string; isActive?: boolean }) => {
        try {
            return await prisma.popup.create({
                data: {
                    name: data.name,
                    imagePath: data.imagePath,
                    isActive: data.isActive !== undefined ? data.isActive : true,
                },
            });
        } catch (error) {
            throw new CustomError("Failed to create popup", 500);
        }
    },

    updatePopup: async (
        id: string,
        data: { name?: string; imagePath?: string; isActive?: boolean },
    ) => {
        try {
            const existingPopup = await prisma.popup.findUnique({ where: { id } });

            if (!existingPopup) {
                throw new CustomError("Popup not found", 404);
            }

            // If new image is uploaded, optionally delete the old one
            if (data.imagePath && existingPopup.imagePath && data.imagePath !== existingPopup.imagePath) {
                try {
                    if (fs.existsSync(existingPopup.imagePath)) {
                        fs.unlinkSync(existingPopup.imagePath);
                    }
                } catch (e) {
                    console.error("Failed to delete old popup image", e);
                }
            }

            return await prisma.popup.update({
                where: { id },
                data,
            });
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError("Failed to update popup", 500);
        }
    },

    deletePopup: async (id: string) => {
        try {
            const popup = await prisma.popup.findUnique({ where: { id } });

            if (!popup) {
                throw new CustomError("Popup not found", 404);
            }

            if (popup.imagePath && fs.existsSync(popup.imagePath)) {
                try {
                    fs.unlinkSync(popup.imagePath);
                } catch (e) {
                    console.error("Failed to delete popup image", e);
                }
            }

            await prisma.popup.delete({ where: { id } });
            return { success: true, message: "Popup deleted successfully" };
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError("Failed to delete popup", 500);
        }
    },

    getAllPopups: async (page = 1, limit = 10) => {
        try {
            const skip = (page - 1) * limit;

            const [popups, total] = await Promise.all([
                prisma.popup.findMany({
                    skip,
                    take: limit,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.popup.count(),
            ]);

            return {
                popups,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            throw new CustomError("Failed to fetch popups", 500);
        }
    },

    getActivePopups: async () => {
        try {
            return await prisma.popup.findMany({
                where: { isActive: true },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            throw new CustomError("Failed to fetch active popups", 500);
        }
    },

    getPopupById: async (id: string) => {
        try {
            const popup = await prisma.popup.findUnique({ where: { id } });
            if (!popup) throw new CustomError("Popup not found", 404);
            return popup;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError("Failed to fetch popup details", 500);
        }
    },
};

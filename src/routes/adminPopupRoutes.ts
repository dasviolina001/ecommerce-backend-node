import express from "express";

import {
    createPopup,
    updatePopup,
    deletePopup,
    getAllPopups,
    getPopupById,
} from "../controller/popupController";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import { asyncHandler } from "../middleware/errorHandler";

import { popupImageUpload } from "../config/multer";

const router = express.Router();

router
    .route("/")
    .post(
        authMiddleware as any,
        adminAuthMiddleware as any,
        popupImageUpload,
        asyncHandler(createPopup)
    )
    .get(
        authMiddleware as any,
        adminAuthMiddleware as any,
        asyncHandler(getAllPopups)
    );

router
    .route("/:id")
    .get(
        authMiddleware as any,
        adminAuthMiddleware as any,
        asyncHandler(getPopupById)
    )
    .put(
        authMiddleware as any,
        adminAuthMiddleware as any,
        popupImageUpload,
        asyncHandler(updatePopup)
    )
    .delete(
        authMiddleware as any,
        adminAuthMiddleware as any,
        asyncHandler(deletePopup)
    );

export default router;

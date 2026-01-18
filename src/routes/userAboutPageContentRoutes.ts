import { Router } from "express";

import {
    getAllAboutPageContent,
    getAboutPageContentById,
} from "../controller/aboutPageContentController";

import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.get("/", asyncHandler(getAllAboutPageContent));

router.get("/:id", asyncHandler(getAboutPageContentById));

export default router;

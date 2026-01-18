import { Router } from "express";

import {
    getAllContactPageInformation,
    getContactPageInformationById,
} from "../controller/contactPageInformationController";

import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.get("/", asyncHandler(getAllContactPageInformation));

router.get("/:id", asyncHandler(getContactPageInformationById));

export default router;

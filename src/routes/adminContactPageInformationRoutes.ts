import { Router } from "express";

import {
    createContactPageInformation,
    updateContactPageInformation,
    deleteContactPageInformation,
} from "../controller/contactPageInformationController";

import { authMiddleware } from "../middleware/auth";

import { asyncHandler } from "../middleware/errorHandler";

import { adminAuthMiddleware } from "../middleware/authorization";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.post("/", asyncHandler(createContactPageInformation));

router.put("/:id", asyncHandler(updateContactPageInformation));

router.delete("/:id", asyncHandler(deleteContactPageInformation));

export default router;

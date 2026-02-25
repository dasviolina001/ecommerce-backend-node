import express from "express";

import { getActivePopups } from "../controller/popupController";

import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

router.get("/", asyncHandler(getActivePopups));

export default router;

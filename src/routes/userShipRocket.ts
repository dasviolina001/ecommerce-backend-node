import { Router } from "express";

import { asyncHandler } from "../middleware/errorHandler";

import * as shipRocketController from "../controller/shipRocketController";

const router = Router();

router.get("/pincode-availability", asyncHandler(shipRocketController.getPincodeAvailabilityAndDeliveryCharge));

export default router;
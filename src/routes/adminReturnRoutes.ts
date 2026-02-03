import { NextFunction, Router } from "express";

import {
  getAllReturns,
  getAdminReturnDetails,
  approveReturn,
  rejectReturn,
  updateReturnStatus,
  setDeliveryDate,
} from "../controller/returnController";

import { authMiddleware } from "../middleware/auth";

import { adminAuthMiddleware } from "../middleware/authorization";

import {
  adminReturnActionValidation,
  updateReturnStatusValidation,
  setDeliveryDateValidation,
  setDeliveryDateParamValidation,
  getReturnByIdValidation,
} from "../validators/returnValidator";

import { validate } from "../middleware/validation";

const router = Router();

router.use(authMiddleware as any);

router.use(adminAuthMiddleware as any);

router.get("/", getAllReturns);


const logger = (req: Request, _res: Response, next: NextFunction) => {
  console.log(req.body);
  next();
};

router.get(
  "/:returnId",
  validate(getReturnByIdValidation),
  getAdminReturnDetails,
);

router.post(
  "/:returnId/approve",
  validate(getReturnByIdValidation),
  validate(adminReturnActionValidation),
  approveReturn,
);

// Can only be cancelled if status is "INITIATED"
router.post(
  "/:returnId/reject",
  validate(getReturnByIdValidation),
  validate(adminReturnActionValidation),
  rejectReturn,
);

router.patch(
  "/:returnId/status",
  validate(getReturnByIdValidation),
  validate(updateReturnStatusValidation),
  updateReturnStatus,
);

router.patch(
  "/orders/:orderItemId/delivery-date",logger as any,
  validate(setDeliveryDateParamValidation),
  validate(setDeliveryDateValidation),
  setDeliveryDate,
);

export default router;

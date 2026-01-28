import { Router } from "express";
import {
    getAllReviewsForAdmin,
    updateReviewStatus,
    toggleReviewHighlight,
    deleteReview,
} from "../controller/reviewController";
import { authMiddleware } from "../middleware/auth";
import { adminAuthMiddleware } from "../middleware/authorization";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

router.use(authMiddleware as any);
router.use(adminAuthMiddleware as any);

router.get("/", asyncHandler(getAllReviewsForAdmin));
router.patch("/:reviewId/status", asyncHandler(updateReviewStatus));
router.patch("/:reviewId/highlight", asyncHandler(toggleReviewHighlight));
router.delete("/:reviewId", asyncHandler(deleteReview));

export default router;

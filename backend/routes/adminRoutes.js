import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { showAnalytics } from "../controllers/adminController.js";

const adminRouter = Router();

adminRouter.get('/analytics', protect, authorizeRoles("Admin"), showAnalytics);


export default adminRouter;
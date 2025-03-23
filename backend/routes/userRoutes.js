import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {adminBoard} from "../controllers/adminController.js";
import {studentBoard} from "../controllers/studentController.js";
import bookingRouter from "./bookingRoutes.js";

const routerUser = new Router();

routerUser.use('/admin',bookingRouter);
routerUser.use('/student',bookingRouter);

export default routerUser;


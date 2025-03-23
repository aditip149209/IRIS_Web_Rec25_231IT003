import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { addEquipment, updateEquipment, deleteEquipment } from "../controllers/adminController.js";


const eqRouter = Router();

eqRouter.post('/add',protect,authorizeRoles("Admin"), addEquipment);
eqRouter.patch('/update', protect,authorizeRoles("Admin"), updateEquipment);
eqRouter.delete('/delete',protect, authorizeRoles("Admin"), deleteEquipment);

export default eqRouter;




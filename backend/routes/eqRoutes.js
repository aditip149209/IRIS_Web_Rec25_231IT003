import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { addEquipment, updateEquipment, deleteEquipment, showAnalytics, addFacility, showEquipment, showFacility, deleteFacility, updateFacility } from "../controllers/adminController.js";

const eqRouter = Router();


eqRouter.post('/admin/equipment',protect,authorizeRoles("Admin"), addEquipment);
eqRouter.post('/admin/facilities',protect,authorizeRoles("Admin"), addFacility);
eqRouter.get('/admin/equipment',protect,authorizeRoles("Admin"), showEquipment);
eqRouter.get('/admin/facilities',protect,authorizeRoles("Admin"), showFacility);
eqRouter.patch('/admin/equipment',protect,authorizeRoles("Admin"), updateEquipment);
eqRouter.patch('/admin/facilities',protect,authorizeRoles("Admin"), updateFacility);
eqRouter.delete('/admin/facilities',protect,authorizeRoles("Admin"), deleteFacility);
eqRouter.delete('/admin/equipment',protect,authorizeRoles("Admin"), deleteEquipment);
eqRouter.get('/admin/analytics',protect,authorizeRoles("Admin"), showAnalytics);

export default eqRouter;




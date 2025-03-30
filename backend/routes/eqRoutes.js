import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { addEquipment, updateEquipment, deleteEquipment, showAnalytics, addFacility, showEquipment, showFacility, deleteFacility, updateFacility } from "../controllers/adminController.js";
import { totalBookings, mostActive, popularEquipmentNFacilities, getPeakHours, showEquipmentCount } from "../controllers/adminController.js";


const eqRouter = Router();

eqRouter.post('/equipment',protect,authorizeRoles("Admin"), addEquipment);
eqRouter.post('/facilities',protect,authorizeRoles("Admin"), addFacility);
eqRouter.get('/equipment',protect,authorizeRoles("Admin"), showEquipment);
eqRouter.get('/equipmentcounts',protect, authorizeRoles("Admin"), showEquipmentCount);
eqRouter.get('/facilities',protect,authorizeRoles("Admin"), showFacility);
eqRouter.patch('/equipment',protect,authorizeRoles("Admin"), updateEquipment);
eqRouter.patch('/facilities',protect,authorizeRoles("Admin"), updateFacility);
eqRouter.delete('/facilities',protect,authorizeRoles("Admin"), deleteFacility);
eqRouter.delete('/equipment',protect,authorizeRoles("Admin"), deleteEquipment);
eqRouter.get('/analytics',protect,authorizeRoles("Admin"), showAnalytics);
eqRouter.get('/analytics/bookings', protect, authorizeRoles("Admin"), totalBookings);
eqRouter.get('/analytics/users', protect, authorizeRoles("Admin"), mostActive);
eqRouter.get('/analytics/equipment', protect, authorizeRoles("Admin"), popularEquipmentNFacilities);
eqRouter.get('/analytics/peakhours',protect, authorizeRoles("Admin"), getPeakHours);


export default eqRouter;




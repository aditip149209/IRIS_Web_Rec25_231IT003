import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { addEquipment, updateEquipment, deleteEquipment, showAnalytics, addFacility, showEquipment, showFacility, deleteFacility, updateFacility, getMostBookedFacilities } from "../controllers/adminController.js";
import { totalBookings, mostActive, popularEquipment, getPeakHours, showEquipmentCount, showAllBookings, showAllEqBookings } from "../controllers/adminController.js";
import { changeStatus, deleteBooking, totalEqBookings } from "../controllers/adminController.js";


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
eqRouter.get('/bookings/equipment', protect, authorizeRoles("Admin"), showAllEqBookings);
eqRouter.get('/bookings/facility', protect, authorizeRoles("Admin"), showAllBookings);
eqRouter.patch('/bookings/facility', protect, authorizeRoles("Admin"), changeStatus);
eqRouter.delete('/bookings/equipment', protect, authorizeRoles("Admin"), deleteEquipment);
eqRouter.delete('/bookings/deletebooking', protect, authorizeRoles("Admin"), deleteBooking);
// eqRouter.get('/analytics',protect,authorizeRoles("Admin"), showAnalytics);
eqRouter.get('/analytics/bookings', protect, authorizeRoles("Admin"), totalBookings);
eqRouter.get('/analytics/totaleqbookings', protect, authorizeRoles("Admin"), totalEqBookings);
eqRouter.get('/analytics/users', protect, authorizeRoles("Admin"), mostActive);
eqRouter.get('/analytics/equipment', protect, authorizeRoles("Admin"), popularEquipment);
eqRouter.get('/analytics/facilities', protect, authorizeRoles("Admin"), getMostBookedFacilities);
eqRouter.get('/analytics/peakhours',protect, authorizeRoles("Admin"), getPeakHours);


export default eqRouter;




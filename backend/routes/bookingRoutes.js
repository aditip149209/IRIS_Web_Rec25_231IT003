import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { bookNew, getBookings, deletebooking, bookEquipment, getEqBookings, facId } from "../controllers/studentController.js";
import { checkCourtAvail, getSportList, getFacilities, getEquipmentList, getEquipmentQuantity} from "../controllers/checkController.js";


const bookingRouter = Router();


bookingRouter.post('/booking/newbooking',protect, authorizeRoles("Admin", "Student"), bookNew);
bookingRouter.get('/booking/getfacilityId', protect, facId);
bookingRouter.post("/booking/available", protect, checkCourtAvail);
bookingRouter.get("/booking/sports", protect, getSportList);
bookingRouter.get("/booking/facilities", protect, getFacilities);
bookingRouter.post('/booking/bookequipment',protect, authorizeRoles("Admin", "Student"), bookEquipment);
bookingRouter.get('/booking/userbookings', protect, authorizeRoles("Admin","Student"), getBookings);
bookingRouter.delete('/booking/deletebookings', protect, authorizeRoles("Admin", "Student"), deletebooking);
bookingRouter.get('/booking/bookequipment/equipmentlist', protect, authorizeRoles("Student"), getEquipmentList);
bookingRouter.get('booking/bookequipment/equipmentQuantity', protect, authorizeRoles("Student", "Admin"), getEquipmentQuantity);
bookingRouter.get('/booking/bookequipment/equipmentBookings', protect, authorizeRoles("Admin", "Student"), getEqBookings);


export default bookingRouter;




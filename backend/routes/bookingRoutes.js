import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { bookNew, getBookings, deletebooking, bookEquipment } from "../controllers/studentController.js";
import { checkCourtAvail, checkEquipmentAvailability } from "../controllers/checkController.js";

const bookingRouter = Router();

bookingRouter.post('/booking/newbooking',protect, authorizeRoles("Admin", "Student"), bookNew);
bookingRouter.get("/booking/available", checkCourtAvail);
bookingRouter.post('/booking/bookequipment',protect, authorizeRoles("Admin", "Student"), bookEquipment);
bookingRouter.get('/booking/userbookings', protect, authorizeRoles("Admin","Student"), getBookings);
bookingRouter.delete('/booking/deletebookings', protect, authorizeRoles("Admin", "Student"), deletebooking);


export default bookingRouter;




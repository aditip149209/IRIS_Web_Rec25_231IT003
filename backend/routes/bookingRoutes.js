import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { bookNew, getCurrentBookings, getPastBooking, deletebooking } from "../controllers/studentController.js";

const bookingRouter = Router();

bookingRouter.post('/booking/newbooking',protect, authorizeRoles("Admin", "Student"), bookNew);
bookingRouter.get('/booking/currentbookings', protect, authorizeRoles("Admin","Student"), getCurrentBookings);
bookingRouter.get('/booking/pastbookings',protect,authorizeRoles("Admin", "Student"),getPastBooking);
bookingRouter.delete('/booking/deletebookings', protect, authorizeRoles("Admin", "Student"), deletebooking);


export default bookingRouter;




import db from "../index.js";
import { Op } from "sequelize";
import { sequelize } from "../../utils/database.js";

const findBooking = async (userId, facilityId, sport, date, startTime) => {
    const endTime = new Date(`1970-01-01T${startTime}`);
        endTime.setHours(endTime.getHours() + 1);
        const formattedEndTime = endTime.toTimeString().split(" ")[0];

        // Check if facility is already booked
        const existingBooking = await db.Bookings.findOne({
            where: {
                facilityId,
                date,
                [Op.or]: [
                    { startTime: { [Op.between]: [startTime, formattedEndTime] } },
                    { endTime: { [Op.between]: [startTime, formattedEndTime] } },
                    { startTime: { [Op.lte]: startTime }, endTime: { [Op.gte]: formattedEndTime } }
                ]
            }
        });
        console.log(existingBooking);
        return existingBooking;
};

const newBooking = async(userId, facilityId, sport, date, startTime, endTime) => {
    const newBook = await db.Bookings.create({
        studentId: userId,
        facilityId,
        Sport: sport,
        date,
        startTime,
        endTime
    });

    return newBook;
};

const getBooking = async (uid) => {
    try {
        const bookings = await db.Bookings.findAll({
            where: {
                studentId: uid
            }
        });
        return bookings;
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

const getWaitedBooking = async (facilityId, date, startTime, endTime) => {
    try {
        const booking = await db.Waitlist.findOne({
            where: {
                FacId: facilityId,
                Date: date,
                startTime,
                endTime
            },
            order: [['CreationTime', 'ASC']] // Sort by CreationTime (earliest first)
        });
        return booking;
    } catch (error) {
        console.error("Error fetching waited booking:", error);
    }
};

const cancelBooking = async (bookingId) => {
    try {
        if (!bookingId) {
            throw new Error("Booking ID is required");
        }

        // Find the booking to be canceled
        const booking = await db.Bookings.findByPk(bookingId);

        if (!booking) {
            throw new Error("Booking not found");
        }

        const { facilityId, date, startTime, endTime } = booking;

        // Delete the booking
        await db.Bookings.destroy({ where: { id: bookingId } });

        // Check for waitlisted users for this slot
        const waitlistedUser = await getWaitedBooking(facilityId, date, startTime, endTime);
        const sportname = await db.Facility.findOne({
            where: {Fid: facilityId}
        });

        if (waitlistedUser) {
            // Convert waitlist entry into a confirmed booking
            const newBooking = await db.Bookings.create({
                studentId: waitlistedUser.Uid,
                facilityId: waitlistedUser.FacId,
                Sport: sportname.sport, // Add sport data if required
                date: date,
                startTime: startTime,
                endTime: endTime,
                createdAt: new Date(),
            });

            // Remove user from waitlist
            await db.Waitlist.destroy({ where: { Uid: waitlistedUser.Uid, FacId: waitlistedUser.FacId, Date: waitlistedUser.Date, startTime: waitlistedUser.startTime, endTime: waitlistedUser.endTime } });


            // Send notification
            await db.Notification.create({
                Uid: waitlistedUser.Uid,
                Message: `Your waitlisted slot for ${date} at ${startTime} has been confirmed! 🎉`,
                BookingId: waitlistedUser.Uid,
                createdAt: new Date(),
                Status: 'pending'
            });

            return {
                message: "Booking canceled, and the waitlisted user has been allocated the slot.",
                newBooking,
            };
        }

        return { message: "Booking canceled successfully. No waitlisted users for this slot." };
    } catch (error) {
        console.error("Error in cancelBooking:", error);
        throw error; // Throw the error to be handled by the controller
    }
};

export {findBooking, newBooking, cancelBooking, getBooking};


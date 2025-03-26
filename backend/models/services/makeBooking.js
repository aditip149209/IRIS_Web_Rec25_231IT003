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
        const booking = await db.Bookings.findOne({
            where: {
                facilityId,
                date,
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

const deleteBooking = async (bookingId, facilityId, startTime, endTime, date) => {
    try {
        const booking = await db.Bookings.destroy({
            where: {
                id: bookingId
            }
        });
        waitlistedBooking = await getWaitedBooking(facilityId, date, startTime, endTime);
        if (waitlistedBooking) {
            const newBooking = await db.Bookings.create({
                userId: waitlistedUser.Uid,
                facilityId: waitlistedUser.FacId,
                sport: null,  // Add sport data if required
                date: date,
                startTime: startTime,
                endTime: endTime,
                createdAt: new Date(),
            });
            await db.Notification.create({
                Uid: waitlistedBooking.studentId,
                Message: "Your waitlisted booking is now confirmed.",
                Status: "unread"
            });
            await db.Waitlist.destroy({
                where: {
                    id: waitlistedBooking.id
                }
            });
            return res.status(200).json({ message: "Booking deleted successfully, waitlisted user booking confirmed" });
        }

        const delBookingRip = await db.Bookings.destroy({
            where: {
                id: bookingId
            }
        });

        return res.Status(200).json({ message: "Booking deleted successfully" });   
        

    } catch (error) {
        console.error("Error deleting booking:", error);
    }
}

export {findBooking, newBooking, deleteBooking, getBooking};


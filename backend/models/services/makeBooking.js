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

const deleteBooking = async (bookingId) => {
    try {
        const booking = await db.Bookings.destroy({
            where: {
                id: bookingId
            }
        });
        return booking;
    } catch (error) {
        console.error("Error deleting booking:", error);
    }
}

export {findBooking, newBooking, deleteBooking, getBooking};


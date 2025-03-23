import db from "../models/index.js";
import { Op } from "sequelize";
import { findEqBooking } from "../models/services/EqBooking.js";

const checkCourtAvail = async (req, res) => {
    try {
        const { sport, date, facilityId } = req.body;
        console.log("sport:", sport);
        console.log("date:", date);

        if (!sport || !date || !facilityId) {
            return res.status(400).json({ message: "Missing required fields: sport, date" });
        }

        // Get all facilities of the given sport
        const allFacilities = await db.Facility.findOne({ where: { sport, Fid:facilityId } });
        console.log(allFacilities);
        if (!allFacilities) {
            return res.json({ message: "This facility for the sport does not exist" });
        }

        // Get all facility IDs
        // const facilityIds = allFacilities.map(facility => facility.Fid);

        // Fetch all bookings for these facilities on the given date
        const bookings = await db.Bookings.findAll({
            where: {
                Sport:sport,
                facilityId: facilityId,
                date
            },
            attributes: ['startTime', 'endTime']
        });

        // Define working hours (e.g., 8 AM to 8 PM)
        const openingTime = 8; // 8 AM
        const closingTime = 20; // 8 PM
        const slotDuration = 1; // 1-hour slots

        // Generate all possible 1-hour slots
        let availableSlots = [];
        for (let hour = openingTime; hour < closingTime; hour += slotDuration) {
            availableSlots.push(`${hour}:00 - ${hour + slotDuration}:00`);
        }

        // Filter available slots for each facility
        const facilityAvailability = {};
        let bookedSlots = new Set();

        // Convert bookings into blocked time slots
        bookings.forEach(booking => {
            let startHour = parseInt(booking.startTime.split(":")[0]);
            let endHour = parseInt(booking.endTime.split(":")[0]);
            for (let hour = startHour; hour < endHour; hour++) {
                bookedSlots.add(`${hour}:00 - ${hour + slotDuration}:00`);
            }
        });

        // Get available slots by removing booked slots
        let availableFacilitySlots = availableSlots.filter(slot => !bookedSlots.has(slot));
        

        res.json({ availableFacilitySlots });

    } catch (error) {
        console.error("Error in checkCourtAvail:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const checkEquipmentAvailability = async (EqId, requestedQty, startDate, endDate) => {

    const equipment = await db.Equipment.findByPk(EqId);
    if (!equipment) return { success: false, message: "Equipment not found" };


    const existingBookings = await findEqBooking(EqId, startDate, endDate);

    const start = new Date(startDate);
    const end = new Date(endDate);

    let dailyUsage = {};

    existingBookings.forEach(booking => {
        let bookingStart = new Date(booking.startDate);
        let bookingEnd = new Date(booking.endDate);

        for (let d = new Date(bookingStart); d <= bookingEnd; d.setDate(d.getDate() + 1)) {
            let dayKey = d.toISOString().split('T')[0]; 

            dailyUsage[dayKey] = (dailyUsage[dayKey] || 0) + booking.Quantity;
        }
    });

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        let dayKey = d.toISOString().split('T')[0];

        let bookedQty = dailyUsage[dayKey] || 0;
        let availableQty = equipment.StockCount - bookedQty;


        if (availableQty < requestedQty) {
            return { success: false, message: `Not enough equipment available on ${dayKey}.` };
        }
    }
    return { success: true };
};

export { checkEquipmentAvailability, checkCourtAvail};


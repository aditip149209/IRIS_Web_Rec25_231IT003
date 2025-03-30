import db from "../models/index.js";
import { Op } from "sequelize";
import { findEqBooking, createEqBooking, showEqBooking, deleteEqBooking, getListEq, getEqCount } from "../models/services/EqBooking.js";

const checkCourtAvail = async (req, res) => {
    try {
        const { sport, facility, date } = req.body;
        console.log("sport:", sport);
        console.log("date:", date);

        if (!sport || !date || !facility) {
            return res.status(400).json({ message: "Missing required fields: sport, date, facility" });
        }

        const allFacilities = await db.Facility.findOne({ where: { sport, name:facility } });
        console.log(allFacilities);
        if (!allFacilities) {
            return res.json({ message: "This facility for the sport does not exist" });
        }
        const facilityId = allFacilities.Fid

        const bookings = await db.Bookings.findAll({
            where: {
                Sport:sport,
                facilityId: facilityId,
                date
            },
            attributes: ['startTime', 'endTime']
        });

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

    const equipment = await db.Equipment.findOne({
        where: {EqId: EqId}
    });
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
const getSportList = async (req, res) => {
    try {
        const facs = await db.Facility.findAll({
            attributes: ['sport'],
            group: ['sport']
        });

        // Extract unique sport names using a Set
        const sportsSet = new Set(facs.map(facility => facility.sport));

        // Convert Set back to an array
        const uniqueSports = [...sportsSet];
        return res.status(200).json(uniqueSports);
    } catch (error) {
        console.error("Error fetching sports:", error);
        return res.status(500).json({
            message: "server error"
        })
    }
};

const getFacilities = async (req, res) => {
    const {sportname} = req.query;

    try {
        const facilities = await db.Facility.findAll({
            attributes: ['name'], 
            where: { sport: sportname } 
        });

        // Extract facility names
        const facilityList = facilities.map(facility => facility.name);

        return res.status(200).json({
            facilityList
        }) 
    } catch (error) {
        console.error("Error fetching facilities:", error);
        return res.status(500).json({
            message: "Internal server error"
        }); 
    }
};


const getEquipmentQuantity = async (req, res) => {
    const eqname  = req.body;
    if(eqname){
        try{
            const quantity = await getEqCount(eqname);
            return res.status(200).json(quantity);
        }
        catch(error){
            console.log(error.message);
            return res.status(500).json({
                message: "server error here in getequipmentquantity"
            })
        }
    }
    return res.status(400).json({
        message: "Some error happened"
    })
};

const getEquipmentList = async (req, res) => {
    try{
        const equipment = await getListEq();
        return res.status(200).json(equipment);
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
        })
    }
};

export { checkEquipmentAvailability,getFacilities, checkCourtAvail, getSportList, getEquipmentList, getEquipmentQuantity};


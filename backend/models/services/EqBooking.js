import { sequelize } from "../../utils/database.js";
import { Op } from "sequelize";
import db from "../index.js";


const findEqBooking = async (EqID, startDate, endDate ) => {
    try{
        const eqBooking = await db.BookingEquipment.findAll({
            where: {
                EqID,
                [Op.or]: [
                    { StartDate: { [Op.between]: [startDate, endDate] } },
                    { EndDate: { [Op.between]: [startDate, endDate] } },
                    { StartDate: { [Op.lte]: startDate }, EndDate: { [Op.gte]: endDate } }
                ]
            }

        });
        return eqBooking;
    }
    catch(error){
        console.error("Error fetching bookings:", error);
    }
};

const createEqBooking = async (uid, eqid,quantity, startDate, endDate) => {
    try{
        const eqBooking = await db.BookingEquipment.create({
            StudentID: uid,
            EqId: eqid,
            Quantity: quantity,
            StartDate: startDate,
            EndDate: endDate
        });
        return eqBooking;
    }
    catch(error){
        console.error("Error creating booking:", error); 
        return error;  
    }
};

const showEqBooking = async (uid) => {
    try{
        const eqBooking = await db.BookingEquipment.findAll({
            where: {
                studentId: uid
            }
        });
        return eqBooking;
    }
    catch(error){
        console.error("Error fetching bookings:", error);
    }
}

const deleteEqBooking = async (bookingId) => {
    try {
        const booking = await db.BookingEquipment.destroy({
            where: {
                bookingId
            }
        });
        return booking;
    }
    catch(error){
        console.error("Error deleting booking:", error);
    }
}   

export {findEqBooking, createEqBooking, showEqBooking, deleteEqBooking};




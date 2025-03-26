import db from "../models/index.js";
import { sequelize } from "../utils/database.js";
import { Op } from "sequelize";
import {findBooking, newBooking, getBooking, cancelBooking} from "../models/services/makeBooking.js";
import { checkEquipmentAvailability } from "./checkController.js";
import { deleteEqBooking, createEqBooking, showEqBooking } from "../models/services/EqBooking.js";

const studentBoard = (req,res) => {
    return res.status(200).json({
        "message" : "this is the stud endpoint, accessible to both students and admins"
    });
};

const bookNew = async (req, res) => {
    try {
        const { userId, facilityId, sport, date, startTime, confirmBooking, confirmWaitlist } = req.body;

        if (!userId || !facilityId || !sport || !date || !startTime) {
            return res.status(400).json({ message: "Missing required fields: userId, facilityId, sport, date, startTime" });
        }

        const endTime = new Date(`1970-01-01T${startTime}`);
        endTime.setHours(endTime.getHours() + 1);
        const formattedEndTime = endTime.toTimeString().split(" ")[0];

        const existingBooking = await findBooking(userId, facilityId, sport, date, startTime);

        if (existingBooking) {

            if(!confirmWaitlist){
                return res.status(409).json({ message: "Facility is already booked for this time slot, confirm joining waitlist" ,
                    waitlistOption: true
                });                            

            }
            
            const waitBooking = await db.Waitlist.create({
                Uid: userId,
                FacId: facilityId,
                EqId: null,
                startTime: startTime,
                endTime: formattedEndTime,
                CreationTime: new Date()
            });
            return res.status(201).json({ message: "Added to waitlist"});
        }

        if(!confirmBooking){
            return res.status(409).json({ message: "Facility is available for booking, confirm booking" ,
                bookingOption: true
            });
        }

        const newBook = await newBooking(userId, facilityId, sport, date, startTime, formattedEndTime);

        res.json({ message: "Booking successful", booking: newBook});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getBookings = async (req,res) => {
    console.log("supposed to show yours current bookings from the bookings table lol");
    try{
    const {uid} = req.body;

    if(!uid){
        return res.status(400).json({ message: "Missing required fields: uid" });
    };

    const bookings = await getBooking(uid);
    console.log(bookings);
    return res.status(200).json({
        message: "showing all current bookings",
        bookings
    });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}; 

const deletebooking = async (req,res) => {
    try{
        const {bookingId} = req.body;
        if(!bookingId){

            return res.status(400).json({ message: "Missing required fields: bookingId" });
        }
        const booking = await cancelBooking(bookingId);
        return res.status(200).json({
            message: "Booking deleted successfully",
            booking
        });
    }
    catch(error){
        console.error("Error in deletebooking:" ,error.message);
        res.status(500).json({ message: error.message
            
         });
    }
};


const bookEquipment = async (req,res) => {
    try{
        const {Uid, EqID, Quantity, StartDate, EndDate} = req.body;
        if(!Uid || !EqID || !Quantity || !StartDate || !EndDate){
            return res.status(400).json({ message: "Check required fields for missing values: Uid, EqID, Quantity, StartDate, EndDate" });
        }
        const check = await checkEquipmentAvailability(EqID, Quantity, StartDate, EndDate);
        if(check.success){
            try{const booking = await createEqBooking(Uid, EqID, Quantity, StartDate, EndDate);
            return res.status(200).json({
                message: "Equipment booked successfully",
                booking
            })}
            catch(error){
                console.error(error);
                res.status(500).json({ message: "Server error" });
            }
        }
        else{
            return res.status(400).json({ message: check.message });
        }
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getEqBookings = async (req, res) => {
    try{
        const {uid} = req.body;
        const bookings = await showEqBooking(uid);
        return res.status(200).json({
            message: "showing all current equipment bookings",
            bookings
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteEqBookings = async (req, res) => {
    try{
        const {bookingId} = req.body;
        const booking = await deleteEqBooking(bookingId);
        return res.status(200).json({
            message: "Equipment booking deleted successfully",
            booking
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }   
};

export {studentBoard, bookNew, getBookings, deletebooking, bookEquipment, getEqBookings, deleteEqBookings};


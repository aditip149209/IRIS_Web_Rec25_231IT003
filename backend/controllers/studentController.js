import db from "../models/index.js";
import { sequelize } from "../utils/database.js";
import { Op } from "sequelize";
import {findBooking, newBooking, getBooking, cancelBooking} from "../models/services/makeBooking.js";
import { checkEquipmentAvailability, getFacilities, checkCourtAvail, getSportList, getEquipmentList, getEquipmentQuantity } from "./checkController.js";
import { deleteEqBooking, createEqBooking, showEqBooking, getFacilityId} from "../models/services/EqBooking.js";
import sendMail from "../utils/mailer.js";

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
        const currentdate = new Date();
        currentdate.setHours(0, 0, 0, 0);

        const selectedDate = new Date(date);
        selectedDate.setHours(0,0,0,0);

        if(selectedDate < currentdate){
            return res.status(409).json({
                message: "You cannot book a slot in a past date"
        });
        }

        const user = await db.Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const endTime = new Date(`1970-01-01T${startTime}`);
        endTime.setHours(endTime.getHours() + 1);
        const formattedEndTime = endTime.toTimeString().split(" ")[0];

        const existingBooking = await findBooking(userId, facilityId, sport, date, startTime);
        const existingWaitlist = await db.Waitlist.findOne({
            where: {
                Uid: userId,
                FacId: facilityId,
                Date: date,
                startTime: startTime,
                endTime: formattedEndTime
            }
        });
        console.log(existingBooking);
        console.log(existingWaitlist);

        if (existingWaitlist) {
            return res.status(409).json({
                message: "You are already on the waitlist for this slot.",
                waitlistOption: false
            });
        }

        if (existingBooking) {
            if (!confirmWaitlist) {
                return res.status(409).json({
                    message: "Facility is already booked/waitlisted by you on this day, try another date",
                    waitlistOption: true
                });
            }

            const waitBooking = await db.Waitlist.create({
                Uid: userId,
                FacId: facilityId,
                EqId: null,
                Date: date,
                startTime: startTime,
                endTime: formattedEndTime,
                CreationTime: new Date()
            });

            await sendMail(user.email, "Waitlist Confirmation", 
                `Dear ${user.name},\n\nYou have been added to the waitlist for ${sport} at ${facilityId} on ${date} from ${startTime} to ${formattedEndTime}.\n\nWe will notify you if a slot becomes available.\n\nRegards,\nSports Booking System`);

            return res.status(201).json({ message: "Added to waitlist" });
        }

        if (!confirmBooking) {
            return res.status(409).json({
                message: "Facility is available for booking, confirm booking",
                bookingOption: true
            });
        }

        const newBook = await newBooking(userId, facilityId, sport, date, startTime, formattedEndTime);
        const bid = newBook.id;

        const bookingTime = new Date(`${date}T${startTime}`);
        const reminderTime = new Date(bookingTime.getTime() - 30 * 60 * 1000);

        await db.Notification.create({
            Uid: userId,
            BookingId: bid,
            Message: `Reminder: Your booking for ${sport} at ${facilityId} is scheduled for ${date} at ${startTime}.`,
            sendTime: reminderTime,
            status: "pending"
        });

        await sendMail(user.email, "Booking Confirmation",
            `Dear ${user.name},\n\nYour booking for ${sport} at ${facilityId} on ${date} from ${startTime} to ${formattedEndTime} has been confirmed.\n\nEnjoy your game!\n\nRegards,\nSports Booking System`);

        return res.json({ message: "Booking successful", booking: newBook });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getBookings = async (req,res) => {
    console.log("supposed to show yours current bookings from the bookings table lol");
    try{
    const {uid} = req.query;

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
        const bookingId = parseInt(req.query.bookingId);
        
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
        console.log(req.body);
        if(!Uid || !EqID || !Quantity || !StartDate || !EndDate){
            return res.status(400).json({ message: "Check required fields for missing values: Uid, EqID, Quantity, StartDate, EndDate" });
        }
        const check = await checkEquipmentAvailability(EqID, Quantity, StartDate, EndDate);
        if(check.success){
            try{
                const equipId = await db.Equipment.findOne({
                    where: {Ename: EqID},
                    attributes: ['EqId']
                })
                console.log("this is equipid" ,equipId);
                const booking = await createEqBooking(Uid, equipId, Quantity, StartDate, EndDate);
            await db.Equipment.increment(
                    { StatusBooked: Quantity, StatusAvailable: -Quantity },  // Increment StatusBooked by the quantity booked
                    { where: { Ename: EqID } }
                );
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
        const uid = req.query.uid;
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
        await db.Equipment.increment({
            StatusBooked : -booking.Quantity,
            StatusAvailable: booking.Quantity
        })
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

const facId = async (req, res) => {
    const {facilityName} = req.query;
    if(!facilityName) {
        console.log("Facility name is missing");
        return res.status(400).json({
            message: "Facility name missing in request"
        });
    }
    
        try{
            const facilityId = await getFacilityId(facilityName);
            if(!facilityId){
                return res.status(404).json({
                    message: "Facility not found"
                })
            }
            return res.status(200).json(facilityId);            
        }
        catch(error){
            return res.status(500).json({
                message: error.message
            })
        }
}



export {studentBoard, bookNew, getBookings, deletebooking, bookEquipment, getEqBookings, deleteEqBookings, facId};
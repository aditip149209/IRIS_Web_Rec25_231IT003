const studentBoard = (req,res) => {
    return res.status(200).json({
        "message" : "this is the student endpoint, accessible to both students and admins"
    });
};

const bookNew = (req, res) => {
    try {
        const { username, equipmentname, facilityname } = req.body;
        console.log(req.body);
        console.log(req.user.role);
        console.log(`supposed to do something with the ${username} and ${equipmentname} and ${facilityname} first testing endpoint`);
        return res.status(200).json({
            message: "booking confirmed",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing your request.",
        });
    }
};


const getCurrentBookings = (req,res) => {
    console.log("supposed to show yours current bookings from the bookings table lol");
    return res.status(200).json({
        message: "showing all current bookings",
    });
}; 


const getPastBooking = (req,res) => {
    console.log("supposed to show past bookings");
    return res.status(200).json({
        message: "showing all previous bookings",
    });
};


const deletebooking = (req,res) => {
    const {bookingid} = req.body;
    console.log(`supposed to cancel booking with booking id ${bookingid}`);
    return res.status(200).json({
        message: "successfully deleted booking",
    });
};

export {studentBoard, bookNew, getCurrentBookings, getPastBooking, deletebooking};

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

function BookFacility() {
    const [sports, setSports] = useState([]);
    const [availableFacilities, setAvailableFacilities] = useState([]);
    const [facility, setFacility] = useState("");
    const [facilityId, setFacilityId] = useState("");
    const [date, setDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [selectedSport, setSelectedSport] = useState("");
    const [userId, setUserId] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isWaitlisted, setIsWaitlisted] = useState(false);
    const [bookedSlots, setBookedSlots] = useState(new Set()); 

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
    }, []);

    useEffect(() => {
        const getSports = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/module/student/booking/sports`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                setSports(response.data);
            } catch (error) {
                console.error("Error fetching sports:", error.message);
            }
        };
        getSports();
    }, []);

    useEffect(() => {
        if (selectedSport) {
            const getfacs = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/module/student/booking/facilities?sportname=${selectedSport}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    });
                    console.log(selectedSport);
                    console.log(response.data.facilityList);
                    setAvailableFacilities(response.data.facilityList);
                }
                catch (error) {
                    console.log(error.message);
                }
            }
            getfacs();
        }
    }, [selectedSport])

    useEffect(() => {
        if (facility && date) {
            fetchAvailableSlots(facility, date);
            fetchFacilityId(facility);
        }
    }, [facility, date]);

    useEffect(() => {
        if(facility && date){
        setIsWaitlisted(bookedSlots.has(selectedSlot));
        }

    }, [selectedSlot]);

    const fetchFacilityId = async (facility) => {
        if (!facility) {
            return; 
        }
        try {
            const response = await axios.get(`http://localhost:3000/api/module/student/booking/getfacilityId?facilityName=${facility}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            setFacilityId(response.data.Fid);
        }
        catch (error) {
            
            return;
        }
    }

    const handleSportChange = (event) => {
        setSelectedSport(event.target.value);
        setFacility("");
        setAvailableFacilities([]);
    };

    const fetchAvailableSlots = async (facility, date) => {
        const openingtime = 8;
        const closingtime = 20;
        const interval = 1;
    
        let allSlots = []; // Generate all possible slots
        for (let hour = openingtime; hour < closingtime; hour += interval) {
            const startTime = `${hour.toString()}:00`;
            const endTime = `${(hour + interval).toString()}:00`;  
            allSlots.push(`${startTime} - ${endTime}`);
        }
        const sport = selectedSport;

        try {
            const response = await axios.post(
                'http://localhost:3000/api/module/student/booking/available',
                { sport, facility, date },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
    
            console.log("API Response:", response.data);
            setAvailableSlots(allSlots);
        
            const bookedSlotsSet = new Set(allSlots.filter(slot => !response.data?.availableFacilitySlots?.includes(slot)));
            console.log("All slots", allSlots);
            console.log("Booked Slots:", bookedSlotsSet);
            console.log("Available slots:", availableSlots);
            setBookedSlots(bookedSlotsSet); // Update the bookedSlots state
        
        } catch (error) {
            console.error("Error fetching available slots:", error);
        }
    };
    
    
    const handleSlotChange = (event) => {
        const selectedSlot = event.target.value;
        setSelectedSlot(selectedSlot);

        const isSlotBooked = bookedSlots.has(selectedSlot);
        setIsWaitlisted(isSlotBooked);

        console.log("Is slot booked?", isSlotBooked);
        console.log("isWaitlisted state:", isWaitlisted);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true); 
    };

    const correctTime = () => {

        const startime = selectedSlot.split(" - ")[0];
        let startHour = startime.split(":")[0]; 
        startHour = parseInt(startHour, 10);

        const date = new Date();
        date.setHours(startHour); 
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        const startTimeString = date.toLocaleTimeString('en-US', {
            hour12: false, 
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        return startTimeString;
    }

    const confirmBookingOrWaitlist = async () => {
        setShowConfirmation(false); // Close the modal
        
        try {
            const startime = correctTime();
            console.log(selectedSlot);
            const response = await axios.post(
                "http://localhost:3000/api/module/student/booking/newbooking",
                {
                    userId: userId,
                    facilityId: facilityId,
                    sport: selectedSport,
                    date: date,
                    startTime: startime,
                    confirmBooking: !isWaitlisted,
                    confirmWaitlist: isWaitlisted
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            if (!isWaitlisted) { // If it's a confirmed booking, update bookedSlots
                setBookedSlots(prev => new Set([...prev, selectedSlot]));
            }
            alert(response.data.message);
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed. Please try again.");
        }
        navigate('/studentdashboard');
        
    };
    console.log("Final isWaitlisted Value Before API Call:", isWaitlisted);


    const cancelConfirmation = () => {
        setShowConfirmation(false); // Close the modal
    };

    return (
        <div className='flex h-screen'>
     
            <aside className="w-64 bg-gray-700 text-white p-5 items-center flex flex-col">
  <h1 className="text-3xl font-bold mb-6">Menu</h1>
  <nav className="flex flex-col items-center justify-center ">
  <ul className="flex flex-col items-center">
            <li className="p-3">
              <Link
                to="/studentdashboard"
                className="btn btn-ghost hover:bg-primary hover:text-white"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/studentdashboard/bookingfacility"
                className="btn btn-ghost hover:bg-primary hover:text-white"
              >
                📅 Book Facility
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/studentdashboard/bookingequipment"
                className="btn btn-ghost hover:bg-primary hover:text-white"
              >
                🏋️‍♂️ Book Equipment
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/studentdashboard/bookinghistory"
                className="btn btn-ghost hover:bg-primary hover:text-white"
              >
                📜 My Bookings
              </Link>
            </li>
          </ul>    
  </nav>
</aside>
   <div className="w-full flex justify-center items-center h-screen bg-gray-900">
            <div className="w-1/3 bg-black p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-white">Book Facility</h2>
                <form className='w-full' onSubmit={handleSubmit}>
                    <div>
                        <label className="text-white">Select a Sport:</label>
                        <select className="w-full p-2 border border-gray-400 bg-black text-white rounded-md"
                            value={selectedSport} onChange={handleSportChange}>
                            <option value="">-- Select Sport --</option>
                            {sports.map((sport, index) => (
                                <option key={index} value={sport}>{sport}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-white">Select Facility:</label>
                        <select className="w-full p-2 border border-gray-400 bg-black text-white rounded-md"
                            value={facility} onChange={(e) => setFacility(e.target.value)} disabled={!selectedSport}>
                            <option value="">Choose a Facility</option>
                            {availableFacilities.map((f, index) => (
                                <option key={index} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-white">Select Date:</label>
                        <input type="date" className="w-full p-2 border border-gray-400 rounded-md"
                            value={date} onChange={(e) => setDate(e.target.value)} disabled={!facility} />
                    </div>

                    <div>
                        <label className="text-white">Select Time Slot:</label>
                        <select className="w-full p-2 border border-gray-400 bg-black text-white rounded-md"
                            value={selectedSlot}
                            onChange={handleSlotChange}
                            disabled={!date || availableSlots.length === 0}>
                            <option value="">Choose a Slot</option>
                            {availableSlots.length === 0 ? (
                                <option disabled>No Slots Available</option>
                            ) : (
                                availableSlots.map((slot, index) => (
                                    <option key={index} value={slot}>{slot}</option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button className="bg-green-500 text-white w-full p-2 rounded-md mt-4" type="submit" disabled={!selectedSlot}>Book Now</button>
                </form>
            </div>
            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-10 flex justify-center items-center">
                    <div className="bg-black p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Confirm Booking?</h2>
                        <p>
                            {isWaitlisted
                                ? "This slot is currently booked. Do you want to be added to the waitlist?"
                                : "Do you want to confirm your booking for the selected slot?"}
                        </p>
                        <div className="mt-4 flex justify-end">
                            <button className="bg-gray-300 text-gray-700 p-2 rounded-md mr-2" onClick={cancelConfirmation}>Cancel</button>
                            <button className="bg-blue-500 text-white p-2 rounded-md" onClick={confirmBookingOrWaitlist}>
                                {isWaitlisted ? "Join Waitlist" : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

export default BookFacility;

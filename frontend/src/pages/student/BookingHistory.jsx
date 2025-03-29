import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function BookingHistory() {

const [userId, setUserId] = useState("");
const [userBookings, setUserBookings] = useState([]);
const [bookingId, setBookingId] = useState("");

  useEffect(() => {
           const token = localStorage.getItem("token");
           const decoded = jwtDecode(token);
           setUserId(decoded.id);
  }, []);

  useEffect(() => {
    if(userId){
      fetchAllBookingUser();
    }
  },[userId]);


  const fetchAllBookingUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/module/student/booking/userbookings?uid=${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        setUserBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    }

  const fetchBookingId = async () => {
    try{

    }
    catch(error){

    }
  }

  const handleDelete = async () => {
    try{
    const response = await axios.delete(`http://localhost:3000/api/module/student/booking/deletebookings?bookingId=${bookingId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
    );
    return response;
  }
  catch(error){
    return console.log(error.message);
  }
  }

  return (
    <div className="w-full flex flex-col items-center bg-gray-900 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Your Current Bookings</h1>

      <div className="w-full max-w-4xl">
        {userBookings.length === 0 ? (
          <p className="text-white text-center">No bookings found.</p>
        ) : (
          userBookings.map((booking, index) => (
            <div key={index} className="bg-black text-white p-4 mb-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{booking.sport} - {booking.facility}</h2>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time Slot:</strong> {booking.startTime}</p>
              <button onClick={handleDelete}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BookingHistory

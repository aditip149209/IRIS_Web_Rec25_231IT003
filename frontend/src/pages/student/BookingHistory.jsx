import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function BookingHistory() {

const [userId, setUserId] = useState("");
const [userBookings, setUserBookings] = useState([]);
const [refresh, setRefresh] = useState(false);

  useEffect(() => {
           const token = localStorage.getItem("token");
           const decoded = jwtDecode(token);
           setUserId(decoded.id);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  useEffect(() => {
    if(userId){
      fetchAllBookingUser();
    }
  },[userId, refresh]);

  const fetchAllBookingUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/module/student/booking/userbookings?uid=${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        console.log(response.data.bookings);

        setUserBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    }

  

  const handleDelete = async (bookingId) => {
    if(!bookingId){
      return null;
    }
    try{
    const response = await axios.delete(`http://localhost:3000/api/module/student/booking/deletebookings?bookingId=${bookingId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
    );
    setRefresh(prev => !prev);
    return response;
  }
  catch(error){
    return console.log(error.message);
  }
  }

  return (
    <div className='flex h-screen'>
    <aside className="w-64 bg-gray-800 text-white p-5 items-center flex flex-col">
  <h1 className="text-3xl font-bold mb-6">Menu</h1>
  <nav className="flex flex-col items-center justify-center ">
  <ul className="flex flex-col items-center">
            <li className="p-3">
              <Link
                to="/studentdashboard"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/studentdashboard/bookingfacility"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white"
              >
                📅 Book Facility
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/studentdashboard/bookingequipment"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white"
              >
                🏋️‍♂️ Book Equipment
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/studentdashboard/bookinghistory"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white"
              >
                📜 My Bookings
              </Link>
            </li>
            <li>
            <button className = "btn btn-primary hover: bg-primary hover: text-white" onClick={handleLogout}>Logout</button>
          </li>
          </ul>    
  </nav>
</aside>
    <div className="w-full flex flex-col items-center bg-gray-900 min-h-screen p-6 main-section">
      <h1 className="text-2xl font-bold text-white mb-6">All Bookings</h1>

      <div className="w-full max-w-4xl">
        {userBookings.length === 0 ? (
          <p className="text-white text-center">No bookings found.</p>
        ) : (
          userBookings.map((booking, index) => (
            <div key={index} className="bg-black text-white p-4 mb-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{booking.Sport} - {booking.Facility.name}</h2>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time Slot:</strong> {booking.startTime}</p>
              <button
                className={`mt-2 p-2 rounded-sm ${
                new Date(booking.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-800"
                }`}
                onClick={() => {
                if (new Date(booking.date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) {
                    handleDelete(booking.id);
              }
            }}
            disabled={new Date(booking.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)}
            >
            Delete
          </button>

            </div>
          ))
        )}
      </div>
    </div>
    </div>
  )
}

export default BookingHistory

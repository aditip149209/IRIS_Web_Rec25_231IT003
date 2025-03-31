import React, { use } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axios from 'axios';

function Booking() {
  const [deleteBooking, setDeleteBooking] = useState("");
  const [deleteEqBooking, setDeleteEqBooking] = useState("");
  const [eqBookingList, setEqBookingList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [status, setStatus] = useState('pending');
  const [bookingid, setBookingid] = useState("");

  const [mode, setMode] = useState("facility");

  const fetchBookings = async () => {
      try {
        const facilityBookings = await axios.get('http://localhost:3000/api/manage/bookings/facility', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
    
        const equipmentBookings = await axios.get('http://localhost:3000/api/manage/bookings/equipment', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
    
        console.log("Facility Bookings:", facilityBookings.data);
        console.log("Equipment Bookings:", equipmentBookings.data);
    
        setBookingList(facilityBookings.data.bookingsList); // ✅ Correcting state update
        setEqBookingList(equipmentBookings.data.bookingsEqList); // ✅ Fixing typo
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    };
  
  
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatus = async (bookingId, status) => {
    if(!bookingId || !status){
      return;
    }
      try{
        console.log("in handle status function now");
        const changeStatus = await axios.patch(`http://localhost:3000/api/manage/bookings/facility`, {
            bookingId: bookingId,
            status: status
        }, {
          headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
        });

        setBookingList(
          bookingList.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: status }
              : booking
        )    )    
      }
      catch(error){
        console.log(error.message);
      }
  };

  const handleDeleteBooking = async () => {
    if(!deleteBooking){
      return;
    }
    try{
      const delbooking = await axios.delete(`http://localhost:3000/api/manage/bookings/deletebooking?bookingId=${deleteBooking}`,{
        headers : {Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      setBookingList(bookingList.filter((booking) => booking.id !== deleteBooking));
      setDeleteBooking("");
    }
    catch(error){
      console.log(error);
    }    
  };

  const handleEqBooking = async () => {
    if(!deleteEqBooking){
      return;
    }
    try{
      const delEqbooking = await axios.delete(`http://localhost:3000/api/manage/bookings/equipment?bookingId=${deleteBooking}`,{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      setEqBookingList(eqBookingList.filter((booking) => booking.BookingEquipID !== deleteBooking));
      setDeleteEqBooking("");
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    if (deleteBooking) {
      handleDeleteBooking();
      console.log("deleted");
    }
  }, [deleteBooking]);

  useEffect(() => {
    if(deleteEqBooking){
      handleEqBooking();
      console.log("deleted eq booking");
        }

  }, [deleteEqBooking])

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");    
  }
  
  return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <aside className="w-72 bg-gray-900 text-white text-center p-10 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      <nav className="flex flex-col">
        <ul className="space-y-3">
          <li>
            <Link to="/admin" className="btn btn-ghost hover:bg-gray-600 hover:text-white">
              📊 Analytics Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/equipment" className="btn btn-ghost hover:bg-gray-600 hover:text-white">
              🏋️‍♂️ Manage Equipment
            </Link>
          </li>
          <li>
            <Link to="/admin/facility" className="btn btn-ghost hover:bg-gray-600 hover:text-white">
              🏢 Manage Facility
            </Link>
          </li>
          <li>
            <Link to="/admin/booking" className="btn btn-ghost hover:bg-gray-600 hover:text-white">
              📅 Manage Bookings
            </Link>
          </li>
          <li>
            <Link to="/studentdashboard" className="btn btn-ghost hover:bg-gray-600 hover:text-white">
               Switch to Student View
            </Link>
          </li>
          <li>
            <button className = "btn btn-primary hover: bg-primary hover: text-white" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </aside>

    <div className="flex-1 bg-gray-100 p-10 main-section">
      <header className="text-3xl text-black font-bold mb-4">Manage Bookings</header>
      <div className="flex space-x-4 mb-6">
          <button
            className={`p-2 rounded-md ${mode === 'facility' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setMode('facility')}
          >
            Facility Bookings
          </button>
          <button
            className={`p-2 rounded-md ${mode === 'equipment' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
            onClick={() => setMode('equipment')}
          >
            Equipment Bookings
          </button>
        </div>
      {mode === 'facility' && (
          bookingList.length === 0 ? (
            <p className="text-black text-center">No bookings found.</p>
          ) : (
            bookingList.map((booking, index) => (
              <div key={index} className="bg-black text-white p-4 mb-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">
                  Student ID: {booking.User.UName} - {booking.Facility.name}
                </h2>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time Slot:</strong> {booking.startTime}</p>
                <p><strong>Status:</strong> {booking.status}</p>

                {/* Delete Button */}
                <button
                  className={`mt-2 p-2 rounded-sm ${
                    new Date(booking.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-800"
                  }`}
                  onClick={() => {
                    if (new Date(booking.date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) {
                      setDeleteBooking(booking.id);
                    }
                  }}
                  disabled={new Date(booking.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)}
                >
                  Delete
                </button>

                {/* Approve Button */}
                <button
                  className={`mt-2 ml-2 p-2 rounded-sm ${
                    booking.status === "approved"
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-800"
                  }`}
                  onClick={() => {
                    if (booking.status !== "approved" && new Date(booking.date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) {
                      setStatus("approved");
                      handleStatus(booking.id, "approved");      
                      console.log("updated status")              
                    }
                  }}
                  disabled={booking.status === "approved" ||  (new Date(booking.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) && booking.status !== "approved")}
                >
                  {booking.status === "approved" ? "Approved" : "Mark as Approved"}
                </button>
              </div>
            ))
          )
        )}

      {mode === 'equipment' && (
          eqBookingList.length === 0 ? (
            <p className="text-black text-center">No bookings found.</p>
          ) : (
            eqBookingList.map((booking, index) => (
              <div key={index} className="bg-black text-white p-4 mb-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">
                  Student ID: {booking.User.UName} - {booking.Equipment.Ename}
                </h2>
                <p><strong>Start Date:</strong> {booking.StartDate.split("T")[0]}</p>
                <p><strong>End Date:</strong> {booking.EndDate.split("T")[0]}</p>
                <p><strong>Quanity:</strong> {booking.Quantity}</p>

                {/* Delete Button */}
                <button
                  className={`mt-2 p-2 rounded-sm ${
                    new Date(booking.StartDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-800"
                  }`}
                  onClick={() => {
                    if (new Date(booking.StartDate).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)) {
                      setDeleteEqBooking(booking.BookingEquipID);
                    }
                  }}
                  disabled={new Date(booking.StartDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)}
                >
                  Delete
                </button> 
              </div>
            ))
          )
        )}
    </div>
  </div>
  )
}

export default Booking;


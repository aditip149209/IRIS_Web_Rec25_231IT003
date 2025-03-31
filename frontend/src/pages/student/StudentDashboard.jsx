import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [currentEquipmentBookings, setCurrentEquipmentBookings] = useState([]);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const uid = decoded.id;
        console.log(uid);

        const response = await axios.get(
          `http://localhost:3000/api/module/student/booking/userbookings?uid=${uid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBookings(response.data);

        const now = new Date().setHours(0,0,0,0);
        const books = response.data.bookings;
        setUpcomingBookings(
          books.filter((booking) => new Date(booking.date).setHours(0,0,0,0) >= now)
        );
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
  
    fetchBookings();
  }, []);

  useEffect(() => {
    if(bookings){
      console.log(bookings);
    }
  })

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };



  useEffect(() =>{
    const fetchEquipBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const uid = decoded.id;
        console.log(uid);

        const response = await axios.get(
          `http://localhost:3000/api/module/student/booking/bookequipment/equipmentBookings?uid=${uid}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );       
        const now = new Date().setHours(0,0,0,0);
        const books = response.data.bookings;
        console.log(books);
        setCurrentEquipmentBookings(
          books.filter((booking) => new Date(booking.StartDate).setHours(0,0,0,0) >= now)
        );
        console.log(currentEquipmentBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }
    fetchEquipBookings();
  }, [])

  return (
    <>
    <div className="flex h-screen">

  <aside className="w-64 bg-gray-900 text-white p-10 items-center flex flex-col">
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
                className="btn btn-ghost hover:bg-primary hover:text-white"
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

    <main className="flex-1 p-10 bg-gray-700">
    
    <h2 className="text-3xl font-bold mb-6">Welcome, Student!</h2>

    <div>
    <section className="mb-6">
    <h3 className="text-xl font-semibold mb-2 p-3">📌 Upcoming Bookings</h3>
    {upcomingBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="card bg-base-200 shadow-xl p-4"
                  >
                    <h4 className="card-title">{booking.Sport} - {booking.Facility.name}</h4>
                    <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                    <p>Start Time: {booking.startTime}</p>
                    <p>End Time: {booking.endTime}</p>
                    <div className="card-actions justify-end">
                      <div className="badge badge-info badge-lg">
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info max-w-4xl">🎉 No upcoming bookings!</div>
            )}
    </section>


    <section className="mb-6">
    <h3 className="text-xl font-semibold mb-2 p-3">📌 Current Equipment Rentals</h3>
    {currentEquipmentBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEquipmentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="card bg-base-200 shadow-xl p-4"
                  >
                    <h4 className="card-title">{booking.BookingEquipID} - {booking.EqId}</h4>
                    <p>Start Date: {new Date(booking.StartDate).toLocaleDateString()}</p>
                    <p>End Date: {new Date(booking.EndDate).toLocaleDateString()}</p>
                   
                    <div className="card-actions justify-end">
                      
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-info max-w-4xl">🎉 No equipment bookings!</div>
            )}
      </section>
      </div>
    </main>
    </div>
    </> 
  );
};

export default StudentDashboard;

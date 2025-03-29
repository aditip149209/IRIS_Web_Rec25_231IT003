import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);

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

        const now = new Date();
        const books = response.data.bookings;
        setUpcomingBookings(
          books.filter((booking) => new Date(booking.date) > now)
        );
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
    <div class="flex h-screen">

  <aside className="w-64 bg-gray-900 text-white p-5 items-center flex flex-col">
  <h1 className="text-3xl font-bold mb-6">Menu</h1>
  <nav className="flex flex-col items-center justify-center w-48">
  <ul className="flex flex-col items-center w-full">
            <li className="p-3">
              <Link
                to="/studentdashboard"
                className="btn btn-primary hover:bg-primary hover:text-white"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/studentdashboard/bookingfacility"
                className="btn btn-primary hover:bg-primary hover:text-white"
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

    <main className="flex-1 p-10 bg-gray-700">
    <h2 className="text-3xl font-bold mb-6">Welcome, Student!</h2>


    <section className="mb-6">
    <h3 className="text-xl font-semibold mb-2">📌 Upcoming Bookings</h3>
    {upcomingBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="card bg-base-200 shadow-xl p-4"
                  >
                    <h4 className="card-title">{booking.facility || booking.equipment}</h4>
                    <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                    <p>Time: {booking.time}</p>
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

    <section>
        <h3 className="text-xl font-semibold mb-2">📜 My Bookings</h3>
        {bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-200">
                    <tr>
                      <th>Facility/Equipment</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover">
                        <td>{booking.facility || booking.equipment}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                        <td>{booking.time}</td>
                        <td>
                          <span
                            className={`badge ${
                              booking.status === "Confirmed"
                                ? "badge-success"
                                : "badge-warning"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-warning max-w-4xl">You have no past bookings.</div>
            )}
    </section>

    </main>
    </div>
    </> 
  );
};

export default StudentDashboard;

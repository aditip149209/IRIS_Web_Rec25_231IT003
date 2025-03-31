import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function AdminDashboard() {
  const [totalBookingCount, setTotalBookingCount] = useState(0);
  const [totalEquipmentBookingCount, setTotalEquipmentBookingCount] = useState(0);
  const [peakHours, setPeakHours] = useState([]);
  const [peakHoursCount, setPeakHoursCount] = useState([]);
  const [mostBookedFacility, setMostBookedFacility] = useState([]);
  const [mostBookedFacilityCount, setMostBookedFacilityCount] = useState([]);
  const [mostPopularEq, setMostPopularEq] = useState([]);
  const [mostPopularEqCount, setMostPopularEqCount] = useState([]);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [mostActiveUsersCount, setMostActiveUsersCount] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  const getTotalBookings = async () => {
    try{
      const books = await axios.get('http://localhost:3000/api/manage/analytics/bookings', {
        headers : {Authorization : `Bearer ${localStorage.getItem("token")}`}
      })
      setTotalBookingCount(books.data);          
    }
    catch(error){
      console.log(error);
    }
  }     

  const getTotalEqBookings = async () =>{
    try{
      const bookeq = await axios.get('http://localhost:3000/api/manage/analytics/totaleqbookings', {
        headers : {Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      setTotalEquipmentBookingCount(bookeq.data);
    }
    catch(error){
      console.log(error);
    }
  }


  const getPeakHours = async () => {
    try{
      const getHours = await axios.get('http://localhost:3000/api/manage/analytics/peakhours',{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      setPeakHours(getHours.data.map(hour => hour.hour));
      setPeakHoursCount(getHours.data.map(hour => hour.booking_count));
      
    }
    catch(error){
      console.log(error);
    }
  }

  const getMostActiveUsers = async () => {
    try{
      const mostactive = await axios.get('http://localhost:3000/api/manage/analytics/users', {
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      setMostActiveUsers(mostactive.data.map(user => user.User.UName));
      setMostActiveUsersCount(mostactive.data.map(user => user.booking_count));
    }
    catch(error){
      console.log(error);
    }
  }

  const getMostBookedEquipment = async () => {
    try{
      const mostbooked = await axios.get('http://localhost:3000/api/manage/analytics/equipment', {
        headers : {Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      setMostPopularEq(mostbooked.data.map(eq => eq.Ename));
      setMostPopularEqCount(mostbooked.data.map(eq => eq.UsageCount));
    }
    catch(error){
      console.log(error);
    }
  }

  const getMostUsedFacilities = async () => {
    try{
      const mostused = await axios.get('http://localhost:3000/api/manage/analytics/facilities', {
        headers: {Authorization : `Bearer ${localStorage.getItem("token")}`}
       
      });
      setMostBookedFacility(mostused.data.map(fac => fac.name));
      setMostBookedFacilityCount(mostused.data.map(fac => fac.booking_count));
    }
    catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    getMostActiveUsers();
    getTotalBookings();
    getTotalEqBookings();
    getMostBookedEquipment();
    getPeakHours();
    getMostUsedFacilities();

  }, [])

  return (
    
      <div className='flex min-h-screen'>
      <aside className="w-72 bg-gray-900 text-white p-10 items-center flex flex-col ">
  <h1 className="text-3xl font-bold mb-6">Menu</h1>
  <nav className="flex flex-col items-center justify-center overflow-y-auto">
  <ul className="flex flex-col items-center">
            <li className="p-3">
              <Link
                to="/admin"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white"
              >
                 📊 Analytics Dashboard
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/admin/equipment"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white"
              >
                🏋️‍♂️ Manage Equipment
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/admin/facility"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white">
                 🏢 Manage Facility
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/admin/booking"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white">
                 📅 Manage Bookings
              </Link>
            </li>
            <li className='p-3 m-2'>
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
      <div className='p-10'>
        <main>
          <h2 className='text-3xl font-bold'>Welcome, Admin</h2>
          <div className='flex flex-wrap gap-8 mb-10'>
          <section className="mt-8 bg-gray-900 p-4 rounded-xl">
            <h3 className="text-xl font-bold mb-5">Total Bookings</h3>
            <p className="text-2xl font-bold text-blue-600">{totalBookingCount}</p>
          </section>
          <section className='mt-8 bg-gray-900 p-4 rounded-xl'>
            <h3 className='text-xl font-bold mb-5'>Total Equipment Bookings</h3>
            <p className='text-2xl font-bold text-blue-500'>{totalEquipmentBookingCount}</p>
          </section>
          </div>

          <div className='flex flex-wrap gap-10 mb-10 bg-gray-700 p-10 rounded-xl'>
          <section className="mt-2 bg-gray-900 rounded-xl p-5">
            <h3 className="text-2xl font-bold mb-5">Top 5 Most Active Users (Of All Time)</h3>
            <Bar
              data={{
                labels: mostActiveUsers,
                datasets: [{
                  label: 'Bookings',
                  data: mostActiveUsersCount,
                  backgroundColor: 'rgba(54, 100, 235, 0.5)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
              width={600}
              height={400}
            />
            </section>

            <section className="mt-2 bg-gray-900 rounded-xl p-5">
            <h3 className="text-2xl font-bold mb-5">Peak Usage Hours</h3>
            <Bar
              data={{
                labels: peakHours,
                datasets: [{
                  label: 'Bookings per Hour',
                  data: peakHoursCount,
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 1,
                }]
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
              width={600}
              height={400}
            />
          </section>
          </div>
          <div className='flex flex-wrap gap-10 mb-10 bg-gray-700 p-10 rounded-xl'>
          <section className="bg-gray-900 rounded-xl p-5">
            <h3 className="text-2xl font-bold mb-5 mt-5">Most Popular Equipment</h3>
            <Pie
              data={{
                labels: mostPopularEq,
                datasets: [{
                  label: 'Usage Count',
                  data: mostPopularEqCount,
                  backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#2ecc71'],
                }]
              }}
              options={{ responsive: true }}
              width={500}
              height={300}
            />
          </section>
          <section className=" bg-gray-900 rounded-xl p-5">
  <h3 className="text-2xl font-bold mb-10 mt-5">Most Used Facilities</h3>
  <Bar
    data={{
      labels: mostBookedFacility,
      datasets: [{
        label: 'Bookings',
        data: mostBookedFacilityCount,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    }}
    options={{ responsive: true, plugins: { legend: { display: false } } }}
    width={600}
    height={400}
  />
</section>
          </div>
        </main>
      </div>      
    </div>
  )
}

export default AdminDashboard

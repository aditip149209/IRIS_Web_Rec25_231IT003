import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function AdminDashboard() {

  


  const getPeakHours = () => {

  }

  const getMostActiveUsers = () => {

  }

  const getMostBookedEquipment = () => {

  }

  

  
  
  return (
    <div>
      <div>
      <aside className="w-64 bg-gray-900 text-white p-5 items-center flex flex-col">
  <h1 className="text-3xl font-bold mb-6">Menu</h1>
  <nav className="flex flex-col items-center justify-center ">
  <ul className="flex flex-col items-center">
            <li className="p-3">
              <Link
                to="/admin"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white"
              >
                Analytics Dashboard
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/admin/equipment"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white"
              >
                Manage Equipment
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/admin/facility"
                className="btn btn-ghost hover:bg-gray-600 hover:text-white">
                Manage Facility
              </Link>
            </li>
            <li className="p-3">
              <Link
                to="/admin/booking"
                className="btn btn-ghost hover:bg-primary hover:text-white">
                Manage Bookings
              </Link>
            </li>
          </ul>    
  </nav>
</aside>
      </div>
      <div>
        <main>
          <h2>Welcome, Admin</h2>
        </main>
      </div>      
    </div>
  )
}

export default AdminDashboard

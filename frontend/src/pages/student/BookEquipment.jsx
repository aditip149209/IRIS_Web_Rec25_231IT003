import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function BookEquipment() {
  
  const [equipmentList, setEquipmentList] = useState([]); // Equipment options
  const [eqID, setEqID] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userId, setUserId] = useState(""); // Replace with actual user ID from auth
  const [currentBookings, setCurrentBookings] = useState([]);

  const navigate = useNavigate();

  // Fetch available equipment from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
    fetchEquipment();
    // fetchUserBookings();
  }, []);

  useEffect(() => {
 

  }, [eqID]);

  useEffect(() => {

  }, [eqID, quantity]);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/module/student/booking/bookequipment/equipmentlist", 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }); 
        console.log(response.data);
        setEquipmentList(response.data);
        console.log(equipmentList);
      return equipmentList;
      
      
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  // const fetchUserBookings = async () => {
    // try {
      // console.log("error is not here, this is right before sending the request")
      // const response = await axios.get("http://localhost:3000/api/module/student/booking/bookequipment/equipmentBookings", { uid: userId },
        // { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      // );
      // console.log(response.data);
      // setCurrentBookings(response.data.bookings);
    // } catch (error) {
      // console.error("Error fetching user bookings:", error);
    // }
  // };

  
  const handleBooking = async (event) => {
    event.preventDefault();
    // console.log(userId);
    // console.log(eqID);
    try {
      const response = await axios.post("http://localhost:3000/api/module/student/booking/bookequipment", {
        Uid: userId,
        EqID: eqID,
        Quantity: quantity,
        StartDate: startDate,
        EndDate: endDate,
      },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

      alert(response.data.message);
      // fetchUserBookings(); // Refresh bookings after successful booking
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
    navigate("/studentdashboard/");

  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-700">
      <div className="w-1/3 bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Book Equipment</h2>

        <form onSubmit={handleBooking}>
          {/* Equipment Selection */}
          <label className="block font-semibold">Select Equipment:</label>
          <select
            className="input input-bordered w-full my-2"
            value={eqID}
            onChange={(e) => setEqID(e.target.value)}>
            <option value="">Choose Equipment</option>
            {
              equipmentList && equipmentList.length > 0 ? (
                equipmentList.map((eq) => (
                  <option key={eq.Ename} value={eq.Ename}>
                     {eq.Ename}
                  </option>
                )
                )
              ) : (
                <option value = "" disabled>
                  No equipment available
                </option>
              )
            }
          </select>

          {/* Quantity */}
          <label className="block font-semibold">Quantity:</label>
          <input
            type="number"
            className="input input-bordered w-full my-2"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(e.target.value)}
          />

          {/* Start Date */}
          <label className="block font-semibold">Start Date:</label>
          <input
            type="date"
            className="input input-bordered w-full my-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          {/* End Date */}
          <label className="block font-semibold">End Date:</label>
          <input
            type="date"
            className="input input-bordered w-full my-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          {/* Submit Button */}
          <button
            className="btn btn-primary w-full mt-4"
            type="submit"
            disabled={!eqID || !quantity || !startDate || !endDate}
          >
            Book Equipment
          </button>
        </form>        
      </div>
    </div>      
  )
}

export default BookEquipment

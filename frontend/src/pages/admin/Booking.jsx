import React from 'react'
import { useState, useEffect } from 'react'

function Booking() {
    const [sport, setSport] = useState("");
    const [facility, setFacility] = useState("");

  return (
    
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Book a Facility</h2>
        <form onSubmit={handleSubmit}>

          {/* Sport Selection */}
          <label className="block font-semibold">Select Sport:</label>
          <select className="input input-bordered w-full my-2" value={sport} onChange={(e) => {
              setSport(e.target.value);
              setFacility(""); // Reset facility when sport changes
            }}>
            <option value="">Choose a Sport</option>
            {Object.keys(sportsFacilities).map((s, index) => (
              <option key={index} value={s}>{s}</option>
            ))}
          </select>

          {/* Facility Selection */}
          <label className="block font-semibold">Select Facility:</label>
          <select className="input input-bordered w-full my-2" value={facility} 
            onChange={(e) => setFacility(e.target.value)} disabled={!sport}>
            <option value="">Choose a Facility</option>
            {sport && sportsFacilities[sport].map((f, index) => (
              <option key={index} value={f}>{f}</option>
            ))}
          </select>

          {/* Date Selection */}
          <label className="block font-semibold">Select Date:</label>
          <input type="date" className="input input-bordered w-full my-2" 
            value={date} onChange={(e) => setDate(e.target.value)} disabled={!facility} />

          {/* Time Slot Selection */}
          <label className="block font-semibold">Select Time Slot:</label>
          <select className="input input-bordered w-full my-2" value={selectedSlot} 
            onChange={(e) => setSelectedSlot(e.target.value)} disabled={!date || availableSlots.length === 0}>
            <option value="">Choose a Slot</option>
            {availableSlots.map((slot, index) => (
              <option key={index} value={slot}>{slot}</option>
            ))}
          </select>

          {/* Submit Button */}
          <button className="btn btn-primary w-full mt-4" type="submit" disabled={!selectedSlot}>Book Now</button>

        </form>
      </div>
    </div>
      
  )
}

export default Booking

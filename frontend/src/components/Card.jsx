import React from 'react'

function Card() {


  return (
    <div className="card w-96 bg-neutral text-neutral-content shadow-lg p-4">
      <div className="card-body">
        <h2 className="card-title text-lg font-semibold">
          {booking.facility} - {booking.status}
        </h2>
        <p className="text-sm">
          <span className="font-medium">Booked by:</span> {booking.user}
        </p>
        <p className="text-sm">
          <span className="font-medium">Date:</span> {booking.date}
        </p>
        <p className="text-sm">
          <span className="font-medium">Time:</span> {booking.time}
        </p>
        <div className="card-actions justify-end">
          {booking.status === "Pending" ? (
            <button className="btn btn-warning btn-sm">Cancel</button>
          ) : booking.status === "Approved" ? (
            <button className="btn btn-error btn-sm">Cancel</button>
          ) : (
            <button className="btn btn-disabled btn-sm">Cancelled</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card;

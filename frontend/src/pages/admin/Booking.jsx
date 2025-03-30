import React from 'react'

function Equipment() {
  return (
    <div>
       <div>
      <div>
        <aside>
          <div>
            <h1>Menu</h1>
            <ul>
              <li>Dashboard</li>{/* redirect to analytics dashboard*/}
              <li>Manage Bookings</li>{/* redirect to manage bookings sections*/}
              <li>Manage Equipment</li>{/* redirect to manage equipment section- add, delete, update or mark the status of the equipment*/}
              <li>Manage Facilities</li>{/* redirect to manage facilities- add, delete, update or mark the status of the facility*/}
              <li>Switch to Student View</li> {/* redirect to student dashboard- admin can book for themselves*/}
            </ul>
          </div>
        </aside>
      </div>
      <div>
        <main>
          {/* this will be the equipment dashboard*/}
        </main>
      </div>      
    </div>
      
    </div>
  )
}

export default Equipment

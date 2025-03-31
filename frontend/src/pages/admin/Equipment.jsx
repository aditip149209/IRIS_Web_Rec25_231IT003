import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Equipment() {
  const [mode, setMode] = useState('add');
  const [equipmentList, setEquipmentList] = useState([]);
  const [reservedCount, setReservedCount] = useState(0);
  const [stockCount, setStockCount] = useState(0);
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [availableCount, setAvailableCount] = useState(0);
  const [bookedCount, setBookedCount] = useState(0);
  const [newEquipment, setNewEquipment] = useState("");
  const [newQuantity, setNewQuantity] = useState(0);
  const [sport, setSport] = useState("");
    
  const fetchEquipList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/manage/equipment', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      console.log("Equipment List:", response.data);
      setEquipmentList(response.data.equips.map(equip => equip.Ename));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEquipList();
  }, []);

  const handleEquipmentChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedEquipment(selectedValue);

    if (!selectedValue) return;

    try {
      const response = await axios.get(`http://localhost:3000/api/manage/equipmentcounts?ename=${selectedValue}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      console.log("Counts:", response.data.counts);
      setReservedCount(response.data.counts.StatusReserved || 0);
      setBookedCount(response.data.counts.StatusBooked || 0);
      setAvailableCount(response.data.counts.StatusAvailable || 0);
      setStockCount(response.data.counts.StockCount || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEquipment || !newQuantity || !sport) {
      console.log("Please fill in all fields.");
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:3000/api/manage/equipment',
        { 
          name: newEquipment, 
          stockcount: newQuantity, 
          sport: sport 
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      console.log("Added equipment successfully:", response.data);
      fetchEquipList(); // Refresh equipment list
    } catch (error) {
      console.log("Error adding equipment:", error.response?.data || error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    if (!selectedEquipment) {
      console.log("Please select an equipment to update.");
      return;
    }
  
    // Calculate available count dynamically
    const computedAvailableCount = stockCount - (reservedCount + bookedCount);
  
    if (computedAvailableCount < 0) {
      console.log("The sum of reserved and booked cannot exceed stock count.");
      return;
    }
  
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/manage/equipment`,
        {
          Name: selectedEquipment, 
          StockCount: stockCount, 
          StatusReserved: reservedCount, 
          StatusAvailable: computedAvailableCount,  // Use computed value
          StatusBooked: bookedCount
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
  
      console.log("Updated equipment successfully:", response.data);
      fetchEquipList(); // Refresh equipment list after update
    } catch (error) {
      console.log("Error updating equipment:", error.response?.data || error.message);
    }
  };
  

  const handleDelete = async (e) => {
    e.preventDefault();
    
    if (!selectedEquipment) {
      console.log("Please select an equipment to delete.");
      return;
    }
  
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/manage/equipment?name=${selectedEquipment}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      
      console.log("Deleted equipment successfully:", response.data);
      fetchEquipList(); // Refresh the equipment list after deletion
      setSelectedEquipment(""); // Reset the selected equipment
    } catch (error) {
      console.log("Error deleting equipment:", error.response?.data || error.message);
    }
  };

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

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-10">
        <header className="text-3xl text-black font-bold mb-6">Manage Equipment</header>

        {/* Mode Selection Buttons */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setMode('add')} className="btn btn-primary">➕ Add Equipment</button>
          <button onClick={() => setMode('delete')} className="btn btn-danger">❌ Delete Equipment</button>
          <button onClick={() => setMode('update')} className="btn btn-warning">🔄 Update Equipment</button>
        </div>

        {/* Dynamic Section Based on Mode */}
        <div className="p-6 bg-gray-500 shadow-md rounded-lg">
          
        {mode === 'update' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">🔄 Update Equipment</h2>
    <form onSubmit={handleUpdate}>
      {/* Select Equipment */}
      <label className="block mb-2">Select Equipment:</label>
      <select className="input input-bordered w-full mb-4"
              value={selectedEquipment}
              onChange={handleEquipmentChange}>
        <option value="">-- Select Equipment --</option>
        {equipmentList.map((equipment, index) => (
          <option key={index} value={equipment}>{equipment}</option>
        ))}
      </select>

      {/* Total Stock Count */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-lg font-medium">Total Stock:</label>
        <button type="button" className="btn btn-gray"
                onClick={() => setStockCount(prev => Math.max(prev - 1, reservedCount + bookedCount))}>
          ➖
        </button>
        <span className="text-lg font-semibold">{stockCount}</span>
        <button type="button" className="btn btn-gray"
                onClick={() => setStockCount(prev => prev + 1)}>
          ➕
        </button>
      </div>

      {/* Reserved Count */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-lg font-medium">Reserved:</label>
        <button type="button" className="btn btn-gray"
                onClick={() => setReservedCount(prev => Math.max(prev - 1, 0))}>
          ➖
        </button>
        <span className="text-lg font-semibold">{reservedCount}</span>
        <button type="button" className="btn btn-gray"
                onClick={() => setReservedCount(prev => Math.min(prev + 1, stockCount - bookedCount))}>
          ➕
        </button>
      </div>

      {/* Auto-updating Available Count */}
      <label className="block mb-2 font-medium text-lg" onChange={() => setAvailableCount(stockCount - reservedCount - bookedCount)}>Available: {stockCount - reservedCount - bookedCount}</label>
      <label className="block mb-2 font-medium text-lg" onChange={() => setBookedCount(bookedCount)}>Booked: {bookedCount}</label>

      {/* Update Button */}
      <button type="submit" className="btn btn-warning" onClick={handleUpdate}>Update Equipment</button>
    </form>
  </div>
)}

          
          
          {mode === 'add' && (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Equipment</h2>
      <form>
      <label className="block mb-2 text-lg font-medium">Equipment Name:</label>
        <input 
          type="text"
          className="input input-bordered w-full mb-4"
          value={newEquipment}
          onChange={(e) => setNewEquipment(e.target.value)}
          placeholder="Enter new equipment name"
        />

      <label className="block mb-2 text-lg font-medium">Sport Name:</label>
        <input 
          type="text"
          className="input input-bordered w-full mb-4"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          placeholder="Enter sport name"
        />

      <div className="flex items-center gap-4">
        <label className="text-lg font-medium">Quantity:</label>
        <button 
          type="button"
          className="px-3 py-1 bg-gray-700 text-xl rounded hover:bg-gray-400"
          onClick={() => setNewQuantity(prev => Math.max(0, prev - 1))} // Prevents going below zero
        >
          ➖
        </button>
        <span className="text-lg font-semibold">{newQuantity}</span>
        <button 
          type="button"
          className="px-3 py-1 bg-gray-700 text-xl rounded hover:bg-gray-400"
          onClick={() => setNewQuantity(prev => prev + 1)}
        >
          ➕
        </button>
      </div>

      <button type="submit" className="btn btn-warning mt-4" onClick={handleAdd}>Add Equipment</button>
    </form>
  </div>
)}
          {mode === 'delete' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">🔄 Delete Equipment</h2>
              <form>
                <label className="block mb-2">Select Equipment:</label>
                <select className="input input-bordered w-full mb-4"
                        value={selectedEquipment}
                        onChange={handleEquipmentChange}>
                  <option value="">-- Select Equipment --</option>
                  {equipmentList.map((equipment, index) => (
                    <option key={index} value={equipment}>{equipment}</option>
                  ))}
                </select>              

                <button type="submit" className="btn btn-warning" onClick={handleDelete}>Delete Equipment</button>
              </form>
            </div>
          )}  

          {!mode && <p className="text-gray-500">Select an option above to manage equipment.</p>}
        </div>
      </div>
    </div>
  );
}

export default Equipment;

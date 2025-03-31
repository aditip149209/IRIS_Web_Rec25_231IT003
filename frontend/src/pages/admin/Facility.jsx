import React from 'react'
import { useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'


function Facility() {
  const [mode, setMode] = useState('add');
  const [facilityList, setFacilityList] = useState([]);
  const [facility, setFacility] = useState("");
  const [newFacility, setNewFacility] = useState("");
  const [location, setLocation] = useState("");
  const [sport, setSport] = useState("");
  const [type, setType] = useState("");
    
  const fetchFacilityList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/manage/facilities', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      console.log("Equipment List:", response.data);
      setFacilityList(response.data.facilities.map(fac => fac.name));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFacilityList();
  }, []);

  const handleFacilityChange = async (event) => {
    const selectedValue = event.target.value;
    setFacility(selectedValue);

    if (!selectedValue) return;

    try {
      const response = await axios.get(`http://localhost:3000/api/manage/equipmentcounts?ename=${selectedValue}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if(!newFacility || !sport){
      return;
    }  
    try{
      const addFac = await axios.post('http://localhost:3000/api/manage/facilities',{
        sport: sport,
        name: newFacility,
        location: location,
        type: type
      },{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      })
      fetchFacilityList();
      console.log("added facility");
    }
    catch(error){
      console.log(error.message);
    }
  };

  const handleReserve= async (status) => {
    try{
      const updatef = await axios.patch('http://localhost:3000/api/manage/facilities',{
        name: facility,
        status: status
      })
      console.log(`Current status of facility: ${status}`);
    }
    catch(error){
      console.log(error.message);
    }   
  };  

  const handleDelete = async (e) => {
    e.preventDefault();
    try{
      const delfac = await axios.delete(`http://localhost:3000/api/manage/facilities?name=${facility}`,{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
      });
      fetchFacilityList()
      console.log("deleted successfully");
    }
    catch(error){
      console.log(error.message);
    }
  };    

  const navigate = useNavigate()

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

      <div className="flex-1 bg-gray-100 p-10 overflow-y-auto">
        <header className="text-3xl text-black font-bold mb-6">Manage Equipment</header>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setMode('add')} className="btn btn-primary">➕ Add Facility</button>
          <button onClick={() => setMode('delete')} className="btn btn-danger">❌ Delete Facility</button>
          <button onClick={() => setMode('update')} className="btn btn-warning">🔄 Update Facility</button>
        </div>

        <div className="p-6 bg-gray-500 shadow-md rounded-lg">
          
        {mode === 'update' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">🔄 Update Facility</h2>
    <form>
      <label className="block mb-2">Select Facility:</label>
      <select className="input input-bordered w-full mb-4"
              value={facility}
              onChange={handleFacilityChange}>
        <option value="">-- Select Facility --</option>
        {facilityList.map((facility, index) => (
          <option key={index} value={facility}>{facility}</option>
        ))}
      </select>
      <div className=' flex gap-2'>
      <button className="btn btn-warning" onClick={()=> handleReserve('reserved')}>Mark as Reserved</button>
      <button className='btn btn-warning' onClick={() => handleReserve('maintenance')}>Mark as Under Maintenance</button>
      </div>

    </form>
  </div>
)}
          {mode === 'add' && (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Facility</h2>
      <form>
      <label className="block mb-2 text-lg font-medium">Facility Name:</label>
        <input 
          type="text"
          className="input input-bordered w-full mb-4"
          value={newFacility}
          onChange={(e) => setNewFacility(e.target.value)}
          placeholder="Enter new facility name"
        />

      <label className="block mb-2 text-lg font-medium">Sport Name:</label>
        <input 
          type="text"
          className="input input-bordered w-full mb-4"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          placeholder="Enter sport name"
        /> 

        <label className="block mb-2 text-lg font-medium">Location:</label>
          <input 
            type="text"
            className="input input-bordered w-full mb-4"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location name"
          /> 

        <label className="block mb-2 text-lg font-medium">Type:</label>
          <input 
            type="text"
            className="input input-bordered w-full mb-4"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter type of facility"
          /> 
      <button type="submit" className="btn btn-warning mt-4" onClick={handleAdd}>Add Facility</button>
    </form>
  </div>
)}
          {mode === 'delete' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">🔄 Delete Facility</h2>
              <form>
                <label className="block mb-2">Select Facility:</label>
                <select className="input input-bordered w-full mb-4"
                        value={facility}
                        onChange={handleFacilityChange}>
                  <option value="">-- Select Facility --</option>
                  {facilityList.map((facility, index) => (
                    <option key={index} value={facility}>{facility}</option>
                  ))}
                </select>             

                <button type="submit" className="btn btn-warning" onClick={handleDelete}>Delete Facility</button>
              </form>
            </div>
          )}  

          {!mode && <p className="text-gray-500">Select an option above to manage facility.</p>}
        </div>
      </div>
    </div>
  )
}

export default Facility

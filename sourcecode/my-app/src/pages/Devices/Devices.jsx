import { useState } from 'react'
import React from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar/Navbar'
import SideNavbar from '../../components/Navbar/SideNavbar'
import './Devices.css'
import Card from '../../components/Card/Card';

const AddDevice = () => {
  const [data, setData] = useState(""); 
  const [isActive, setIsActive] = useState(true);

  function handleAddDevice(e) {
    e.preventDefault(); 
    axios.post("http://localhost:8000/lorawan/nodes/", {
      node_id: parseInt(data, 10), 
      is_active: isActive
    });
    setData("");
    setIsActive(true);
  }

  return (
    <Card id="addDevice" className="addDevice">
      <form onSubmit={handleAddDevice}>
        <label>
          Node ID:
          <input
            type="number"
            value={data}
            onChange={e => setData(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
          />
        </label>
        <input type="submit" value="Add Node" />
      </form>
    </Card>
  );
};

const DeviceContent = () => {
  return(
    <div className="deviceContentContainer">
      <AddDevice/>
    </div>
  )
};

const Devices = () => {
  return(
    <div id="deviceContainer">
      <Navbar />
      <SideNavbar />
      <DeviceContent />
    </div>
  )
};

export default Devices
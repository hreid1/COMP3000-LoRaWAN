import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar/Navbar'
import SideNavbar from '../../components/Navbar/SideNavbar'
import './Devices.css'
import Card from '../../components/Card/Card';

const Graph = () => {
  return (
    <Card id="graphDevice" title="Graph">

    </Card>
  )
}

const DeviceInfo = ({ nodeID, owner, isActive, createdAt, packetCount }) => {
  return(
    <Card id="deviceInfo" title="Device Information">
      <div className="deviceInfoContent">
        <p>Node ID: {nodeID}</p>
        <p>Owner: {owner}</p>
        <p>Packet Count: {packetCount}</p>
        <p>Is Active: {isActive}</p>
        <p>Created At: {createdAt}</p>
      </div>
    </Card>
  )
}

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
    <Card id="addDevice" className="addDevice" title="Add Device">
      <form onSubmit={handleAddDevice} className="addDeviceContainer">
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
          Is Active:
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
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/nodes/")
    .then((response) => {
      setData(response.data.results || []);
    })
    .catch(error => {
      console.error("Error fetching models: ", error)
    })
  }, []);
  
  console.log(data)

  return(
    <div className="deviceContentContainer">
      <div className="deviceContainerLeft">
        <AddDevice/>
        <Graph />
      </div>
      <div className="deviceContainerRight">
        <div className="deviceGrid">
          {data && data.map(device => (
            <DeviceInfo 
              key={device.id}
              nodeID={device.node_id}
              owner={device.owner}
              isActive={device.is_active}
              createdAt={new Date(device.created_at).toLocaleString()}
              packetCount={device.packets_count}
            />
          ))}
        </div>
      </div>
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
import { useState } from 'react'
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

const DeviceInfo = ({ nodeID, mac, location, isActive, packets }) => {
  return(
    <Card id="deviceInfo" title="Device Information">
      <span>Device Info</span>
      <div className="deviceInfoContent">
        <p>Node ID: {nodeID}</p>
        <p>MAC: {mac}</p>
        <p>Location: {location}</p>
        <p>Is Active: {isActive}</p>
        <p>Packet Count: {packets}</p>
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
  const devices = [
    { id: 1, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
    { id: 2, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
    { id: 3, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
    { id: 4, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
    { id: 5, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
    { id: 6, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
    { id: 7, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
    { id: 8, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
    { id: 9, nodeID: 1, mac: "00-00-00-00", location: "SW Farm", isActive: true, packets: 0},
  ]

  return(
    <div className="deviceContentContainer">
      <div className="deviceContainerLeft">
        <AddDevice/>
        <Graph />
      </div>
      <div className="deviceContainerRight">
        <div className="deviceGrid">
          {devices.map(device => (
            <DeviceInfo 
              key={device.id}
              nodeID={device.nodeID}
              mac={device.mac}
              location={device.location}
              isActive={device.isActive}
              packets={device.packets}
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
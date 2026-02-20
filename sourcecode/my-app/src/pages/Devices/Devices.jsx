import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import './Devices.css'
import Card from '../../components/Card/Card';
import DeviceCard from '../../components/Card/DeviceCard';
import Example from '../../components/Charts/Graph';

const Graph = () => {
  return (
    <Card id="deviceGraph" title="Graph">
      <Example />
    </Card>
  )
}

const DeviceInfo = ({ nodeID, owner, isActive, createdAt, packetCount }) => {
  return(
    <DeviceCard 
      nodeID={nodeID}
      owner={owner}
      isActive={isActive}
      createdAt={createdAt}
      packetCount={packetCount}
    />
  )
}

const AddDevice = () => {
  const [nodeId, setNodeId] = useState(""); 
  const [mac, setMac] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);

  function handleAddDevice(e) {
    e.preventDefault(); 
    axios.post("http://localhost:8000/lorawan/nodes/", {
      node_id: parseInt(nodeId, 10), 
      is_active: isActive
    });
    setNodeId("");
    setMac("");
    setLocation("");
    setIsActive(true);
  }

  return (
    <Card id="addDevice" title="Add Device Form">
      <form onSubmit={handleAddDevice} className="addDeviceForm">
        <div className="formRow">
          <label htmlFor="nodeId">Node ID</label>
          <input
            id="nodeId"
            type="number"
            value={nodeId}
            onChange={e => setNodeId(e.target.value)}
            required
          />
        </div>
        <div className="formRow">
          <label htmlFor="mac">MAC</label>
          <input
            id="mac"
            type="text"
            value={mac}
            onChange={e => setMac(e.target.value)}
          />
        </div>
        <div className="formRow">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>
        <div className="formRow">
          <label htmlFor="isActive">Is Active</label>
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
          />
        </div>
        <button type="submit" className="addDeviceBtn">Add</button>
      </form>
    </Card>
  );
};

const DeviceStatistics = () => {
  return(
    <Card title="Statistics">
      <ul className="statsList">
        <li>How many devices are active/offline</li>
        <li>How many packets total/being read</li>
        <li>What devices are transmitting anomalies</li>
      </ul>
    </Card>
  )
}

const DeviceList = () => {
  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("node_id")

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/nodes/")
    .then((response) => {
      setData(response.data.results || []);
    })
    .catch(error => {
      console.error("Error fetching models: ", error)
    })
  }, []);

  const filteredData = data.filter(device =>
    String(device.node_id).includes(search)
  );

  return (
    <Card title="Devices">
      <div className="deviceListControls">
        <select
          className="deviceSort"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="node_id">Sort by: Node ID</option>
          <option value="created_at">Sort by: Date</option>
          <option value="is_active">Sort by: Status</option>
        </select>
        <input
          className="deviceSearch"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="deviceGrid">
        {filteredData &&
          filteredData.map((device) => (
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
    </Card>
  );
}

const Map = () => {
  return(
    <Card title="Map">
    </Card>
  )
}

const DeviceContent = () => {
  return (
    <div className="deviceContentContainer">
      <div className="deviceContainerTop">
        <DeviceStatistics />
        <DeviceStatistics />
        <DeviceStatistics />
      </div>
      <div className="deviceContainerMiddle">
        <Map />
      </div>
      <div className="deviceContainerBottom">
        <div className="deviceContainerLeft">
          <AddDevice />
          <Graph />
        </div>
        <div className="deviceContainerRight">
          <DeviceList />
        </div>
      </div>
    </div>
  );
};

const Devices = () => {
  return(
    <div>
      <DeviceContent />
    </div>
  )
};

export default Devices
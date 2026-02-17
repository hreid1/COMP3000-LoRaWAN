import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import './Devices.css'
import Card from '../../components/Card/Card';
import DeviceCard from '../../components/Card/DeviceCard';

const Graph = () => {
  return (
    <Card id="graphDevice" title="Graph">

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
          MAC
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

const Test = () => {
  return(
    <Card>
      <span>Test</span>
    </Card>
  )
}

const DeviceStatistics = () => {
  return(
    <Card>
      <span>Device Statistics</span>
      <ul>How many devices are active/offline</ul>
      <ul>How many packets total/being read</ul>
      <ul>What devices are transmitting anomalies</ul>

    </Card>
  )
}

const DeviceList = () => {
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
  
  //console.log(data)

  return (
    <Card title="Devices">
      <div className="deviceGrid">
        {data &&
          data.map((device) => (
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

const DeviceContent = () => {

  return(
    <div className="deviceContentContainer">
      <div className="deviceContainerTop">
        <DeviceStatistics />
        <Test />
        <Test />
      </div>
      <div className="deviceMainContainer">
        <div className="deviceContainerLeft">
          <AddDevice/>
          <Graph />
        </div>
        <div className="deviceContainerRight">
          <DeviceList />
        </div>
      </div>
    </div>
  )
};

const Devices = () => {
  return(
    <DeviceContent />
  )
};

export default Devices
import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import './Devices.css'
import Card from '../../components/Card/Card';
import DeviceCard from '../../components/Card/DeviceCard';
import Example from '../../components/Charts/Graph';
import Map from '../../components/Map/Map';
import { Box, Alert, Grid, TextField, FormControlLabel, Checkbox, Button, Stack, MenuItem, CircularProgress } from '@mui/material';

const Graph = () => {
  return (
    <Card id="deviceGraph" title="Graph">
      <Example />
    </Card>
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
      <Box component="form" onSubmit={handleAddDevice} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Node ID"
          type="number"
          value={nodeId}
          onChange={e => setNodeId(e.target.value)}
          required
          fullWidth
          variant="outlined"
        />
        <TextField
          label="MAC"
          type="text"
          value={mac}
          onChange={e => setMac(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Location"
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          fullWidth
          variant="outlined"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
            />
          }
          label="Is Active"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
          Add Device
        </Button>
      </Box>
    </Card>
  );
};

const DeviceStatistics = () => {
  return (
    <div id="deviceStats">
      <Card title="Statistics">
        <ul className="statsList">
          <li>How many devices are active/offline</li>
          <li>How many packets total/being read</li>
          <li>What devices are transmitting anomalies</li>
        </ul>
      </Card>
      <Card title="Statistics1">
        <ul className="statsList">
          <li>How many devices are active/offline</li>
          <li>How many packets total/being read</li>
          <li>What devices are transmitting anomalies</li>
        </ul>
      </Card>
      <Card title="Statistics2">
        <ul className="statsList">
          <li>How many devices are active/offline</li>
          <li>How many packets total/being read</li>
          <li>What devices are transmitting anomalies</li>
        </ul>
      </Card>
    </div>
  )
}

const DeviceList = ({data}) => {
  return (
    <Card title="Devices" id="deviceContainer">
      <div className="deviceGrid">
        {data &&
         data.map((device) => (
          <div key={device.id}>
             <DeviceCard
               nodeID={device.node_id}
               owner={device.owner}
               isActive={device.is_active}
               createdAt={new Date(device.created_at).toLocaleString()}
               packetCount={device.packets_count}
             />
          </div>
         ))}
      </div>
    </Card>
  );
}

const Map2 = () => {
  return(
    <Card title="Map" id="mapBox" >
      <Map />
    </Card>
  )
}

const DeviceContent = ({data, loading, error}) => {
  if (loading) {
    return (
      <Box sx={{display: 'grid', placeItems: 'center', height: '100vh'}}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{display: 'grid', placeItems: 'center', height: '100vh'}}>
        <Alert severity='error' sx={{fontWeight: 'bold'}}>
          Error: {error}
        </Alert>
      </Box>
    )
  }

  return (
    <div className="deviceContentContainer">
      <DeviceStatistics />
      <Map2 />
      <AddDevice />
      <Graph />
      <DeviceList data={data.devices} />
    </div>
  );
};

const Devices = () => {
  const [data, setData] = useState({
    devices: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devices] = await Promise.all([
          axios.get("http://127.0.0.1:8000/lorawan/users/1/"),
        ])
        setData({
          devices: devices.data.nodes || [],
          loading: false,
          error: null
        })

      } catch (err) {
        setData(prev => ({ ...prev, loading: false, error: err.message}))
      }
    }
    fetchData()
  }, []);

  
  return(
    <>
      <DeviceContent data={data} loading={data.loading} error={data.error}/>
    </>
  )
};

export default Devices
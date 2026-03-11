import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import './Devices.css'
import Card from '../../components/Card/Card';
import DeviceCard from '../../components/Card/DeviceCard';
import Example from '../../components/Charts/Graph';
import Map from '../../components/Map/Map';
import { Box, Grid, TextField, FormControlLabel, Checkbox, Button, Stack, MenuItem } from '@mui/material';

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
  const [sortBy, setSortBy] = useState("name")

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
    <Card title="Devices" id="deviceContainer">
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="created_at">Date</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search Device Node..."
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </Box>
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

const Map2 = () => {
  return(
    <Card title="Map" id="mapBox" >
      <Map />
    </Card>
  )
}

const DeviceContent = () => {
  return (
    <div className="deviceContentContainer">
      <div className="top">
        <DeviceStatistics />
        <DeviceStatistics />
        <DeviceStatistics />
      </div>
      <div className="middle">
        <Map2/>
      </div>
      <div className="bottom">
        <div className="bottomLeft">
          <AddDevice />
          <Graph />
        </div>
        <div className="bottomRight">
          <DeviceList />
        </div>
      </div>
      <Graph />
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
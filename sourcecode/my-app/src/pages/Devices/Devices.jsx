import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import './Devices.css'
import Card from '../../components/Card/Card';
import DeviceCard from '../../components/Card/DeviceCard';
import Example from '../../components/unusedcomponents/Charts/Graph';
import Map from '../../components/Map/Map';
import { Box, Alert, Grid, TextField, FormControlLabel, Checkbox, Button, Stack, MenuItem, CircularProgress, Typography } from '@mui/material';
import ErrorIcon from "@mui/icons-material/Error"
import DevicesIcon from '@mui/icons-material/Devices';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Graph = ({data}) => {
  // Get top 5 devices transmitting the most packets
  const chartData = data && data.devices && data.devices.length > 0
    ? data.devices
        .sort((a, b) => (b.packets_count || 0) - (a.packets_count || 0))
        .slice(0, 5)
        .map(device => ({
          nodeID: `Node ${device.node_id}`,
          packets: device.packets_count || 0,
          active: device.is_active ? 'Active' : 'Offline'
        }))
    : []

  return (
    <Card id="deviceGraph" title="Top 5 Devices by Packet Count">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="nodeID" 
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis label={{ value: 'Packet Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => value} />
            <Legend />
            <Bar 
              dataKey="packets" 
              fill="#0097a7" 
              name="Packets Transmitted"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No device data available</p>
      )}
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

const DeviceStatistics = ({data, anomalies}) => {
  // Filter by is_active to get number of offline/online devices
  // Which node is showing anomalies
  // Average SSR, SF maybe
  const onlineDevices = data?.filter(device => device.is_active).length || 0;
  const offlineDevices = data?.filter(device => !device.is_active).length || 0;
  const totalDevices = data?.length || 0;
  const totalAnomaly = anomalies?.length || 0;

  // Find node with highest anomaly count, then look at nodeID of packet, anomalies.packet.nodeID
  const firstAnomaly = anomalies?.[0];
  const nodeID = firstAnomaly?.packet?.nodeID || "N/A";
  const nodesWithAnomalies = new Set(anomalies?.map(a => a.packet?.nodeID)).size;

  const totalPackets = data?.reduce((sum, device) => sum + (device.packets_count || 0), 0) || 0;
  const anomalyRate = totalPackets > 0 ? ((totalAnomaly / totalPackets) * 100).toFixed(1) : 0;

  return (
    <div id="deviceStats">
      <Card title="Devices">
          <Box sx={{display: 'flex', gap: 2}}>
            <DevicesIcon sx={{ fontSize: 40}}/>
            <Typography variant="h5">Online: {onlineDevices}</Typography>
            <Typography variant="body2">Offline: {offlineDevices}</Typography>
          </Box>
      </Card>
      <Card title="Total Anomalies">
          <Box>
            <ErrorIcon sx={{ fontSize: 40}}/>
            <Typography variant="h5">{totalAnomaly}</Typography>
            <Typography variant="body2">{anomalyRate}% of packets</Typography>
          </Box>
      </Card>
      <Card title="Affected Nodes">
        <Box>
          <Typography>{nodesWithAnomalies}</Typography>
          <Typography>Most attacked: Node {nodeID}</Typography>
        </Box>
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
      <DeviceStatistics data={data.devices} anomalies={data.anomalies}/>
      <Map2 />
      <AddDevice />
      <Graph data={data}/>
      <DeviceList data={data.devices} />
    </div>
  );
};

const Devices = () => {
  const [data, setData] = useState({
    devices: [],
    anomalies: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user] = await Promise.all([
          axios.get("http://127.0.0.1:8000/lorawan/users/1/"),
        ])
        setData({
          devices: user.data.nodes || [],
          anomalies: user.data.anomalies || [],
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
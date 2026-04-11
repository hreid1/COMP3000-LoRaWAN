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
import api from '../../utils/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Graph = ({ data }) => {
  const packetData = data && data.length > 0
    ? data
        .map(node => ({
          name: node.node_id,
          packets: node.packets_count
        }))
        .sort((a, b) => b.packets - a.packets)
        .slice(0, 10)
    : []

  return (
    <Card id="graphDevices" title="Packets per Node">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={packetData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            label={{ value: 'Node ID', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis label={{ value: 'Packet Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 4px 0' }}><strong>Node: {data.name}</strong></p>
                    <p style={{ margin: 0 }}>Packets: {data.packets}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="packets" fill="#1976d2" name="Packet Count" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )

}

const AddDevice = () => {
  const [device, setDevice] = useState({
    nodeId: "",
    mac: "",
    location: "",
    isActive: true, 
  })
  const [submit, setSubmit] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addDevice = (e) => {
    e.preventDefault()
    setSubmit(true)

    try {
      api.post("/nodes/", {
        node_id: parseInt(device.nodeId, 10),
        is_active: device.isActive
      })
      setDevice({
        nodeId: "",
        mac: "",
        location: "",
        isActive: true,
      })

    } catch(err){
      console.error(err)
    } finally {
      setSubmit(false)
    }
  }

  return (
    <Card id="addDevice" title="Add Device Form">
      <Box component="form" onSubmit={addDevice} sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: "red" }}>
        <TextField
          label="Node ID"
          name="nodeId"
          type="number"
          value={device.nodeId}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
        />
        <TextField
          label="MAC"
          name="mac"
          type="text"
          value={device.mac}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Location"
          name="location"
          type="text"
          value={device.location}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isActive" 
              checked={device.isActive}
              onChange={handleChange}
            />
          }
          label="Is Active"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
          Add Device
        </Button>
        {submit ? "Adding Device" : "Add Device"}
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
          <Typography>Number of nodes with anomalies: {nodesWithAnomalies}</Typography>
          <Typography>Most attacked: Node {nodeID}</Typography>
        </Box>
      </Card>
    </div>
  )
}

const DeviceList = ({data}) => {
  const [sortBy, setSortBy] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("")

  return (
    <Card title="Devices" id="deviceContainer">
      <Box sx={{display: 'flex', gap: 2}}>
        <TextField
          label="Search Node ID/MAC"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1}}
        />
        <TextField
          select
          label="Status"
          size="small"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ flexGrow: 1}}
        >
          <MenuItem value="online">Online</MenuItem>
          <MenuItem value="offline">Offline</MenuItem>
        </TextField>
        <TextField
          select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="small"
          sx={{ minWidth: 120}}
        >
          <MenuItem value="id">Node ID</MenuItem>
          <MenuItem value="date">Date Added</MenuItem>
          <MenuItem value="packets">Packet Count</MenuItem>


        </TextField>
        
      </Box>
      <div className="deviceGrid">
        {data && data.length > 0 ? (
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
          ))
        ) : (
          <p>No devices found</p>
        )}
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
      <Graph data={data.devices}/>
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
          api.get("/users/me/")
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
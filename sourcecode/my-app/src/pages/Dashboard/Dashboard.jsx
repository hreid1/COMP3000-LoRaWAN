import React, { useContext } from 'react'
import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import './Dashboard.css'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js/auto'
import Card from '../../components/Card/Card'
import DeviceCard from '../../components/Card/DeviceCard'
import AlertMessage from '../../components/Alert/AlertMessage'
import api from '../../utils/api'
import AuthContext from '../../../context/AuthContext'

import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import DevicesIcon from '@mui/icons-material/Devices';
import ErrorIcon from "@mui/icons-material/Error"
import SensorsIcon from '@mui/icons-material/Sensors';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import { 
  Container, 
  Grid, 
  Button, 
  Box, 
  CircularProgress,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  TextField,
  MenuItem,
  Stack,
  Card as MuiCard,
  CardContent,
} from '@mui/material'
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AnomalyTimeline = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Grouping by date 
    const grouped = data.reduce((acc, anomaly) => {
      const date = new Date(anomaly.detected_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Sort dates and format for chart
    return Object.entries(grouped)
      .map(([date, count]) => ({
        date,
        count,
        timestamp: new Date(date).getTime()
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  return (
    <Card title="Anomalies Over Time" id="anomalyTimeline">
      <Box sx={{ width: '100%', height: 350, mt: 2 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d32f2f" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#d32f2f" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              allowDecimals={false}
              label={{ value: 'Total Anomalies', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#d32f2f" 
              fillOpacity={1} 
              fill="url(#colorCount)" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
              name="Anomalies"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  )
}

const RecentActivity = ({data}) => {
  const [sortBy, setSortBy] = useState("")

  return(
    <Card title="Recent Activity" id="recentActivity">
      <Box sx={{paddingBottom: 1}}>
        <TextField 
          select
          fullWidth
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          size="small"
        >
          <MenuItem value="anomaly">Anomalies</MenuItem>
          <MenuItem value="system">System</MenuItem>
        </TextField>
      </Box>
      <div id="recentActContainer">
        {data.map(alert => (
          <div key={alert.id} style={{padding: 2, margin: 8, gap: 2}}>
            <Alert severity={alert.severity} sx={{display: 'flex'}}
              action={
                <Button size='small' color='inherit'> 
                  View
                </Button>
              }
            >
              <AlertTitle>{alert.title} at {new Date(alert.created_at).toLocaleDateString()}</AlertTitle>
              {alert.message}
            </Alert>
          </div>
        ))}
      </div>
    </Card>
  )
}

const NetworkOverview = ({ devices, stats, anomalies }) => {
  const totalDevices = devices.length
  const totalAnomalies = anomalies.length

  const averageRSSI = stats && stats.length > 0
    ? (stats.reduce((sum, packet) => sum + packet.rssi, 0) / stats.length).toFixed(2)
    : 'N/A'

  const averageSNR = stats && stats.length > 0
    ? (stats.reduce((sum, packet) => sum + packet.snr, 0) / stats.length).toFixed(2)
    : 'N/A'

  let trafficStatus = ''
  let trafficColour = ''

  if (totalAnomalies > 100) {
    trafficStatus = 'Unhealthy'
    trafficColour = '#d32f2f'
  } else if (totalAnomalies > 50) {
    trafficStatus = 'Moderate'
    trafficColour = '#ed6c02'
  } else {
    trafficStatus = 'Healthy'
    trafficColour = '#2e7d32'
  }

  const StatItem = ({ value, icon, color, label }) => (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ height: '100%' }}>
      <Box sx={{ 
        backgroundColor: `${color}15`, 
        borderRadius: '50%', 
        p: 1.5, 
        display: 'flex', 
        color: color 
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
          {label}
        </Typography>
      </Box>
    </Stack>
  )

  return (
    <Box id="networkOverview" sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', width: '100%'}}>
      <Card title="Total Devices">
        <StatItem 
          value={totalDevices} 
          label="Connected Nodes"
          icon={<DevicesIcon />} 
          color="#1976d2" 
        />
      </Card>
      <Card title="Active Anomalies">
        <StatItem 
          value={totalAnomalies} 
          label="Last 24 Hours"
          icon={<ErrorIcon />} 
          color="#d32f2f" 
        />
      </Card>
      <Card title="Traffic Status">
        <StatItem 
          value={trafficStatus} 
          label="Network Health"
          icon={<AssessmentIcon />} 
          color={trafficColour} 
        />
      </Card>
      <Card title="Avg RSSI">
        <StatItem 
          value={`${averageRSSI} dBm`} 
          label="Signal Strength"
          icon={<SpeedIcon />} 
          color="#0288d1" 
        />
      </Card>
    </Box>
  )
}

const Announcements = ({data}) => {
  // Filter system announcements from data

  return(
    <Card id="announcements" title="Announcements">
    </Card>
  )
}

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
    <Card id="graph" title="Packets per Node">
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

const Graph2 = ({ data }) => {
  const trendData = data && data.length > 0
    ? data.map((packet, idx) => ({
        index: idx + 1,
        rssi: packet.rssi,
        spreading_factor: packet.spreading_factor,
      }))
    : []

  return (
    <Card id="graph2" title={`Signal Quality Trend (${trendData.length} Packets)`}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="index"
            label={{ value: 'Packet Index', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis yAxisId="left" label={{ value: 'RSSI (dBm)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Spreading Factor', angle: 90, position: 'insideRight' }} />
          <Tooltip formatter={(value) => value.toFixed(2)} />
          <Legend />
          <Line type="monotone" dataKey="rssi" stroke="#ff7300" name="RSSI" yAxisId="left" />
          <Line type="monotone" dataKey="spreading_factor" stroke="#1976d2" name="Spreading Factor" yAxisId="right" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

const MainDashContent = ({data, loading, error, onAlert}) => {
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
    <div className='dashContentContainer'>
        <NetworkOverview devices={data.devices} stats={data.packets} anomalies={data.anomalies} />
        <Graph data={data.devices}/>
        <Graph2 data={data.packets}/>
        <RecentActivity data={data.announcements}/>
        <Announcements data={data.announcements}/>
        <AnomalyTimeline data={data.anomalies}/>
    </div>
  )
}

const Dashboard = () => {
  //const { user } = useContext(AuthContext)
  const [data, setData] = useState({
    devices: [],
    anomalies: [],
    announcements: [],
    packets: [],
    loading: true,
    error: null,
  })
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('info')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, packet] = await Promise.all([
          api.get("/users/me/"),
          api.get("/packets/?page_size=1000")
        ]) 
        setData({
          devices: user.data.nodes || [],
          anomalies: user.data.anomalies || [],
          announcements: user.data.alerts || [],
          packets: packet.data.results || [],
          loading: false,
          error: null
        })

     } catch (err){
      setData(prev => ({ ...prev, loading: false, error: err.message}))
     }
    }
    fetchData()
  }, []);

  const handleAlert = async (alertData) => {
    setAlertMessage(alertData.message)
    setAlertSeverity(alertData.severity)
    setAlertOpen(true)

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/lorawan/alerts/",
        {
          title: alertData.title,
          message: alertData.message,
          alert_type: alertData.alertType || 'anomaly',
          severity: alertData.severity
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      console.log("Alert saved to DB:", response.data)
    } catch (error) {
      console.error("Error saving alert to DB:", error.response?.data || error.message)
    }
  }

  return (
    <>
      <MainDashContent 
        data={data} 
        onAlert={handleAlert}
        loading={data.loading} 
        error={data.error}
      />
      <AlertMessage 
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}

export default Dashboard
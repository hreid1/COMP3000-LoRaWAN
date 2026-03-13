import React from 'react'
import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import './Dashboard.css'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js/auto'
import Card from '../../components/Card/Card'
import DeviceCard from '../../components/Card/DeviceCard'
import Modal from '../../components/Modal/Modal'
import Step1 from '../../components/Charts/Graph'
import AlertMessage from '../../components/Alert/Alert'
import { 
  Container, 
  Grid, 
  Button, 
  Box, 
  CircularProgress,
  Typography,
  Paper,
  Alert
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AnomalyTimeline = () => {
  return(
    <Card title="Anomaly Timeline" id="anomalyTimeline">

    </Card>
  )
}

const RecentActivity = () => {
  return(
    <Card title="Recent Activity" id="recentActivity">

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

  if (totalAnomalies > 10) {
    trafficStatus = 'Unhealthy'
    trafficColour = 'red'
  } else if (totalAnomalies > 5) {
    trafficStatus = 'Moderate'
    trafficColour = 'orange'
  } else {
    trafficStatus = 'Healthy'
    trafficColour = 'green'
  } 

  return(
    <div id="networkOverview">
      <Card title="Total Devices">
        <span>Total number of devices: {totalDevices}</span>
        <p></p>
        <span>Display total of offline/online devices</span>
      </Card>
      <Card title="Active Anomalies">
        <span>Total number of Anomalies: {totalAnomalies}</span>
        <p></p>
        <span>Should give over timeframe</span>
      </Card>
      <Card title="Average RSSI">
        <span>{averageRSSI}</span>
      </Card>
      <Card title="Average SNR">
        <span>{averageSNR}</span>
      </Card>
      <Card title="Traffic Score">
        <span style={{ color: trafficColour, fontWeight: 'bold'}}>
          {trafficStatus}
        </span>
      </Card>
    </div>
  )
}

const Announcements = ({data}) => {

  return(
    <Card id="announcements" title="Announcements">
      {data && data.map(alert => (
        <div key={alert.id} style={{}}>
          <span>{alert.message}</span>
          <button>Viewed</button>
        </div>
      ))}
    </Card>
  )
}

const Graph = ({ data }) => {
  const chartData = data && data.length > 0
    ? data
        .sort((a, b) => new Date(a.time) - new Date(b.time))
        .map(packet => ({
          time: new Date(packet.time).toLocaleTimeString(),
          snr: parseFloat(packet.snr),
        }))
    : []

  return (
    <Card id="graph" title="SNR over Time">
      {chartData.length > 0 ? (
        <LineChart
          width={700}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            angle={-45}
            textAnchor="end"
            height={80}
            label={{ value: 'Time', position: 'insideBottomRight', offset: -10}}
          />
          <YAxis 
            label={{ value: 'SNR (dB)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => value.toFixed(2)}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="snr"
            stroke="#0097a7"
            dot={false}
            strokeWidth={2}
            name="SNR (dB)"
            isAnimationActive={true}
          />
        </LineChart>
      ) : (
        <p>No data available</p>
      )}
    </Card>
  )
}

const Graph2 = ({data}) => {
  const chartData = data && data.length > 0
    ? data
      .sort((a, b) => new Date(a.time) - new Date(b.time))
      .map(packet => ({
        time: new Date(packet.time).toLocaleDateString(),
        rssi: parseFloat(packet.rssi)
      }))
    : []

  return(
        <Card id="graph" title="RSSI over Time">
      {chartData.length > 0 ? (
        <LineChart
          width={700}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            angle={-45}
            textAnchor="end"
            height={80}
            label={{ value: 'Time', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis 
            label={{ value: 'RSSI (dB)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value) => value.toFixed(2)}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="rssi"
            stroke="#0097a7"
            dot={false}
            strokeWidth={2}
            name="RSSI (dB)"
            isAnimationActive={true}
          />
        </LineChart>
      ) : (
        <p>No data available</p>
      )}
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
      <div className="top">
        <NetworkOverview devices={data.devices} stats={data.packets} anomalies={data.anomalies} />
      </div>
      <div className="middle">
        <Graph data={data.packets}/>
        <Graph2 data={data.packets}/>
      </div>
      <div className="bottom">
        <RecentActivity />
        <Announcements data={data.announcements}/>
        <AnomalyTimeline />
      </div>
    </div>
  )
}

const Dashboard = () => {
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

  // GET request to backend for user 1
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, anomalies, packets] = await Promise.all([
          axios.get("http://127.0.0.1:8000/lorawan/users/1/"),
          axios.get("http://127.0.0.1:8000/lorawan/anomaly/"),
          axios.get("http://127.0.0.1:8000/lorawan/packets/")
        ])
        setData({
          devices: user.data.nodes || [],
          anomalies: anomalies.data.results || [],
          announcements: user.data.alerts || [],
          packets: packets.data.results || [],
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
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ScatterChart, Scatter } from 'recharts';

const AnomalyTimeline = ({ data }) => {
  const chartData = data && data.length > 0
    ? data
      .reduce((acc, anomaly) => {
        const date = new Date(anomaly.detected_at)
        const dateString = date.toLocaleDateString()
        const hour = date.getHours()
        const timeLabel = `${dateString} ${hour}:00`
        
        const existing = acc.find(item => item.timeLabel === timeLabel)
        if (existing) {
          existing.count += 1
        } else {
          acc.push({ 
            timeLabel, 
            count: 1,
            date: dateString,
            hour: hour
          })
        }
        return acc
      }, [])
    : []

  return (
    <Card title="Anomalies Over Time" id="anomalyTimeline">
      <LineChart width={'95%'} height={300} data={chartData} style={{alignItems: "center", padding: "1rem"}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="timeLabel" 
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis />
        <Tooltip 
          content={({ payload }) => {
            if (payload && payload.length) {
              const data = payload[0].payload
              return (
                <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
                  <p style={{ margin: '0 0 4px 0' }}><strong>Date: {data.date}</strong></p>
                  <p style={{ margin: '0 0 4px 0' }}>Hour: {data.hour}:00</p>
                  <p style={{ margin: 0 }}>Count: {data.count}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#d32f2f" 
          name="Anomaly Count"
          dot={{ fill: '#d32f2f', r: 5 }}
          strokeWidth={2}
        />
      </LineChart>
    </Card>
  )
}

const RecentActivity = () => {
  const activityData = [
    {
      id: 1,
      type: "device_added",
      message: "Node ID 1005 has been added",
      user: "Admin",
      severity: "low",
      created_at: "17:35 14/03/2026",
    },
    {
      id: 2,
      type: "anomaly_detected",
      message: "An Anomaly has been detected at node 42 by Model: Isolation Forest",
      severity: "high",
      created_at: "17:55 14/03/2026",
    },
    {
      id: 3,
      type: "model_ran",
      message: "The isolation forest model was ran on dataset jammer.csv",
      severity: "normal",
      created_at: "17:56 14/03/2026",
    },
    {
      id: 4,
      type: "device_offline",
      message: "Node 42 is offline",
      severity: "medium",
      created_at: "17:57 14/03/2026",
    },
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#d32f2f'      
      case 'medium': return '#f57c00'    
      case 'low': return '#fbc02d'       
      case 'resolved': return '#388e3c'  
      default: return '#1976d2'         
    }
  }

  return(
    <Card title="Recent Activity" id="recentActivity">
      {activityData.map(activity => (
        <div key={activity.id} style={{border: `2px solid ${getSeverityColor(activity.severity)}`, padding: "8px", margin: "2px"}}>
          <div>
            <span>{activity.message}</span>
          </div>
        </div>
      ))}
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
  const alerts = [
    {
      id: 1,
      title: "System Maintenance",
      message: "Scheduled Maintenance on March 15th, 2026 from 12-1AM",
      date: "15/03/2026",
      priority: "high",
    },
    {
      id: 2,
      title: "New version of Isolation Forest has been deployed",
      message: "Use this model now",
      date: "16/03/2026",
      priority: "normal",
    },
    {
      id: 3,
      title: "Network Expansion",
      message: "5 new gateway nodes have been added for extra network coverage",
      date: "16/03/2026",
      priority: "normal",
    },
  ]

  const getPriority = (priority) => {
    switch(priority){
      case 'high': return '#27F542'
      case 'normal': return '#F527F5'
    }

  }
 
  return(
    <Card id="announcements" title="Announcements">
      {alerts.map(alert => (
        <div key={alert.id} style={{padding: "1rem", margin: "2px", border: `2px solid ${getPriority(alert.priority)}`}}>
          <div>
            <span>Title: {alert.title}</span>
          </div>
          <div>
            <span>Message: {alert.message}</span>
          </div>
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
        <Card id="graph2" title="RSSI over Time">
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
        <NetworkOverview devices={data.devices} stats={data.packets} anomalies={data.anomalies} />
        <Graph data={data.packets}/>
        <Graph2 data={data.packets}/>
        <RecentActivity data={data.anomalies}/>
        <Announcements data={data.announcements}/>
        <AnomalyTimeline data={data.anomalies}/>
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
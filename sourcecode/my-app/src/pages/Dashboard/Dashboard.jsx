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

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress';

const AnomalyTimeline = () => {
  const [anomalies, setAnomalies] = useState([])
  
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/anomaly/")
      .then(response => setAnomalies(response.data.results || []))
      .catch(err => console.error("Error fetching anomalies:", err))
  }, [])
  
  return(
    <Card title="Anomaly Timeline">
      {anomalies.length === 0 ? (
        <p>No anomalies detected</p>
      ) : (
        anomalies.map(anomaly => (
          <div key={anomaly.id} style={{padding: '8px 0', borderBottom: '1px solid #eee'}}>
            <span>Packet {anomaly.packet_id}: {anomaly.model_name}</span>
          </div>
        ))
      )}
    </Card>
  )
}

const RecentActivity = () => {
  return(
    <Card title="Recent Activity">
    </Card>
  )
}

const NetworkOverview = () => {


  return(
    <div id="networkOverview">
      <Card title="Total Devices">
      </Card>
      <Card title="Active Anomalies">
      </Card>
      <Card title="Average RSSI">
      </Card>
      <Card title="Average PDR">
      </Card>
    </div>
  )
}



const DeviceList = ({devices}) => {
  const devices20 = devices.splice(1, 20)
  console.log(devices20)
  return (
    <Card id="deviceList" title="Device List">
      {devices20.map(device => (
        <div key={device.id}>
          <span>Device: {device.id}</span>
        </div>
      ))}
    </Card>
  );
}

const AnomalyList = ({ anomalies }) => {
  return(
    <Card id="anomalyList" title="Anomaly List">
      {anomalies.map(packet => (
        <div key={packet.id}>
          <span>Packet ID: {packet.packet_id} was flagged to be anomalous by Model: {packet.model_name}</span>
        </div>
      ))}
    </Card>
  )
}

const Announcements = () => {
  const [data , setData] = useState([])

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/users/1/").then((response) => {
      setData(response.data.alerts);
    });
  }, []);

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

const TrafficScore = () => {
  // If number of anomalies > 100 -> Bad -> Show red colour
  // 100 > If number of anomalies > 55 -> Moderate -> Show orange colour
  // 55 > Num of anomalies -> Good -> Show green colour
  // jammer.csv -> 33537 anomalies
  // no-jammer.csv

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/anomaly/")
    .then((response) => {
      setData(response.data || []);
    });
  }, []);

  if (data.count < 2) {
    return (
      <Card id="trafficScore" title="Traffic Score">
        <p>Number of anomalies detected: {data.count}</p>
        <p style={{ color: "green" }}>Healthy Traffic Score</p>
      </Card>
    );
  } else if (data.count >= 2 && data.count < 4) {
    return (
      <Card id="trafficScore" title="Traffic Score">
        <p>Number of anomalies detected: {data.count}</p>
        <p style={{ color: "orange" }}>Moderate Traffic Score</p>
      </Card>
    );
  } else {
    return (
      <Card id="trafficScore" title="Traffic Score">
        <p>Number of anomalies detected: {data.count}</p>
        <p style={{ color: "red" }}>Unhealthy Traffic Score</p>
      </Card>
    );
  }
}

const Graph = () => {
  return(
    <Card id="graph" title="Graph">
      <Step1 />
    </Card>
  )
}

const MainDashContent = ({data, onAlert}) => {

  return (
    <div className='dashContentContainer'>
      <NetworkOverview />
      <div id="graph1">
        <Card title="Network Traffic">  
          <Step1 />
        </Card>
      </div>
      <div id="graph2">
        <Card title="Anomaly Trends">
          <Step1 />
        </Card>
      </div>
      <div id="graph3">
        <Card title="Device Status">
          <Step1 />
        </Card>
      </div>
      <div id="recentActivity">
        <RecentActivity />
      </div>
      <div id="announcements">
        <Announcements />
      </div>
      <div id="anomalyTimeline">
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
    trafficScore: null,
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
        const [user, anomalies] = await Promise.all([
          axios.get("http://127.0.0.1:8000/lorawan/users/1/"),
          axios.get("http://127.0.0.1:8000/lorawan/anomaly/")
        ])
        setData({
          devices: user.data.nodes || [],
          anomalies: anomalies.data.results || [],
          announcements: user.data.alerts || [],
          trafficScore: anomalies.data.count,
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
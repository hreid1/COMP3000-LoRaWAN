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

const NetworkTraffic = ({ onAlert }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState("IsolationForest"); 
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false)

  function handleFileRun(event){
    if (!file) {
      console.error("No File")
      return;
    }
    
    setLoading(true)
    const formData = new FormData()
    formData.append("myFile", file, file.name)
    formData.append("model", selectedModel) 

    axios.post("http://localhost:8000/lorawan/run/", formData)
    .then (response => {
      console.log(response.data.performance)
      setResults(response.data.performance)

      const anomalyCount = response.data.performance?.anomaly_count || 0;

      if (anomalyCount > 0){
        onAlert({
          title: `Anomaly Detection Alert`,
          message: `${anomalyCount} anomalies detected in network traffic!`,
          severity: `warning`,
          alertType: 'anomaly'
        });
      } else {
        onAlert({
          title: `Analysis Complete`,
          message: `No anomalies detected`,
          severity: `success`,
          alertType: 'system'
        })
      }
      setLoading(false)
    })
    .catch(err => {
      console.error("Error running Model:", err)
      onAlert({
        title: `Error`,
        message: `Failed to run model`,
        severity: `error`,
        alertType: 'system'
      })
      setLoading(false)
    })
  }


  function handleAddToDB(){
    if (!file){
      setError("No file selected")
      return;
    }

    const formData = new FormData();
    formData.append("myFile", file, file.name)

    axios.post("http://localhost:8000/lorawan/addmodel/", formData)
    .then(response => {
      console.log("File added to DB")
      setFile(null);
      setData([]);
    })
    .catch(err => {
      console.error("Database upload failed")
    })
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  }

  function handleFileDisplay() {
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true});
      const parsedData = csv?.data;
      const rows = Object.keys(parsedData[0]);
      const columns = Object.values(parsedData[0]);
      const res = rows.reduce((acc, e, i) => {
        return [...acc, [[e], columns[i]]];
      }, []);
      //console.log(res)
      setData(res)
    };
    reader.readAsText(file);
  }

  return(
    <Card id="networkTraffic" title="Network Traffic">
      <div className="btn-column">
        <input type="file" onChange={handleFileChange}/>
        
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="IsolationForest">Isolation Forest</option>
          <option value="LocalOutlierFactor">Local Outlier Factor</option>
        </select>
        
        <button onClick={handleFileDisplay}>Display File</button>
        <button onClick={handleFileRun} disabled={loading}>{loading ? 'Running...' : 'Run File'}</button>
        <button onClick={handleAddToDB}>Add to DB</button>
      </div>
      <div>
        {error 
          ? error
          : data.map((e, i) => (
            <div key={i} className='item'>
              {e[0]}:{e[1]}
            </div>
          ))
        }
      </div>
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
      <DeviceList devices={data.devices}/>
      <AnomalyList anomalies={data.anomalies}/>
      <Announcements announcements={data.announcements}/> 
      <NetworkTraffic onAlert={onAlert} />
      <TrafficScore />
      <Graph />
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
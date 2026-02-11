import React from 'react'
import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import './Dashboard.css'
import SideNavbar from '../../components/Navbar/SideNavbar'
import Navbar from '../../components/Navbar/Navbar'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js/auto'
import { Data } from '../../utils/Data'
import { BarChart } from '../../components/Charts/Graph'
import Card from '../../components/Card/Card'
import Modal from '../../components/Modal/Modal'

Chart.register(CategoryScale);

const DeviceList = ({data}) => {
  
  const displayedData = data && data.slice(0, 20);

  return(
    <Card id="deviceList" title="Device List">
      {displayedData && displayedData.map(node => (
        <div key={node.id} className="deviceItem">
          <strong className="deviceTitle">Node {node.node_id}</strong>
          <p className="deviceInfo">Owner: {node.owner}</p>
          <p className="deviceInfo">Active: {String(node.is_active)}</p>
          <p className="deviceInfo">Created: {new Date(node.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </Card>
  )
}

const AnomalyList = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/anomaly/")
    .then((response) => {
      setData(response.data.results)
    })
  }, [])

  return(
    <Card id="anomalyList" title="Anomaly List">
      {data && data.map(packet => (
        <div key={packet.id}>
          <span>Packet ID: {packet.packet_id} was flagged to be anomalous by Model: {packet.model_name}</span>
        </div>
      ))}
    </Card>
  )
}

const Announcements = () => {

  return(
    <Card id="announcements" title="Announcements">
    </Card>
  )
}

const NetworkTraffic = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState("IsolationForest"); 
  const [results, setResults] = useState([]);

  function handleFileRun(event){
    if (!file) {
      console.error("No File")
      return;
    }
    const formData = new FormData()
    formData.append("myFile", file, file.name)
    formData.append("model", selectedModel) 
    axios.post("http://localhost:8000/lorawan/run/", formData)
    .then (response => {
      console.log(response.data.performance)
      setResults(response.data.performance)
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
        <button onClick={handleFileRun}>Run File</button>
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

    </Card>
  )
}

const MainDashContent = ({data}) => {

  return (
    <div className='dashContentContainer'>
      <DeviceList data={data.nodes || []}/>
      <AnomalyList data={data.nodes || []}/>
      <Announcements /> 
      <NetworkTraffic />
      <TrafficScore />
      <Graph />
    </div>
  )
}

const Dashboard = () => {
  const [data, setData] = useState([])

  // GET request to backend for user 1
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/users/1/")
    .then(response => {
      //console.log(response.data)
      setData(response.data || []);
    })
  }, []);

  const username = data.username
  const email = data.email
  const profileimage = data?.userprofile?.profile_image;

  return (
    <div id="dashContainer">
      <Navbar name={username} data={data.userprofile}/>
      <SideNavbar />
      <MainDashContent data={data}/>
    </div>
  );
}

export default Dashboard
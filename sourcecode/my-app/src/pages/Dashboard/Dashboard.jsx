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

Chart.register(CategoryScale);

const DeviceList = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/nodes/")
      .then(response => {
        console.log("Device object:", response.data.results[0]); 
        setData(response.data.results || []);
      })
      .catch(err => {
        console.error("Error:", err);
        setError(err);
      });
  }, []);

  return(
    <Card id="deviceList" title="Device List">
      {error && <div>Error: {error.message}</div>}
      {data && data.map(device => (
        <div key={device.id}>{device.node_id}, {device.owner}, {device.is_active}, {device.created_at}</div>
      ))}
    </Card>
  )
}

const AnomalyList = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/anomaly/")
      .then(response => {
        console.log(response.data.results)
        setData(response.data.results || []);
      })
  }, []);

  return(
    <Card id="anomalyList" title="Anomaly List">
      {data && data.map(anomaly => (
        <div key={anomaly.id}>{anomaly.id}, {anomaly.detected_at}, {anomaly.model}, {anomaly.packet_id}</div>
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

  function handleFileUpload(event){
    if (!file) {
      console.error("No File")
      return;
    }
    const formData = new FormData()
    formData.append("myFile", file, file.name)
    axios.post("http://localhost:8000/lorawan/run/", formData)
    .then (response => {
      console.log(response)
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
      console.log(res)
      setData(res)
    };
    reader.readAsText(file);
  }

  return(
    <Card id="networkTraffic" title="Network Traffic">
      <div className="btn-column">
        <input type="file" onChange={handleFileChange}/>
        <button onClick={handleFileDisplay}>Display File</button>
        <button onClick={handleFileUpload}>Run File</button>
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
  return (
    <Card id="trafficScore" title="Traffic Score">

    </Card>
  )

}

const Graph = () => {
  return(
    <Card id="graph" title="Graph">
    </Card>
  )
}

const MainDashContent = (props) => {

  return (
    <div className='dashContentContainer'>
      <DeviceList />
      <AnomalyList />
      <Announcements /> 
      <NetworkTraffic />
      <TrafficScore />
      <Graph />
    </div>
  )
}


const Dashboard = () => {
  return (
    <div id="dashContainer">
      <Navbar />
      <SideNavbar />
      <MainDashContent />
    </div>
  );
}

export default Dashboard
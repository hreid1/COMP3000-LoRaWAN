import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './Dashboard.css'
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'
import Dots from '../../assets/dots.svg'

const DeviceList = () => {
  return(
    <div id="deviceList" className="dashCard">
      <div className='marker'></div>
      <div className="cardHeader">
        <span className="cardTitle">Device List</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        <span>Devices online: </span>
        <span>Devices offline: </span>
      </div>
    </div>
  )
}

const AnomalyList = () => {
  return(
    <div id="anomalyList" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Anomaly List</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        <span>Jammer Attack: 1</span>
      </div>
    </div>
  )
}

const Announcements = () => {
  return(
    <div id="announcements" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Recent Alerts</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        <span>Error found at nodeID</span>
      </div>
    </div>
  )
}

const NetworkTraffic = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [data2, setData2] = useState(false)
  const allowedExtensions = ["csv"];

  const handleFileChange = (e) => {
    setError("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileName = inputFile.name;
      const fileExtension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      setFile(inputFile);
    }
  };

  const handleParse = () => {
    if (!file) return alert("Enter a valid file");
    const reader = new FileReader();
    reader.onload = async({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
        skipEmptyLines: true,
      });
      setData(csv.data)
    };
    reader.readAsText(file);
  }

  const model = async () => {
    setLoading(true);
    setError("");
    if (!file) {
      setError("Please select a CSV file first.");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/run/", // Update to your actual endpoint
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setData2(response.data);
    } catch (error) {
      setError("Error loading model");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="networkTraffic" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Dataset</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>

      <div className="cardContent">
        <div className="btnContainer">
          <input
            onChange={handleFileChange}
            id="csvInput"
            name="file"
            type="file" />
          <button onClick={handleParse}>Parse</button>
          <button onClick={model} disabled={loading}>
            {loading ? "Running Analysis" : "Run Isolation Forest"}
          </button>
        </div>
        <div style={{ marginTop: "1rem" }}>
          {error
            ? error
            : data.length > 0 && (
                <table className="networkTable">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.keys(row).map((key) => (
                          <td key={key + rowIndex}>{row[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
        </div>
        {data2 && (
          <div id="results">
            <h3>Results:</h3>
            {data2.accuracy}
          </div>
        )}
      </div>
    </div>
  );
}

const TrafficScore = () => {
  return(
    <div id="trafficScore" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Traffic Score</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        <span>Good</span>
      </div>
    </div>
  )
}

const Graph = () => {

  return (
    <div id="graph" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Graph</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
      </div>
    </div>
  );
}

const AnomalyGraph = () => {
  return(
    <div id="anomalyGraph" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Anomaly Graph</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        <span>Another graph goes here</span>
      </div>
    </div>
  )
}

const OtherGraph = () => {
  return(
    <div id="otherGraph" className="dashCard">
      <div>
        <span>Final graph</span>
      </div>
    </div>
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
      <AnomalyGraph />
    </div>
  )
}


const Dashboard = () => {
  return(
    <div id='dashContainer'>
        <TopNavbar />
        <SideNavbar />
        <MainDashContent />
    </div>
  )
}

export default Dashboard
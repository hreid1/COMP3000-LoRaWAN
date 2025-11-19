import React from 'react'
import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './Dashboard.css'
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'
import Dots from '../../assets/Dots.svg'

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
  const allowedExtensions = ["csv"];

  const handleFileChange = (e) => {
    setError("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (
        !allowedExtensions.includes(fileExtension)
      ){
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
      });
      const parsedData = csv?.data;
      const rows = Object.keys(parsedData[0]);
      const columns = Object.values(parsedData[0]);
      const res = rows.reduce((acc, e, i) => {
        return [...acc, [[e], columns[i]]];
      }, []);
      console.log(res);
      setData(res);
    };
    reader.readAsText(file);
  }

  return(
    <div id="networkTraffic" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Dataset</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>

      <div className="cardContent">
        <input onChange={handleFileChange} id="csvInput" name='file' type='file' />
        <div>
          <button onClick={handleParse}>
            Parse
          </button>
        </div>
        <div style = {{ marginTop: "3rem "}}>
          {error
            ? error
            : data.map((e, i) => (
              <div key={i} className="item">
                {e[0]}:{e[1]}
              </div>
          ))}
        </div>
      </div>
    </div>
  )
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
  return(
    <div id="graph" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Graph</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        <span>Graph goes here</span>
      </div>
    </div>
  )
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
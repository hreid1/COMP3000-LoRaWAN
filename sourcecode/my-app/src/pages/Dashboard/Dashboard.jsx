import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './Dashboard.css'
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'
import Dots from '../../assets/dots.svg'
import useNetworkTraffic from '../../hooks/useNetworkTraffic'

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
  const {
    data,
    error,
    loading,
    data2,
    handleFileChange,
    handleParse,
    model,
  } = useNetworkTraffic();

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
            type="file"
          />
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
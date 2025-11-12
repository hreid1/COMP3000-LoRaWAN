import React from 'react'
import './Dashboard.css'
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'

const DeviceList = () => {
  return (
    <div className="dashboardItem" id="deviceList">
      <span>Device List</span>
      <div>
        <ul>
          <li>Devices Online: </li>
          <li>Devices Offline: </li>
        </ul>
      </div>
    </div>
  )
}

const Map = () => {
  return (
    <div className="dashboardItem" id="map">
      <span>Map</span>
      <ul>
        <li>This is where chart.js goes</li>
      </ul>
    </div>
  )
}

const AIinfo = () => {
  return (
    <div className="dashboardItem" id="aiInfo">
      <span>AI-Information</span>
      <ul>
        <li>Model being used</li>
        <li>Packets searched through</li>
      </ul>
    </div>
  )
}

const Statistics = () => {
  return (
    <div className="dashboardItem" id="statistics">
      <span>Statistics</span>
      <ul>
        <li>Packets searched through, past hour, day, week, month</li>
        <li>Threats detected past hour, day, week, month</li>
      </ul>
    </div>
  )
}

const ThreatsDetected = () => {
  return (
    <div className="dashboardItem" id="threatsDetected">
      <span>Threats Detcted</span>
      <ul>
        <li>Details about anomalies: e.g. which device affected, location of device, types of threats</li>
      </ul>
    </div>
  )
}

const LiveNetworkTraffic = ({dataset}) => {
  return (
    <div className="dashboardItem" id="liveNetworkTraffic">
      <span>Live Network Traffic</span>
      <ul>
        <li>Table going through live traffic</li>
      </ul>
    </div>
  )
}

const Announcements = () => {
  return(
    <div className="dashboardItem" id="announcements">
      <span>Announcements</span>
      <ul>
        <li>Maybe convert to summary e.g. total number of threats from today</li>
        <li></li>
      </ul>
    </div>
  )
}

const MainDashContent = (props) => {
  return (
    <div className="navMenu" id="dashContentContainer">
      <Statistics />
      <ThreatsDetected />
      <LiveNetworkTraffic />
      <Announcements />
      <AIinfo />
      <Map />
      <DeviceList />
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
import React from 'react'
import './Dashboard.css'
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'

const DeviceList = () => {
  return (
    <div className="dashboardItem" id="deviceList">
      <h1>Device List</h1>
    </div>
  )
}

const Map = () => {
  return (
    <div className="dashboardItem" id="map">
      <h1>Map</h1>
    </div>
  )
}

const AIinfo = () => {
  return (
    <div className="dashboardItem" id="aiInfo">
      <h1>AI-Information</h1>
    </div>
  )
}

const Statistics = () => {
  return (
    <div className="dashboardItem" id="statistics">
      <h1>Statistics</h1>
    </div>
  )
}

const ThreatsDetected = () => {
  return (
    <div className="dashboardItem" id="threatsDetected">
      <h1>Threats1</h1>
    </div>
  )
}

const LiveNetworkTraffic = ({dataset}) => {
  return (
    <div className="dashboardItem" id="liveNetworkTraffic">
      <h1>Live Network Traffic</h1>
    </div>
  )
}

const Announcements = () => {
  return(
    <div className="dashboardItem" id="announcements">
      <h1>Announcements</h1>
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
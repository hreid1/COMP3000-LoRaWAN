// App.jsx -> root React component 

/*

Top nav menu
  - Title, help, notifications, settings, profile -> buttons
Side bar
  - Home, Maps, devices, logs, AI settings
Main content 
  - Statistics
  - Threats detected 
  - Threats/issues resolved
  - Live network traffic
  - Announcements
  - AI model information
  - Map with devices location
  - Device List

*/

import profileImg from './assets/profile.svg'
import settingsImg from './assets/settings.svg'
import notificationImg from './assets/notification.svg'
import helpImg from './assets/help.svg'
import dashboardImg from './assets/dashboard.svg'
import mapsImg from './assets/maps.svg'
import deviceImg from './assets/devices.svg'
import logImg from './assets/logs.svg'

const TopNavMenu = () => {
  return (
    <div className="navMenu" id="topNavMenuContainer">
      <h1>LoRaWAN Anomaly Detection Application</h1>
      <button className="topNavMenuButton">
        <img src={helpImg} alt='Help' className="topNavMenuIcon"></img>
      </button>
      <button className="topNavMenuButton">
        <img src={notificationImg} alt="Notification Bell" className="topNavMenuIcon"></img>     </button>
      <button className="topNavMenuButton">
        <img src={settingsImg} alt="Settings" className="topNavMenuIcon"></img>
      </button>
      <button className="topNavMenuButton">
        <img src={profileImg} alt="Profile" className="topNavMenuIcon"></img>
      </button>
    </div>
  )
}

const SideNavMenu = () => {
  return (
    <div className="navMenu" id="sideNavMenuContainer">
      <button className="sideNavMenuButton">
        <img src={dashboardImg} alt="Dashboard" className="sideNavMenuIcon"></img>
        <span>Home</span>
      </button>
      
      <button className="sideNavMenuButton">
        <img src={mapsImg} alt="Map" className="sideNavMenuIcon"/>
        <span>Maps</span>
      </button>
      <button className="sideNavMenuButton">
        <img src={deviceImg} alt="Device" className="sideNavMenuIcon"/>
        <span>Devices</span>
      </button>
      <button className="sideNavMenuButton">
        <img src={logImg} alt="Logs" className="sideNavMenuIcon"/>
        <span>Logs</span>  
      </button>
      <button className="sideNavMenuButton">
        <img src={settingsImg} alt="AI Settings" className='sideNavMenuIcon' />
        <span>AI Settings</span>  
      </button>
    </div>
  )
}

const MainDashContent = (props) => {
  return (
    <div className="navMenu" id="dashContentContainer">
      <Statistics />
      <ThreatsDetected />
      <LiveNetworkTraffic dataset={props.dataset}/>
      
      <Announcements />
      <AIinfo />
      <Map />
      <DeviceList />
    </div>
  )
}

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
      <div>
        {dataset.map(item => (
          <p key={item.id}>
            {item.timestamp} - {item.src_ip} 
          </p>
        ))}
      </div>
    </div>
  )
}

// Subject to change
const Threats2 = () => {
  return(
    <div className="dashboardItem" id="threats2">
      <h1>Threats2</h1>
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

const App = () => {

  const networkTraffic = [
    {
      id: 1,
      timestamp: "2025-11-08T10:00:00Z", 
      src_ip: "192.168.1.2",
      dest_ip: "93.184.216.34",
      src_port: "54321",
      dst_port: "80",
      protocol: "TCP",
      method: "GET",
      url: "http://example.com/index.html",
      status: "200",
      bytes_sent: "512",
      bytes_received: "2048",
      user_agent: "Mozilla/5.0",
    },
  ]

  return (
    <div className="dashContainer">
      <TopNavMenu />
      <SideNavMenu />
      <MainDashContent dataset={networkTraffic} />
    </div>
  )
}

export default App

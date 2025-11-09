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

const TopNavMenu = () => {
  return (
    <div className="navMenu" id="topNavMenuContainer">
      <p>Title</p>
      <button>Help</button>
      <button>Notification Bell</button>
      <button>Settings</button>
      <button>Profile</button>
    </div>
  )
}

const SideNavMenu = () => {
  return (
    <div className="navMenu" id="sideNavMenuContainer">
      <button>Home</button>
      <button>Maps</button>
      <button>Devices</button>
      <button>Logs</button>
      <button>AI settings</button>
    </div>
  )
}

const MainDashContent = (props) => {
  return (
    <div className="navMenu" id="dashContentContainer">
      <Statistics />
      <ThreatsDetected />
      <LiveNetworkTraffic dataset={props.dataset}/>
      <Threats2 />
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

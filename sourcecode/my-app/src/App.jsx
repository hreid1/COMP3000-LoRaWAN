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

const MainDashContent = () => {
  return (
    <div className="navMenu" id="dashContentContainer">
      <div className="dashboardItem" id="statistics">Statistics</div>
      <div className="dashboardItem" id="threatsDetected">Threats Detected</div>
      <div className="dashboardItem" id="liveNetworkTraffic">Live Network traffic</div>
      <div className="dashboardItem" id="threats2">Threats/issues resolved</div>
      <div className="dashboardItem" id="announcements">Announcements</div>
      <div className="dashboardItem" id="aiInfo">AI Model Information</div>
      <div className="dashboardItem" id="map">Map</div>
      <div className="dashboardItem" id="deviceList">Device List</div>
    </div>
  )
}

const App = () => {
  return (
    <div className="dashContainer">
      <TopNavMenu />
      <SideNavMenu />
      <MainDashContent />
    </div>
  )
}

export default App

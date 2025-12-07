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
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard/Dashboard'
import profile from './pages/Profile/Profile'

const App = () => {
  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default App

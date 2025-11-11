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

import Dashboard from './pages/dashboard/Dashboard'

const App = () => {

  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default App

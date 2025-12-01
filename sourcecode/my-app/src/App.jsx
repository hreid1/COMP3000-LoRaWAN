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
import Dashboard from './pages/dashboard/Dashboard'
import profile from './pages/profile/Profile'


const App = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api/hello/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error:', error))
  }, []);

  return (
    <div>
      <Dashboard />
      {message}
    </div>
  )
}

export default App

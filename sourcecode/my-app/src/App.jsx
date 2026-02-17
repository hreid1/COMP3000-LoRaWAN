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
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const App = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to dashboard on page load
    navigate('/dashboard')
  }, [navigate])

  return null
}

export default App

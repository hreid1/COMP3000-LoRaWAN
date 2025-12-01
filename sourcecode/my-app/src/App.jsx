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
  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      console.log(import.meta.env.VITE_API_URL)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}Lorawan`);
        if (!response.ok){
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log(result)
        setData(result);
      } catch (error) {
        console.log("Error fetching data");
      }
    }

    fetchData();
  }, [])


  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar/Navbar'
import SideNavbar from '../components/Navbar/SideNavbar'
import './MainLayout.css'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/users/1/")
    .then((response) => {
      setData(response.data || [])
    })
  }, []);

  const username = data.username

  return (
    <div id="mainLayoutContainer">
      <div id="navbarWrapper">
        <Navbar name={username}/>
      </div>
      <div id="sidenavbarWrapper">
        <SideNavbar />
      </div>
      <main className="mainContent">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
// src/layouts/MainLayout.jsx
import Navbar from '../components/Navbar/Navbar'
import SideNavbar from '../components/Navbar/SideNavbar'
import './MainLayout.css'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div id="mainLayoutContainer">
      <Navbar />
      <SideNavbar />
      <Outlet /> {/* This renders the page content */}
    </div>
  )
}

export default MainLayout
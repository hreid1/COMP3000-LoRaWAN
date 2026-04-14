import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar/Navbar'
import SideNavbar from '../components/Navbar/SideNavbar'
import './MainLayout.css'
import { Outlet, Navigate } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import api from '../utils/api'

const MainLayout = () => {
  const { user, logoutUser } = useContext(AuthContext)

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div id="mainLayoutContainer">
      <div id="navbarWrapper">
        <Navbar 
          username={user.username} 
          logout={logoutUser} 
          alerts={user.alerts} 
        />
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
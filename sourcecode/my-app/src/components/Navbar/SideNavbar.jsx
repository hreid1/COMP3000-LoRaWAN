import React from 'react'
import './SideNavbar.css'
import Dots from '../../assets/dots.svg'
import { Link } from "react-router"

const SideNavbar = () => {
  return (
    <div className='sideNavbar'>
      <img src={Dots} alt="" className='logo'/>
      <div className='menuContent'>
        <ul>
          <Link to="/dashboard">
            <li>Home</li>
          </Link>
          <Link to="/devices">
            <li>Devices</li>
          </Link>
          <Link to="/logs">
            <li>Logs</li>
          </Link>
          <Link to="/aiinfo">
            <li>AI Info</li>
          </Link>
          <Link to="/map">
            <li>Map</li>
          </Link>
          <Link to="/admin">
            <li>Admin</li>
          </Link>
          <Link to="/anomaly">
            <li>Anomaly</li>
          </Link>
        </ul>
      </div>
    </div>
  )
}

export default SideNavbar
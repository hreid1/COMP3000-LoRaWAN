import React from 'react'
import './SideNavbar.css'
import { Link } from 'react-router-dom'

const SideNavbar = () => {
  return (
    <nav className="sideNavbar">
      <ul className='sideNavbarItems'>
        <Link to ="/dashboard" className='Link'>
          <li className="sideNavbarItem">Dashboard</li>
        </Link>
        <li className="sideNavbarItem" style={{color: "red"}}>Maps</li>
        <Link to="/devices" className='Link'>
          <li className="sideNavbarItem">Devices</li>
        </Link>
        <Link to ="/logs" className="Link">
          <li className="sideNavbarItem">Logs</li>
        </Link>
        <li className="sideNavbarItem" style={{color: "red"}}>AI Model</li>
        <Link to="/settings" className="Link">
          <li className="sideNavbarItem" id='Settings'>Settings</li>
        </Link>
      </ul>
    </nav>
  );
};

export default SideNavbar
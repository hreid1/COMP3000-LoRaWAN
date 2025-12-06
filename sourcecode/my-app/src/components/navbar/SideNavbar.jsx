import React from 'react'
import './SideNavbar.css'
import dashboardImg from '../../assets/dashboard.svg'
import mapsImg from '../../assets/maps.svg'
import deviceImg from '../../assets/devices.svg'
import logImg from '../../assets/logs.svg'
import settingsImg from '../../assets/settings.svg'
import networkImg from '../../assets/network.svg'
import { Link } from 'react-router-dom'

const SideNavbar = () => {
  return (
    <nav className="sideNavbar">
      <ul className='sideNavbarItems'>
        <Link to ="/dashboard">
          <li className="sideNavbarItem">Dashboard</li>
        </Link>
        <li className="sideNavbarItem">Maps</li>
        <Link to="/devices">
          <li className="sideNavbarItem">Devices</li>
        </Link>
        <Link to ="/logs">
          <li className="sideNavbarItem">Logs</li>
        </Link>
        <li className="sideNavbarItem">AI Model</li>
        <Link to="/settings">
          <li className="sideNavbarItem" id='Settings'>Settings</li>
        </Link>
      </ul>
    </nav>
  );
};

export default SideNavbar
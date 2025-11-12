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
    <div className='sideNavbar' id='sideNavbar'>
      <ul className='sideNavbarItems'>
        <li className="sideNavbarItem">Home</li>
        <li className="sideNavbarItem">Maps</li>
        <Link to="/devices">
          <li className="sideNavbarItem">Devices</li>
        </Link>
        <li className="sideNavbarItem">Logs</li>
        <li className="sideNavbarItem">Settings</li>
      </ul>
    </div>
  );
};

export default SideNavbar
import React from 'react'
import './SideNavbar.css'
import dashboardImg from '../../assets/dashboard.svg'
import mapsImg from '../../assets/maps.svg'
import deviceImg from '../../assets/devices.svg'
import logImg from '../../assets/logs.svg'
import settingsImg from '../../assets/settings.svg'
import networkImg from '../../assets/network.svg'

const SideNavbar = () => {
  return (
    <div className='sideNavbar' id='sideNavbar'>
      <ul className='sideNavbarItems'>
        <li className="sideNavbarItem">Home</li>
        <li className="sideNavbarItem">Maps</li>
        <li className="sideNavbarItem">Devices</li>
        <li className="sideNavbarItem">Logs</li>
        <li className="sideNavbarItem">Settings</li>
      </ul>
    </div>
  );
};

export default SideNavbar
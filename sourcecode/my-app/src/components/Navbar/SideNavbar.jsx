import React from 'react'
import './SideNavbar.css'
import Dots from '../../assets/dots.svg'

const SideNavbar = () => {
  return (
    <div className='sideNavbar'>
      <img src={Dots} alt="" className='logo'/>
      <div className='menuContent'>
        <ul>
          <li>Home</li>
          <li>Devices</li>
          <li>Logs</li>
          <li>Maps</li>
          <li>AI-Model</li>
        </ul>
      </div>
    </div>
  )
}

export default SideNavbar
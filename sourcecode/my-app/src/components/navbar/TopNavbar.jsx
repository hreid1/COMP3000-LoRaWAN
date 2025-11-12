import React from 'react'
import './TopNavbar.css'
import profileImg from '../../assets/profile.svg'
import settingsImg from '../../assets/settings.svg'
import notificationImg from '../../assets/notification.svg'
import helpImg from '../../assets/help.svg'
import searchImg from '../../assets/search.svg'
import networkImg from '../../assets/network.svg'
import { Link } from 'react-router-dom'

const TopNavbar = () => {
  return(
    <div className="topNavbar" id='topNavbar'>
      <img src={networkImg} alt="Logo" className='logo' />
      <ul className='topNavbarItems'>
        <li className="topNavbarItem">Help</li>
        <li className="topNavbarItem">Notifications</li>
        <Link to="/settings">
          <li className="topNavbarItem">Settings</li>
        </Link>
        <Link to="/profile">
          <li className="topNavbarItem">Profile</li>
        </Link>
      </ul>
      <div className="searchBox">
        <input type="text" placeholder='Search'/>
          <img src={searchImg} alt="" className='toggleIcon'/>
      </div>
    </div>
  )
}

export default TopNavbar
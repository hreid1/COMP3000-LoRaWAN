import React from 'react'
import './TopNavbar.css'
import profileImg from '../../assets/profile.svg'
import settingsImg from '../../assets/settings.svg'
import notificationImg from '../../assets/notification.svg'
import helpImg from '../../assets/help.svg'
import searchImg from '../../assets/search.svg'

const TopNavbar = () => {
  return(
    <div className="topNavbar" id='topNavbar'>
      <ul className='topNavbarItems'>
        <li className="topNavbarItem">Home</li>
        <li className="topNavbarItem">Products</li>
        <li className="topNavbarItem">Features</li>
        <li className="topNavbarItem">About</li>
      </ul>
      <div className="searchBox">
        <input type="text" placeholder='Search'/>
          <img src={searchImg} alt="" className='toggleIcon'/>
      </div>
    </div>
  )
}

export default TopNavbar
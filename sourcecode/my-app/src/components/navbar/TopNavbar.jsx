import React from 'react'
import './TopNavbar.css'
import profileImg from '../../assets/profile.svg'
import settingsImg from '../../assets/settings.svg'
import notificationImg from '../../assets/notification.svg'
import helpImg from '../../assets/help.svg'
import searchImg from '../../assets/search.svg'
import networkImg from '../../assets/network.svg'
import { Link } from 'react-router-dom'
import Dropdown, { DropdownItem } from '../Dropdown/Dropdown'

const TopNavbar = () => {
  const items = [1, 2, 3, 4, 5, 6]

  return(
    <div className="topNavbar" id='topNavbar'>
      <h1>Hi Henry</h1>
      <div className="searchBox">
        <input type="text" placeholder='Search'/>
          <img src={searchImg} alt="" className='toggleIcon'/>
      </div>
      <ul className='topNavbarItems'>
        <li className="topNavbarItem">
          <img src={helpImg} alt="helpPicture" className='logo' />
        </li>
        <li className="topNavbarItem">
          <img src={notificationImg} alt="notifPicture" className='logo' />
        </li>
          <Link to="/profile">
          <li className="topNavbarItem">
            <img src={profileImg} alt="profilePicture" className='logo' />
          </li>
        </Link>
        <Dropdown
          buttonText="Dropdown button"
          content={
            <>
              {items.map((item) => (
                <DropdownItem key={item}>
                  {`Item ${item}`}
                </DropdownItem>
              ))}
            </>
          }
        >
          butt
        </Dropdown>
      </ul>
    </div>
  )
}

export default TopNavbar
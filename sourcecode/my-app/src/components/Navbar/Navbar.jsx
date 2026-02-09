import React from 'react'
import './Navbar.css'
import notificationImg from '../../assets/notification.svg'
import helpImg from '../../assets/help.svg'
import searchImg from '../../assets/search.svg'
import networkImg from '../../assets/network.svg'
import Dropdown from '../Dropdown/Dropdown'
import { Link } from "react-router"


const Navbar = ({name, data}) => {

  return (
    <nav className="navbar">
        <img src={networkImg} alt="" className='logo' />
        <span>Hi, {name}</span>
        <div className="searchbox">
            <input type="text" placeholder='Search' />
            <img src={searchImg} alt="" className='logo' />
        </div>
        <div className='navbarRight'>
            <Dropdown userData={data} />
        </div>
        
    </nav>
  )
}

export default Navbar
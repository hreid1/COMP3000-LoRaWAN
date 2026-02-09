import React, { useState } from 'react'
import { Link } from "react-router"
import './Dropdown.css'
import Profile from '../../pages/Profile/Profile.jsx'

const Dropdown = ({ userData }) => {
    const [open, setOpen] = useState(false)

    const onClick = () => {
        setOpen(!open)
    }

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={onClick}>
        <img 
          src={'/default-avatar.png'} 
          alt="User Avatar"
          className="profile-image"
        />
      </div>
      {open && (
        <div className="dropdown-content">
          <div className="dropdown-item">
            <Link to="/profile">
                <ul>Profile</ul>
            </Link>
          </div>
          <div className="dropdown-item">
            <Link to="/settings">
                <ul>Settings</ul>
            </Link>
          </div>
          <div className="dropdown-item">
            <ul>Logout</ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown
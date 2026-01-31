import React, { useState } from 'react'
import { Link } from "react-router"
import './Dropdown.css'

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
                <li>Profile</li>
            </Link>
          </div>
          <div className="dropdown-item">
            <Link to="/settings">
                <li>Settings</li>
            </Link>
          </div>
          <div className="dropdown-item">
            <li>Logout</li>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown
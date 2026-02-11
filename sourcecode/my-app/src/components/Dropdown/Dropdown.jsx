import React, { useState } from 'react'
import { Link } from "react-router"
import './Dropdown.css'
import Profile from '../../pages/Profile/Profile.jsx'
import Settings from '../../pages/Settings/Settings.jsx'
import Modal from '../Modal/Modal.jsx'

const Dropdown = ({ userData }) => {
    const [open, setOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

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
          <div className="dropdown-item" onClick={() => setIsProfileOpen(true)}>
            <ul>Profile</ul>
          </div>
          <Modal open={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
            <Profile />
          </Modal>
          <div className="dropdown-item" onClick={() => setIsSettingsOpen(true)}>
            <ul>Settings</ul>
          </div>
          <Modal open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
            <Settings />
          </Modal>
          <div className="dropdown-item">
            <ul>Logout</ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown
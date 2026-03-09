import React, { useState } from 'react'
import Dots from '../../assets/dots.svg'
import { Link } from "react-router"

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import HomeIcon from '@mui/icons-material/Home'
import WarningIcon from '@mui/icons-material/Warning'
import DevicesIcon from '@mui/icons-material/Devices'
import SchoolIcon from '@mui/icons-material/School'
import StorageIcon from '@mui/icons-material/Storage'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

const SideNavbarV2 = () => {
  const menuItems = [
    { label: 'Home', path: '/dashboard', icon: <HomeIcon /> },
    { label: 'Devices', path: '/devices', icon: <DevicesIcon /> },
    { label: 'AI Info', path: '/aiinfo', icon: <SchoolIcon /> },
    { label: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> },
    { label: 'Anomaly', path: '/anomaly', icon: <WarningIcon /> },
    { label: 'Logs', path: '/logs', icon: <StorageIcon /> },
  ]

  return (
    <Box>
      {menuItems.map((item) => (
        <Box
          key={item.label}
          component={Link}
          to={item.path}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1,
            mb: 1,
            margin: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
            textDecoration: 'none',
            color: 'black',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          {item.icon}
          <Typography sx={{fontSize: 14,}}>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  )
}

const SideNavbarV1 = () => {
  return(
    <div className='sideNavbar'>
      <img src={Dots} alt="" className='logo'/>
      <div className='menuContent'>
        <ul>
          <Link to="/dashboard">
            <li>Home</li>
          </Link>
          <Link to="/anomaly">
            <li>Anomaly</li>
          </Link>
          <Link to="/devices">
            <li>Devices</li>
          </Link>
          <Link to="/aiinfo">
            <li>AI Info</li>
          </Link>
          <Link to="/logs">
            <li>Logs</li>
          </Link>
          <Link to="/admin">
            <li>Admin</li>
          </Link>
        </ul>
      </div>
    </div>
  )
}

const SideNavbar = () => {
  return (
    <SideNavbarV2 />
  )
}

export default SideNavbar
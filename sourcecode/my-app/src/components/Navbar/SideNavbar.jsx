import React, { useState } from 'react'
import { Link, useLocation } from "react-router-dom"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import HomeIcon from '@mui/icons-material/Home'
import WarningIcon from '@mui/icons-material/Warning'
import DevicesIcon from '@mui/icons-material/Devices'
import SchoolIcon from '@mui/icons-material/School'
import StorageIcon from '@mui/icons-material/Storage'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

const SideNavbarV2 = () => {
  const location = useLocation()
  
  const menuItems = [
    { label: 'Home', path: '/dashboard', icon: <HomeIcon /> },
    { label: 'Devices', path: '/devices', icon: <DevicesIcon /> },
    { label: 'AI Info', path: '/aiinfo', icon: <SchoolIcon /> },
    { label: 'Anomaly', path: '/anomaly', icon: <WarningIcon /> },
    //{ label: 'Admin', path: '/admin', icon: <AdminPanelSettingsIcon /> },
    { label: 'Logs', path: '/logs', icon: <StorageIcon /> },
  ]

  return (
    <Box>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path
        
        return (
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
              backgroundColor: isActive ? '#1976d2' : '#f5f5f5',
              borderRadius: 1,
              textDecoration: 'none',
              color: isActive ? 'white' : 'black',
              borderLeft: isActive ? '4px solid #1976d2' : 'none',
              fontWeight: isActive ? 'bold' : 'normal',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: isActive ? '#1565c0' : '#e0e0e0',
              },
            }}
          >
            {item.icon}
            <Typography sx={{fontSize: 14}}>{item.label}</Typography>
          </Box>
        )
      })}
    </Box>
  )
}

export default SideNavbarV2
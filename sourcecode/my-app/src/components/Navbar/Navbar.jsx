import React, { useEffect, useState } from 'react'
import './Navbar.css'
import notificationImg from '../../assets/notification.svg'
import helpImg from '../../assets/help.svg'
import searchImg from '../../assets/search.svg'
import networkImg from '../../assets/network.svg'
import { Link } from "react-router-dom"
import Settings from '../../pages/Settings/Settings.jsx'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import NotificationsIcon from '@mui/icons-material/Notifications';
import { 
  Badge
} from "@mui/material"
import api from '../../utils/api.js'

const NavbarV2 = ({username, logout, alertCount}) => {
  const [navOpen, setNavOpen] = useState(null)
  const [NotiOpen, setNotiOpen] = useState(null)


  const handleNavOpen = (event) => {
    setNavOpen(event.currentTarget);
  }

  const handleCloseNavMenu = () => {
    setNavOpen(null)
  }

  const handleNotiOpen = (e) => {
    setNotiOpen(e.currentTarget);
  }

  const handleCloseNotiMenu = () => {
    setNotiOpen(false)
  }

  return(
    <AppBar position='static' sx={{ width: '100%', overflow: 'hidden' }}>
      <Toolbar disableGutters sx={{ display: 'flex', alignItems: 'center', px: 2, boxSizing: 'border-box' }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <AdbIcon />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography>Hi, {username}</Typography>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Tooltip sx={{marginRight: 2 }}>
            <Badge badgeContent={alertCount}>
              <NotificationsIcon onClick={handleNotiOpen} sx={{ cursor: 'pointer' }}/>
            </Badge>
          </Tooltip>
          <Menu
            open={Boolean(NotiOpen)}
            onClose={handleCloseNotiMenu}
            anchorEl={NotiOpen}
          >
          </Menu>
          <Tooltip sx={{}}>
            <IconButton onClick={handleNavOpen}>
              <Avatar />
            </IconButton>
          </Tooltip>
          <Menu 
            open={Boolean(navOpen)}
            onClose={handleCloseNavMenu}
            sx={{ mt: '45px' }}
            anchorEl={navOpen}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

const NavbarV1 = ({name, data}) => {
  return (
    <nav className="navbar">
      <img src={networkImg} alt="" className="logo" />
      <span>Hi, {name}</span>
      <div className="searchbox">
        <input type="text" placeholder="Search" />
        <img src={searchImg} alt="" className="logo" />
      </div>
      <div className="navbarRight">
        <Dropdown userData={data} />
      </div>
    </nav>
  );
}


const Navbar = ({username, logout, alerts}) => {
  const alertCount = alerts.length

  return (
    <NavbarV2 username={username} logout={logout} alertCount={alertCount} />
  )
}

export default Navbar
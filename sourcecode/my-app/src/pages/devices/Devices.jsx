import { useState } from 'react'
import React from 'react'
import axios from 'axios'
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'
import './Devices.css'

// This page will display the information coming from each device 
  // Could either be a node, MAC address etc
  // Will feature graphs -> where most the information within the dataset will come from

const DeviceCard = () => {
  return (
    <div className='dashCard'>
      <span>This is where the information for device 1, device 2 etc will go </span>
    </div>
  )
}

const DeviceContent = () => {
  return (
    <div className='deviceContentContainer'>
      <DeviceCard />

    </div>
  )
}

const Devices = () => {
  return (
    <div id="deviceContainer">
      <TopNavbar />
      <SideNavbar />
      <DeviceContent />
    </div>
  )
}

export default Devices
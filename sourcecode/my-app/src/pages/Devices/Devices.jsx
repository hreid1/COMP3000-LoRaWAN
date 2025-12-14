import { useState } from 'react'
import React from 'react'
import axios from 'axios'
import SideNavbar from '../../components/Navbar/SideNavbar'
import './Devices.css'
import Card from '../../components/Card';

const DeviceCard = () => (
  <Card header={<span>Device Info</span>}>
    <span>This is where the information for device 1, device 2 etc will go</span>
  </Card>
);

const DeviceContent = () => (
  <div className='deviceContentContainer'>
    <DeviceCard />
  </div>
);

const Devices = () => (
  <div id="deviceContainer">
    <TopNavbar />
    <SideNavbar />
    <DeviceContent />
  </div>
);

export default Devices
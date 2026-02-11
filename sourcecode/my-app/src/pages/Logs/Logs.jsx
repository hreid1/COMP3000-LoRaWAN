import React from "react";
import { useState } from "react";
import SideNavbar from '../../components/Navbar/SideNavbar'
import Navbar from '../../components/Navbar/Navbar'
import './Logs.css'
import Card from '../../components/Card/Card';

const LogItem = () => {
  return (
    <Card title="Log Card">
      <span>Hello Test</span>
    </Card>
  )
}

const LogContent = () => {
  return(
    <div className="logContentContainer">
      <LogItem />

    </div>
  )
}

const Logs = () => {
  return(
    <div id="logContainer">
      <Navbar />
      <SideNavbar />
      <LogContent />
    </div>
  )
}

export default Logs
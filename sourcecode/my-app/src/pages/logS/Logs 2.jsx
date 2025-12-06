import React from "react";
import { useState } from "react";
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'
import './Logs.css'
import Card from '../../components/Card';

const LogCard = () => (
  <Card header={<span>Logs</span>}>
    <span className="logOption">Search:</span>
    <span className="logOption">Filter:</span>
    <span className="logOption">Email:</span>
  </Card>
);

const LogContent = () => (
  <div className="logContentContainer">
    <LogCard />
  </div>
);

const Logs = () => (
  <div id="logContainer">
    <TopNavbar />
    <SideNavbar />
    <LogContent />
  </div>
);

export default Logs
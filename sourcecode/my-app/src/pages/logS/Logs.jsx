import React from "react";
import { useState } from "react";
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'
import './Logs.css'

const LogCard = () => {
    return(
        <div className="logCard">
            <div id="logHeader">
                <span>This is a log card</span>
            </div>
            <div id="logContent">
                <span className="logOption">Search:</span>
                <span className="logOption">Filter:</span>
                <span className="logOption">:</span>
            </div>
        </div>
    )
}

const LogContent = () => {
    return(
        <div className="logContentContainer">
            <LogCard />
        </div>
    )
}

const Logs = () => {
    return(
        <div id="logContainer">
            <TopNavbar />
            <SideNavbar />
            <LogContent />
        </div>
    )
}

export default Logs
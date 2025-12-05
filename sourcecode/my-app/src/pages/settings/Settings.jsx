import React from 'react'
import SideNavbar from '../../components/navbar/SideNavbar'
import TopNavbar from '../../components/navbar/TopNavbar'
import './Settings.css'

// This is the settings page 
    // Will feature:
        // Account: Changing username, password, MFA, email, profile picture
        // Preferences: Light/dark mode, 
        // Legal stuff: Removing account + linked details

const SettingsCard = () => {
    return(
        <div className='settingsCard'>
            <div id="settingsHeader">
                <span>Settings</span>
            </div>
            <div id="settingsContent">
                <span className="setOption">Username: </span>
                <span className="setOption">Password: </span>
                <span className="setOption">Email: </span>
            </div>
        </div>
    )
}

const SettingsContent = () => {
    return(
        <div className='settingsContentContainer'>
            <SettingsCard />
        </div>
    )
}

const Settings = () => {
    return(
        <div id="settingsContainer">
            <TopNavbar />
            <SideNavbar />
            <SettingsContent />
        </div>
    )
}

export default Settings
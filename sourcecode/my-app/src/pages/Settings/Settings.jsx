import React from 'react'
import SideNavbar from '../../components/Navbar/SideNavbar'
import TopNavbar from '../../components/Navbar/TopNavbar'
import './Settings.css'
import Card from '../../components/Card';

// This is the settings page 
    // Will feature:
        // Account: Changing username, password, MFA, email, profile picture
        // Preferences: Light/dark mode, 
        // Legal stuff: Removing account + linked details

const SettingsCard = () => {
    return(
        <Card header={<span>Settings</span>}>
            <span className="setOption">Username: </span>
            <span className="setOption">Password: </span>
            <span className="setOption">Email: </span>
        </Card>
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
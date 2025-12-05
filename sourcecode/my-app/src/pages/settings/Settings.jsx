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

}

const SettingsContent = () => {
    return(
        <div className='settingsContentContainer'>
            <span>This is the settings page</span>
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
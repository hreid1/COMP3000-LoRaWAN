import React from 'react'
import './Maps.css'
import Card from '../../components/Card/Card'
import SideNavbar from '../../components/Navbar/SideNavbar'
import Navbar from '../../components/Navbar/Navbar'

const MapItem = () => {
    return(
        <Card id="mapItem" title="Map">

        </Card>

    )
}

const MapContentContainer = () => {
    return(
        <div id="mapContentContainer">
            <MapItem />
        </div>
    )
}

const Maps = () => {
  return (
    <div id="mapContainer">
        <Navbar />
        <SideNavbar />
        <MapContentContainer />
    </div>
  )
}

export default Maps
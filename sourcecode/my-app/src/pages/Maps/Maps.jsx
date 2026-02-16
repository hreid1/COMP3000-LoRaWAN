import React from 'react'
import './Maps.css'
import Card from '../../components/Card/Card'

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
    <MapContentContainer />
  )
}

export default Maps
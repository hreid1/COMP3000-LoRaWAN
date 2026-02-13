import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideNavbar from '../../components/Navbar/SideNavbar'

const AnomalyContent = () => {
  return(
    <div>
      <span>Hello Test</span>
    </div>
  )
}

const Anomaly = () => {
  return (
    <div>
      <Navbar />
      <SideNavbar />
      <AnomalyContent />
    </div>
  )
}

export default Anomaly
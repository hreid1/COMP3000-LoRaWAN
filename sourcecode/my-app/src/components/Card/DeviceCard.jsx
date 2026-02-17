import React from 'react'
import './DeviceCard.css'
import Card from './Card'

const DeviceCard = ({ nodeID, owner, isActive, createdAt, packetCount }) => {
    return(
        <div className="deviceCard">
            <div className="deviceInfoContent">
                <div className="deviceInfoHeader">
                    <span className="deviceNodeID">Node {nodeID}</span>
                    <span className={`deviceStatus ${!isActive ? 'inactive' : ''}`}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div className="deviceInfoRow">
                    <span className="deviceInfoLabel">Owner</span>
                    <span className="deviceInfoValue">{owner}</span>
                </div>
                <div className="deviceInfoRow">
                    <span className="deviceInfoLabel">Packets</span>
                    <span className="deviceInfoValue">{packetCount}</span>
                </div>
                <div className="deviceInfoRow">
                    <span className="deviceInfoLabel">Location</span>
                    <span className="deviceInfoValue">SW Farm</span>
                </div>
                <div className="deviceInfoRow">
                    <span className="deviceInfoLabel">Created</span>
                    <span className="deviceInfoValue">{createdAt}</span>
                </div>
            </div>
        </div>
    )
}

export default DeviceCard
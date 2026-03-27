import React, { useState } from 'react'
import './DeviceCard.css'
import { Paper, Box, Typography } from '@mui/material'
import Card from './Card'

const DeviceCardV2 = ({ nodeID, owner, isActive, createdAt, packetCount }) => {

    const isActiveStyle = {
        color: isActive ? 'green' : 'red'
    }

    if (isActive){
        return(
            <Box sx={{ padding: 0.5, margin: 1 }}>
                <Paper>
                    <Typography>Node: {nodeID}</Typography>

                    <Typography sx={{color: 'green'}}>Online</Typography>
                    <Typography>Owner: {owner}</Typography>
                    <Typography>Packet Count: {packetCount}</Typography>
                    <Typography>Location: SW Farm</Typography>
                    <Typography>Created At: {createdAt}</Typography>
                </Paper>
            </Box>
        )
    }
    if (!isActive) {
        return(
            <Box sx={{ padding: 0.5, margin: 1 }}>
                <Paper>
                    <Typography>Node: {nodeID}</Typography>

                    <Typography sx={{ color: 'red' }}>Online</Typography>
                    <Typography>Owner: {owner}</Typography>
                    <Typography>Packet Count: {packetCount}</Typography>
                    <Typography>Location: SW Farm</Typography>
                    <Typography>Created At: {createdAt}</Typography>
                </Paper>
            </Box>
        )
    }

    return(
        <Box sx={{padding: 0.5, margin: 1}}>
            <Paper>
                <Typography>Node: {nodeID}</Typography>

                <Typography sx={{isActiveStyle}}>Device Status: {isActive}</Typography>
                <Typography>Owner: {owner}</Typography>
                <Typography>Packet Count: {packetCount}</Typography>
                <Typography>Location: SW Farm</Typography>
                <Typography>Created At: {createdAt}</Typography>
            </Paper>
        </Box>
    )
}

const DeviceCardV1 = ({ nodeID, owner, isActive, createdAt, packetCount }) => {
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

const DeviceCard = ({ nodeID, owner, isActive, createdAt, packetCount }) => {
    return(
        <>
            <DeviceCardV2 
                nodeID={nodeID}
                owner={owner}
                isActive={isActive}
                createdAt={createdAt}
                packetCount={packetCount}
            />
        </>
    )
}

export default DeviceCard
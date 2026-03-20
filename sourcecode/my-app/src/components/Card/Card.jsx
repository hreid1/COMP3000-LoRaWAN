import React from 'react';
import { Card as MuiCard, CardHeader, CardContent, IconButton, Box, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './Card.css'

const CardV2 = ({id, title, children, marker}) => {
  return(
    <div id={id} className="dashCard">
      <div className="cardInner">
        <div className="cardHeader">
          <span className="cardTitle">{title}</span>
          <img src={Dots} alt="" className="img"></img>
        </div>
        <div className="cardContent">
          {children}
        </div>
      </div>
    </div>
  )
}

const CardV1 = ({ id, title, children, marker }) => {

  return(
    <MuiCard 
      id={id}
      sx={{ 
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        className='marker' 
        sx={{ 
          position: 'absolute', 
          left: 0, 
          top: 0,
          width: '4px', 
          height: '100%', 
          bgcolor: 'primary.main',
          borderRadius: '4px 0 0 4px',
          zIndex: 10,
          pointerEvents: 'none'
        }} 
      />
      <CardHeader
        title={title}
        action={
          <IconButton aria-label="options" size="small">
            <MoreVertIcon />
          </IconButton>
        }
        sx={{ paddingBottom: 0, flexShrink: 0 }}
      />
      <Divider />
      <CardContent sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {children}
      </CardContent>
    </MuiCard>
  )
}

const Card = ({id, title, children, marker}) => {

  return(
    <CardV1 id={id} title={title} children={children} marker={marker}/>
  )
}

export default Card;

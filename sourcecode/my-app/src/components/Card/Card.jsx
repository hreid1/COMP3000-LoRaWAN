import React from 'react';
import Dots from '../../assets/dots.svg'
import './Card.css'

const Card = ({ id, title, children, marker }) => {

  return(
    <div id={id} className="dashCard">
      <div>
        <div className='marker'></div>
        <div className='cardHeader'>
          <span className='cardTitle'>{title}</span>
          <img src={Dots} alt="" className='img'/>
        </div>
        <div className='card-content'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Card;

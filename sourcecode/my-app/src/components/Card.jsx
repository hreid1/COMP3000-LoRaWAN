import React from 'react';

const Card = ({ header, children, className }) => (
  <div className={`card ${className || ''}`}>
    {header && <div className="card-header">{header}</div>}
    <div className="card-content">{children}</div>
  </div>
);

export default Card;
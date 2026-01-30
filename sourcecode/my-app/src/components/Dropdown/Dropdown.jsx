import React, { useState } from 'react'
import './Dropdown.css'

const DropdownButton = ({children, open, toggle}) => {
    return(
        <div className={`dropdown-btn ${open ? "button-open": null}`} onClick={toggle}>
            {children}
            <span className='toggle-icon'></span>
        </div>
    )
}

const DropdownItem = ({children, onClick}) => {
    return(
        <div className='dropdown-item' onClick={onClick}>
            {children}
        </div>
    )

}

const DropdownContent = ({children}) => {
    return(
        <div className={`dropdown-content ${open ? "content-open": null}`} >
            {children}
        </div>
    )

}

const Dropdown = ({buttonText, content}) => {
    const [open, setOpen] = useState(false)
    const toggleDropdown = () => {
        setOpen((open) => !open);
    }

  return (
    <div className="dropdown">
        <DropdownButton open={open} toggle={toggleDropdown}>{buttonText}</DropdownButton> 
        <DropdownContent open={open}>{content}</DropdownContent> 
    </div>
  )
}

export default Dropdown
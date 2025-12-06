import React, { useState } from 'react'
import './Dropdown.css'

import { FaChevronDown, FaChevronUp } from "react-icons/fa"

const DropdownBtn = ({children, open, toggle}) => {
    return(
        <div className={`dropdown-btn ${open ? "button-open" : null} `} onClick={toggle}>
            {children}
            <span className='toggle-icon'>
                {open ? <FaChevronUp /> : <FaChevronDown />}
            </span>
        </div>
    )
}

const DropdownContent = ({children, open}) => {
    return(
        <div className={`dropdown-content ${open ? "content-open" : null}`}>
            {children}
        </div>
    )
}

export const DropdownItem = ({children, onClick}) => {
    return(
        <div className="dropdown-item" onClick={onClick}>
            {children}
        </div>
    )
}

const Dropdown = ({ buttonText, content }) => {
    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen((open) => !open);
    }

    return (
      <div className='dropdown'>
        <DropdownBtn open={open} toggle={toggleDropdown}>{buttonText}</DropdownBtn>
        <DropdownContent open={open}>{content}</DropdownContent>
      </div>
    );
}

export default Dropdown
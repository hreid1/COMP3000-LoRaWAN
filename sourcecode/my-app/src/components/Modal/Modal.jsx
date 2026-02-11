import React from "react";
import ReactDom from 'react-dom'
import './Modal.css'

const Modal = ({ open, children, onClose }) => {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
        <div className="overlay_styles"></div>
        <div className="modal_styles">
            <button onClick={onClose}>Close Modal</button>
            {children}
        </div>
    </>,
    document.getElementById('portal')
  )
};

export default Modal;
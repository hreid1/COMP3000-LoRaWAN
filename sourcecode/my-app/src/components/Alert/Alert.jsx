import React from 'react'
import { Snackbar, Alert } from '@mui/material'

const AlertMessage = ({ open, message, severity = "info", onClose }) => {
  return (
    <Snackbar
        open={open}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
    >
        <Alert onClose={onClose} severity={severity} sx={{ width: '100%'}}>
            {message}
        </Alert>
    </Snackbar>
  )
}

export default AlertMessage
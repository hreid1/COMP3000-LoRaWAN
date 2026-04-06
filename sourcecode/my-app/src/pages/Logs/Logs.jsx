import React, { useEffect } from "react";
import { useState } from "react";
import './Logs.css'
import Card from '../../components/Card/Card';
import axios from "axios";
import { Box, TextField, MenuItem } from "@mui/material"

// Need to log specific stuff not the entire DB response

const LogFilter = () => {
  const [filters, setFilters] = useState({
    dateRange: "",
    anomalyDetected: "",
    deviceAdded: "",

  })

  return(
    <Box>
      <TextField
        select
        label="Date Range"
        size="small"
        value={filters.dateRange}
        onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
      >
        <MenuItem>All time</MenuItem>
        <MenuItem>Last 24hrs</MenuItem>
        <MenuItem>Last 7 Days</MenuItem>
        <MenuItem>Last 30 Days</MenuItem>
      </TextField>
      <TextField
        select
        label="Log type"
      >
        <MenuItem>Model run</MenuItem>
        <MenuItem>Anomaly Detected</MenuItem>
        <MenuItem>Device Added</MenuItem>
        <MenuItem>Device Removed</MenuItem>
        <MenuItem>Device Change</MenuItem>
      </TextField>

    </Box>
  )

}

const LogItem = ({}) => {

  return (
    <div>

    </div>

  )
}

const LogContent = ({}) => {
  
  return(
    <div className="logContentContainer">
      <Card title="Logs">
        <LogFilter />
      </Card>
    </div>
  )
}

const Logs = () => {
  const [data, setData] = useState({
    logs: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user] = await Promise.all([
          axios.get("http://127.0.0.1:8000/lorawan/users/1/"),
        ])
        setData({
          logs: user.data.logs || [],
          loading: false,
          error: null
        })
      } catch (err) {
        setData(prev => ({ ...prev, loading: false, error: err.message}))
      }
    }
    fetchData()
  }, [])  
  

  return(
    <LogContent 
      logs={data.logs} 
      loading={data.loading} 
      error={data.error} 
    />
  )
}

export default Logs
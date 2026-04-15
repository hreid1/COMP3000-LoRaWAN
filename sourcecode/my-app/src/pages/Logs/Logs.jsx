import React, { useEffect, useState, useMemo } from "react";
import './Logs.css'
import Card from '../../components/Card/Card';
import axios from "axios";
import { Box, TextField, MenuItem, Grid, CircularProgress, Alert, Paper, Stack, Drawer, Button, Modal } from "@mui/material"
import api from "../../utils/api";
import SearchIcon from '@mui/icons-material/Search';

// Need to log specific stuff not the entire DB response

const LogFilter = ({ filters, setFilters }) => {
  return (
    <Box sx={{p: 2, borderBottom: '2px solid #f0f0f0'}}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          placeholder="Search logs..."
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          sx={{ flexGrow: 2, backgroundColor: 'white' }}
        />
        <TextField
          select
          label="Timeframe"
          size="small"
          value={filters.dateRange}
          onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          sx={{ minWidth: 150, backgroundColor: 'white' }}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">Last 7 Days</MenuItem>
        </TextField>
        <TextField
          select
          label="Severity"
          size="small"
          value={filters.severity}
          onChange={(e) => setFilters({...filters, severity: e.target.value})}
          sx={{ minWidth: 130, backgroundColor: 'white' }}
        >
          <MenuItem value="all">Any Severity</MenuItem>
          <MenuItem value="error">Error</MenuItem>
          <MenuItem value="warning">Warning</MenuItem>
          <MenuItem value="info">Info</MenuItem>
        </TextField>
        <TextField
          select
          label="Log Type"
          size="small"
          value={filters.logType}
          onChange={(e) => setFilters({...filters, logType: e.target.value})}
          sx={{ minWidth: 130, backgroundColor: 'white'}}
        >
          <MenuItem value="model_run">Model Run</MenuItem>
          <MenuItem value="anomaly_detected">Anomaly Detected</MenuItem>
          <MenuItem value="device_added">Device Added</MenuItem>
          <MenuItem value="device_removed">Device Removed</MenuItem>
          <MenuItem value="device_status_change">Device Status Change</MenuItem>
        </TextField>
      </Stack>
    </Box>
  );
}

const LogContainer = ({ data, filters, setFilters }) => {
  const [selectedLog, setSelectedLog] = useState(null)

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto'
  }

  return (
    <div className="logContainer">
      <LogFilter filters={filters} setFilters={setFilters} />
      <div className="logTableWrapper">
        <table className="logTable">
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Description</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Owner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((log) => (
                <tr key={log.id} className="logRow">
                  <td className="logTime">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="logTitle">{log.title}</td>
                  <td className="logDescription">{log.description}</td>
                  <td><span className="logType">{log.log_type.replace('_', ' ')}</span></td>
                  <td><span className={`logSeverity ${log.severity}`}>{log.severity}</span></td>
                  <td>{log.owner}</td>
                  <td><Button size="small" onClick={() => setSelectedLog(log)}>View</Button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No logs found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        closeAfterTransition
      >
        <Box sx={modalStyle}>
          {selectedLog && (
            <div style={{display: 'flex', flexDirection: "column"}}>
              <span>Log Details</span>
              <span>Title: {selectedLog.title}</span>
              <span>Description: {selectedLog.description}</span>
              <span>Log Type: {selectedLog.log_type}</span>
              <span>Severity: {selectedLog.severity}</span>
              <span>Node: {selectedLog.node || 'null'}</span>
              <span>Packet: {selectedLog.packet || 'null'}</span>
              <span>Anomaly: {selectedLog.anomaly || 'null'}</span>
              <span>Created At: {new Date(selectedLog.created_at).toLocaleString()}</span>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}

const LogContent = ({data, loading, error}) => {
  const [filters, setFilters] = useState({
    search: "",
    dateRange: "all",
    logType: "all",
    severity: "all"
  });

  const filteredLogs = useMemo(() => {
    const list = data.logs || [];
    
    return list.filter(log => {
      const matchesSearch = !filters.search || 
        log.title.toLowerCase().includes(filters.search.toLowerCase()) || 
        log.description.toLowerCase().includes(filters.search.toLowerCase());

      // Severity filter
      const matchesSeverity = filters.severity === 'all' || log.severity === filters.severity;

      // Log Type
      const matchesLogType = filters.logType === 'all' || log.log_type === filters.logType
      
      // Date range filter
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const logDate = new Date(log.created_at);
        const now = new Date();
        if (filters.dateRange === 'today') {
          matchesDate = logDate.toDateString() === now.toDateString();
        } else if (filters.dateRange === 'week') {
          const sevenDaysAgo = new Date().setDate(now.getDate() - 7);
          matchesDate = logDate >= sevenDaysAgo;
        }
      }

      return matchesSearch && matchesSeverity && matchesDate && matchesLogType;
    });
  }, [data.logs, filters]);

  if (loading) return <Box sx={{display: 'grid', placeItems: 'center', height: '100vh'}}><CircularProgress /></Box>;
  if (error) return <Box sx={{display: 'grid', placeItems: 'center', height: '100vh'}}><Alert severity="error">Error: {error}</Alert></Box>;
  
  return(
    <div className="logContentContainer">
      <LogContainer data={filteredLogs} filters={filters} setFilters={setFilters}/>
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
          api.get("/users/me/")
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
      data={data}
      loading={data.loading} 
      error={data.error} 
    />
  )
}

export default Logs
import React, { useEffect, useState, useMemo } from 'react'
import Card from '../../components/Card/Card'
import './Anomaly.css'
import axios from 'axios'
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Paper,
  Grid,
  CircularProgress,
  Container,
  Alert,
} from "@mui/material"
import ErrorIcon from "@mui/icons-material/Error"
import api from '../../utils/api'

const AnomalyFilter = ({ anomalies = [], filters, setFilters }) => {
  const models = [...new Set(anomalies.map(a => a.model_name))].filter(Boolean)

  const handleReset = () => {
    setFilters({
      dateRange: "",
      model: "",
      severity: "",
      device: ""
    })
  }

  return(
    <Card id="anomalyFilter" title="Filter Anomalies">
      <Box className="anomalyFilterContent">
        <TextField
          select
          label="Date Range"
          value={filters.dateRange}
          onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          size="small"
        >
          <MenuItem value="allTime">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="week">Last 7 Days</MenuItem>
          <MenuItem value="month">Last 30 Days</MenuItem>
        </TextField>
        <TextField
          select
          label="Model"
          value={filters.model}
          onChange={(e) => setFilters({...filters, model: e.target.value})}
          size="small"
        >
          <MenuItem value="">All Models</MenuItem>
          {models.map(model => (
            <MenuItem key={model} value={model}>{model}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Severity"
          value={filters.severity}
          onChange={(e) => setFilters({...filters, severity: e.target.value})}
          size="small"
        >
          <MenuItem value="">All Severities</MenuItem>
          <MenuItem value="critical">Critical</MenuItem>
          <MenuItem value="warning">Warning</MenuItem>
          <MenuItem value="info">Info</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          size="small"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Box>
    </Card>
  )
}

const AnomalyList = ({data}) => {
  const [open, setOpen] = useState(false)
  const [selectedAnomaly, setSelectedAnomaly] = useState(null)

  const handleModalClick = (anomaly) => {
    setSelectedAnomaly(anomaly)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedAnomaly(null)
  }

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

  return(
    <Card title="Anomaly List" id="anomalyList">
      <Grid container spacing={3} sx={{paddingBottom: '2rem', marginTop: '0.5rem'}}>
        {data.map((anomaly) => (
          <Grid container spacing={{ xs: 3, md: 3}} columns={{ sx: 4, sm: 8, md: 12}} key={anomaly.id}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', boxShadow: 2}}>
              <Typography>Packet ID: {anomaly.packet.id}</Typography>
              <Typography>Model: {anomaly.model_name}</Typography>
              <Typography>Node: {anomaly.packet.nodeID}</Typography>
              <Typography>Detected At: {new Date(anomaly.detected_at).toLocaleString()}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleModalClick(anomaly)}
              >
                View
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalStyle}>
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2}}>
            <Typography variant="h6">
              Anomaly Information
            </Typography>
            <Button
              variant='outlined'
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
          {selectedAnomaly ? (
            <Box>
              <Typography>Model: {selectedAnomaly.model_name}</Typography>
              <Typography>Detected At: {new Date(selectedAnomaly.detected_at).toLocaleString()}</Typography>
              <Typography variant="h6" sx={{mt: 3, mb: 1}}>Flagged Packet Details</Typography>
              <Typography>Packet ID: {selectedAnomaly.packet.id}</Typography>
              <Typography>Node ID: {selectedAnomaly.packet.nodeID}</Typography>
              <Typography>Time: {new Date(selectedAnomaly.packet.time).toLocaleString()}</Typography>
              <Typography>MAC: {selectedAnomaly.packet.mac}</Typography>
              <Typography>Spreading Factor: {selectedAnomaly.packet.spreading_factor}</Typography>
              <Typography>Channel Frequency: {selectedAnomaly.packet.channel_frequency} Hz</Typography>
              <Typography>Transmission Power: {selectedAnomaly.packet.transmission_power} dBm</Typography>
              <Typography>Bandwidth: {selectedAnomaly.packet.bandwidth} Hz</Typography>
              <Typography>Coding Rate: {selectedAnomaly.packet.coding_rate}</Typography>
              <Typography>SNR: {selectedAnomaly.packet.snr} dB</Typography>
              <Typography>RSSI: {selectedAnomaly.packet.rssi} dBm</Typography>
              <Typography>Sequence Number: {selectedAnomaly.packet.sequence_number}</Typography>
              <Typography>Payload: {selectedAnomaly.packet.payload}</Typography>
              <Typography>Payload Size: {selectedAnomaly.packet.payload_size} bytes</Typography>
              <Button sx={{color: 'red', boxShadow: "2px"}}>Dismiss</Button>
            </Box>
          ) : (
            <Typography>No anomaly selected</Typography>
          )}
        </Box>
      </Modal>
    </Card>
  )
}

const AnomalyStatistics = ({data}) => {
  const totalAnomalies = data?.length || 0 ;

  return(
    <div className="anomalyStats">
      <Card title="Anomalies">
        <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <ErrorIcon />
          <Typography>{totalAnomalies} in last 24hrs</Typography>
        </Box>
      </Card>
    </div>
  )
}

const AnomalyGraph = ({data}) => {
  return(
    <Card id="anomalyGraph" title="Histogram for anomaly score">

    </Card>
  )
}

const AnomalyContent = ({data, loading, error}) => {
  const [filters, setFilters] = useState({
    dateRange: "",
    model: "",
    severity: "",
  })

  const filteredData = useMemo(() => {
    const list = data.anomalies || [];
    
    return list.filter(anomaly => {
      const matchesModel = !filters.model || anomaly.model_name === filters.model;
      
      let matchesDate = true;
      if (filters.dateRange) {
        const detectedAt = new Date(anomaly.detected_at);
        const now = new Date();
        if (filters.dateRange === 'today') {
          matchesDate = detectedAt.toDateString() === now.toDateString();
        } else if (filters.dateRange === 'week') {
          const sevenDaysAgo = new Date().setDate(now.getDate() - 7);
          matchesDate = detectedAt >= sevenDaysAgo;
        } else if (filters.dateRange === 'month') {
          const thirtyDaysAgo = new Date().setMonth(now.getMonth() - 1);
          matchesDate = detectedAt >= thirtyDaysAgo;
        }
      }

      return matchesModel && matchesDate;
    });
  }, [data.anomalies, filters]);


  if (loading){
    return(
      <Box sx={{display: 'grid', placeItems: 'center', height: '100vh'}}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return(
      <Box sx={{display: 'grid', placeItems: 'center', height: '100vh'}}>
        <Alert severity='error'>
          Error: {error}
        </Alert>
      </Box>
    )
  }

  return(
    <div className='anomalyContentContainer'>
      <AnomalyFilter anomalies={data.anomalies} filters={filters} setFilters={setFilters}/>
      <div className="anomalyContent">
        <AnomalyList data={filteredData} />
      </div>
    </div>
  )
}

const Anomaly = () => {
  const [data, setData] = useState({
    anomalies: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user] = await Promise.all([
          api.get("/users/me/")
        ])
        setData({
          anomalies: user.data.anomalies || [],
          loading: false,
          error: null
        })
      } catch (err) {
        setData(prev => ({ ...prev, loading: false, error: err.message }))
      }
    }
    fetchData()
  }, []);

  return (
    <div>
      <AnomalyContent data={data} loading={data.loading} error={data.error} />
    </div>
  )
}

export default Anomaly
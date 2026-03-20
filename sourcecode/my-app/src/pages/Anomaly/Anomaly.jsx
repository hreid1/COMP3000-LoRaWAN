import React, { useEffect, useState } from 'react'
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
} from "@mui/material"

const AnomalyCard = () => {
  return(
    <Card id="anomalyCard" title="What should be included">
      <ul>List of anomalies</ul>
      <ul>Anomaly Details</ul>
      <ul>Filter by: Date, Model, device</ul>
      <ul>Severity indicators - is an anomaly a critical, moderate or low intensity anomaly</ul>
      <ul>Actions on those anomalies - dismiss</ul>
      <ul>Graphs to show recent trends/historical data</ul>
    </Card>
    
  )
}

const AnomalyList = ({data}) => {
  const [sortBy, setSortBy] = useState("name")
  const [open, setOpen] = useState(false)
  const [selectedAnomalyID, setSelectedAnomalyID] = useState(null)

  const handleModalClick = (anomalyID) => {
    setOpen(true)
    setSelectedAnomalyID(selectedAnomalyID === anomalyID ? null: anomalyID)
  }

  const handleClose = () => setOpen(false)


  //console.log(data)

  return(
    <Card title="Anomaly List" id="anomalyList">
      <Box>
        <Grid>
          <Grid>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
              sx={{width: "25%"}}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="detected_at">Date</MenuItem>
              <MenuItem value="model">Model</MenuItem>
              <MenuItem value="node">Node</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3} sx={{paddingBottom: '2rem', marginTop: '0.5rem'}}>
        {data.map((anomaly) => (
          <Grid container spacing={{ xs: 3, md: 3}} columns={{ sx: 4, sm: 8, md: 12}} key={anomaly.id}>
            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', boxShadow: 2}}>
              <Typography>Packet ID: {anomaly.packet.id}</Typography>
              <Typography>Model: {anomaly.model_name}</Typography>
              <Typography>Detected At: {new Date(anomaly.detected_at).toLocaleString()}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleModalClick(anomaly.id)}
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
        <Box>
          <Typography>
            Anomaly Information
          </Typography>
          <Box>
          </Box>
          {selectedAnomalyID && data.filter((item) => item.anomaly_id === selectedAnomalyID).length === 0 ? (
            <Typography>
              No data found for this anomaly
            </Typography>
          ) : (
            <Box>
            </Box>
          )}
        </Box>

      </Modal>

    </Card>
  )
}

const AnomalyStatistics = () => {
  return(
    <div className="anomalyStats">
      <Card title="Hello World">

      </Card>
      <Card title="Hello World">

      </Card>
      <Card title="Hello World">

      </Card>
    </div>
  )
}

const AnomalyContent = ({data, loading, error}) => {
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
        <Alert>
          Error: {error}
        </Alert>
      </Box>
    )
  }

  return(
    <div className='anomalyContentContainer'>
      <AnomalyStatistics data={data.anomalies}/>
      <AnomalyList data={data.anomalies} />
      <AnomalyCard />
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
          axios.get("http://127.0.0.1:8000/lorawan/users/1/")
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
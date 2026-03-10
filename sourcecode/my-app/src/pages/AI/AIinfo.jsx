import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Card from '../../components/Card/Card'
import axios from 'axios'
import './AIinfo.css'
import Modal2 from '../../components/Modal/Modal'
import Example from '../../components/Charts/Graph'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';

const Graph = () => {
    return(
        <Card id="aiGraph" title="Graph">
            <Example />
        </Card>
    )
}

const Statistics = () => {
    return(
        <Card id="aiStats" title="Statistics">

        </Card>
    )
}

const AiModelContainer = () => {
  const [open, setOpen] = useState(false)
  const [selectedID, setSelectedID] = useState(null)
  const [data, setData] = useState([])
  const [historyData, setHistoryData] = useState([])
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/mlmodels/")
      .then((response) => {
        setData(response.data.results || [])
      })
      .catch((error) => {
        console.error("Error fetching models:", error)
      })
  }, [])

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/lorawan/modelpredictioninfos/")
      .then((response) => {
        setHistoryData(response.data.results || [])
      })
      .catch((error) => {
        console.error("Error fetching history:", error)
      })
  }, [])

  const handleModelClick = (modelID) => {
    setOpen(true)
    setSelectedID(selectedID === modelID ? null : modelID)
  }

  const handleClose = () => setOpen(false)

  const filteredData = data.filter(model =>
    String(model.name).toLowerCase().includes(search.toLowerCase())
  )

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '80vh',
    overflowY: 'auto'
  }

  return(
    <Card title="AI Models" id="aiModel2">
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="created_at">Date</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search models..."
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={2} sx={{paddingBottom: '1rem'}}>
        {filteredData && filteredData.map((model) => (
          <Grid item xs={12} sm={6} md={4} key={model.id}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                {model.name}
              </Typography>
              <Typography>Algorithm Type: {model.algorithm_type}</Typography>
              <Typography>Version: {model.version}</Typography>
              <Typography>Created: {new Date(model.created_at).toLocaleString()}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleModelClick(model.id)}
                sx={{ mt: 'auto' }}
              >
                View History
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
          <Typography id="modal-title" variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
            Prediction History
          </Typography>
          {selectedID && historyData.filter((item) => item.model_id === selectedID).length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No predictions found for this model
            </Typography>
          ) : (
            <Box>
              {historyData
                .filter((item) => item.model_id === selectedID)
                .map((item) => (
                  <Paper key={item.id} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography>File: {item.input_file_name}</Typography>
                    <Typography>Date: {new Date(item.predicted_at).toLocaleDateString()}</Typography>
                    <Typography>Packets Analysed: {item.num_packets}</Typography>
                    <Typography>Anomalies Detected: {item.anomalies_detected}</Typography>
                    <Typography>Accuracy: {(item.accuracy * 100).toFixed(2)}%</Typography>
                    <Typography>Precision: {(item.precision * 100).toFixed(2)}%</Typography>
                    <Typography>Recall: {(item.recall * 100).toFixed(2)}%</Typography>
                    <Typography>F1 Score: {(item.f1_score * 100).toFixed(2)}%</Typography>
                    <Typography>Silhouette Score: {(item.silhouette_score * 100).toFixed(2)}%</Typography>
                  </Paper>
                ))}
            </Box>
          )}
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Card>
  )
}

const RunModel = () => {
    const [file, setFile] = useState(null)
    const [data, setData] = useState([])
    const [error, setError]= useState("")
    const [selectedModel, setSelectedModel] = useState("IsolationForest")
    const [results, setResults] = useState([])

    function handleFileRun(event){
        if (!file){
            console.error("No File")
            return
        }
        const formData = new FormData()
        formData.append("myFile", file, file.name)
        formData.append("model", selectedModel)
        axios.post("http://localhost:8000/lorawan/run/", formData)
        .then (response => {
            console.log(response.data.performance)
            setResults(response.data.performance)
        })
    }

    function handleAddToDB(){
        if (!file){
            setError("No file selected")
            return
        }
        const formData = new formData()
        formData.append("myFile", file, file.name)
        axios.post("http://localhost:8000/lorawan/addmodel/", formData)
        .then(response => {
            console.log("File added to DB")
            setFile(null)
            setData([])
        })
        .catch(err => {
            console.error("Database upload failed")
        })
    }

    function handleFileChange(e){
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
        } else {
            setFile(null)
        }
    }

    return(
    <Card title="Run Model" id="runModel">
      <Box sx={{display: "flex", flexDirection: "column", gap: "16px"}}>
        <Button 
          variant='contained'
          component="label"
        >
          Choose file
          <input 
            hidden
            accept=".csv"
            type="file"
            onChange={handleFileChange}
          />
        </Button>
        { file && (
          <Typography variant="body2">
            Selected: {file.name}
          </Typography>
        )}
        <Select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <MenuItem value="IsolationForest">Isolation Forest</MenuItem>
          <MenuItem value="LocalOutlierFactor">Local Outlier Factor</MenuItem>
        </Select>
        <Button onClick={handleFileRun} variant='contained'>Run File</Button>
        <Button onClick={handleAddToDB} variant='contained'>Add to DB</Button>
      </Box>
    </Card>
    )
}

const AIinfoContentContainer = () => {
    return(
        <div id="aiInfoContentContainer">
            <AiModelContainer />
            <RunModel />
            <Graph />
            <Statistics />
        </div>
    )
}

const AIinfo = () => {
    return (
        <AIinfoContentContainer />
    )
}

export default AIinfo
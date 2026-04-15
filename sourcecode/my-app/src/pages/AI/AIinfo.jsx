import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Card from '../../components/Card/Card'
import axios from 'axios'
import './AIinfo.css'
import Modal2 from '../../components/unusedcomponents/Modal/Modal'
import Example from '../../components/unusedcomponents/Charts/Graph'
import Papa from 'papaparse'
import RefreshIcon from '@mui/icons-material/Refresh'
import api from '../../utils/api'

import { 
  Box,
  Button,
  Typography, 
  Modal,
  TextField,
  MenuItem,
  Paper,
  Grid,
  Container,
  Stack,
  Alert, 
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
} from "@mui/material"

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

const AiModelContainer = ({data}) => {
  const [open, setOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const handleModelClick = (model) => {
    setSelectedModel(model)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedModel(null)
  }

  const filteredData = data.models.filter(model =>
    String(model.name).toLowerCase().includes(search.toLowerCase())
  )

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
      <Grid container spacing={3} sx={{paddingBottom: '2rem', marginTop: '0.5rem'}}>
        {filteredData && filteredData.map((model) => (
          <Grid item xs={12} sm={6} lg={4} key={model.id}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: '280px', boxShadow: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                {model.name}
              </Typography>
              <Typography>Algorithm Type: {model.algorithm_type}</Typography>
              <Typography>Version: {model.version}</Typography>
              <Typography>Created: {new Date(model.created_at).toLocaleString()}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleModelClick(model)}
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
          <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <Typography id="modal-title" variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
              {selectedModel?.name || 'Model'} - Prediction History
            </Typography>
            <Button
              variant='outlined'
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
          {selectedModel && data.modelpredictions.filter((item) => item.model_id === selectedModel.id).length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No predictions found for this model
            </Typography>
          ) : (
            <Box>
              {data.modelpredictions
                .filter((item) => item.model_id === selectedModel?.id)
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
        </Box>
      </Modal>
    </Card>
  )
}

const RunModel = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState("IsolationForest"); 
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [resultsOpen, setResultsOpen] = useState(false)
  const [currentResults, setCurrentResults] = useState([])

  async function handleFileRun(event) {
    if (!file) {
      setSnackbar({
        open: true,
        message: "No file selected",
        severity: "error"
      })
      return;
    }
    const formData = new FormData()
    formData.append("myFile", file, file.name)
    formData.append("model", selectedModel)
    
    setIsLoading(true)
    try {
      const response = await api.post("run/", formData)
      console.log("Response:", response.data)
      setResults(response.data.performance)
      
      setSnackbar({
        open: true,
        message: "Model ran successfully!",
        severity: "success"
      })
    } catch (err) {
      console.error("Error running model:", err.response?.data || err.message)
      
      setSnackbar({
        open: true,
        message: err.response?.data?.detail || "Failed to run model. Please try again.",
        severity: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddToDB(){
    if (!file){
      setSnackbar({
        open: true,
        message: "No file selected",
        severity: "error"
      })
      return;
    }

    const formData = new FormData();
    formData.append("myFile", file, file.name)
    
    setIsLoading(true)
    try {
      const response = await api.post("addmodel/", formData)
      console.log("Packets added:", response.data)
      
      setSnackbar({
        open: true,
        message: `Successfully added ${response.data.packet_ids?.length || 0} packets to database!`,
        severity: "success"
      })
      
      setFile(null);
      setData([])
    } catch (err){
      console.error("Error adding to DB:", err.response?.data || err.message)
      
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Failed to add packets to database",
        severity: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  }

  function handleFileDisplay() {
    if (!file) {
      setError("No file selected");
      return;
    }

    // Create a clone for display purposes
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      if (parsedData?.[0]) {
        const rows = Object.keys(parsedData[0]);
        const columns = Object.values(parsedData[0]);
        const res = rows.reduce((acc, e, i) => [...acc, [[e], columns[i]]], []);
        setData(res);
      }
    };
    reader.readAsText(file); // This reads a copy, not the original
  }

  return(
    <Card id="runModel" title="Run Model">
      <div className="btn-column">
        <input type="file" onChange={handleFileChange} disabled={isLoading}/>
        
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={isLoading}>
          <option value="IsolationForest">Isolation Forest</option>
          <option value="LocalOutlierFactor">Local Outlier Factor</option>
        </select>
        
        <button onClick={handleFileDisplay} disabled={isLoading}>Display File</button>
        <button onClick={handleFileRun} disabled={isLoading}>Run File</button>
        <button onClick={handleAddToDB} disabled={isLoading}>Add to DB</button>
      </div>
      
      {isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', my: 3 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Running model on file...
          </Typography>
        </Box>
      )}
      <div>
        {error 
          ? error
          : !isLoading && data.map((e, i) => (
            <div key={i} className='item'>
              {e[0]}:{e[1]}
            </div>
          ))
        }
      </div>
      {!isLoading && (
        <Snackbar
          open={snackbar.open}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center", marginTop: "2rem" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Card>
  )
}

const AIinfoContentContainer = ({data, loading, error}) => {
  if (loading) {
    return(
      <Box sx={{display: 'grid', placeItems: 'center', height: '100vh'}}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{display: 'grid', placeItems: 'center', height: '100vh'}}>
        <Alert severity='error' sx={{fontWeight: 'bold'}}>
          Error: {error}
        </Alert>
      </Box>
    )
  }

  return(
    <div id="aiInfoContentContainer">
      <AiModelContainer data={data}/>
      <RunModel />
    </div>
  )
}

const AIinfo = () => {
  const [data, setData] = useState({
    models: [],
    modelpredictioninfos: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mlmodels, modelpredictions] = await Promise.all([
          api.get("/mlmodels/"),
          api.get("/users/me/")
        ])
        setData({
          models: mlmodels.data.results,
          modelpredictions: modelpredictions.data.modelpredictioninfos,
        })
      } catch (err) {
        setData(prev => ({ ...prev, loading: false, error: err.message}))
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <AIinfoContentContainer data={data} loading={data.loading} error={data.error}/>
    </>
  )
}

export default AIinfo
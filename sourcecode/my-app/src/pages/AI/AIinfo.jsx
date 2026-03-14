import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Card from '../../components/Card/Card'
import axios from 'axios'
import './AIinfo.css'
import Modal2 from '../../components/Modal/Modal'
import Example from '../../components/Charts/Graph'
import Papa from 'papaparse'

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

const AiModelContainer = ({}) => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [selectedID, setSelectedID] = useState(null)
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
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState("IsolationForest"); 
  const [results, setResults] = useState([]);

  function handleFileRun(event){
    if (!file) {
      console.error("No File")
      return;
    }
    const formData = new FormData()
    formData.append("myFile", file, file.name)
    formData.append("model", selectedModel) 
    axios.post("http://127.0.0.1:8000/lorawan/run/", formData)
    .then (response => {
      console.log(response.data.performance)
      setResults(response.data.performance)
    })
  }


  function handleAddToDB(){
    if (!file){
      setError("No file selected")
      return;
    }

    const formData = new FormData();
    formData.append("myFile", file, file.name)

    axios.post("http://127.0.0.1:8000/lorawan/addmodel/", formData)
    .then(response => {
      console.log("File added to DB")
      setFile(null);
      setData([]);
    })
    .catch(err => {
      console.error("Database upload failed")
    })
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
    <Card id="networkTraffic" title="Network Traffic">
      <div className="btn-column">
        <input type="file" onChange={handleFileChange}/>
        
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="IsolationForest">Isolation Forest</option>
          <option value="LocalOutlierFactor">Local Outlier Factor</option>
        </select>
        
        <button onClick={handleFileDisplay}>Display File</button>
        <button onClick={handleFileRun}>Run File</button>
        <button onClick={handleAddToDB}>Add to DB</button>
      </div>
      <div>
        {error 
          ? error
          : data.map((e, i) => (
            <div key={i} className='item'>
              {e[0]}:{e[1]}
            </div>
          ))
        }
      </div>
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
      <Graph />
      <Statistics />
    </div>
  )
}

const AIinfo = () => {
  const [data, setData] = useState({
    models: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aimodels] = await Promise.all([
          axios.get("http://127.0.0.1:8000/lorawan/mlmodels/")
        ])
        setData({
          models: aimodels.data.results,
          loading: false,
          error: null
        })
      } catch (err) {
        setData(prev => ({ ...prev, loading:false, error: err.message}))
      }
    }
    fetchData()
  }, []);

  return (
    <>
      <AIinfoContentContainer data={data} loading={data.loading} error={data.error}/>
    </>
  )
}

export default AIinfo
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Card from '../../components/Card/Card'
import axios from 'axios'
import './AIinfo.css'
import Modal from '../../components/Modal/Modal'
import Example from '../../components/Charts/Graph'

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
    const [data, setData] = useState([]);
    const [selectedID, setSelectedID] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("name")

    useEffect(() => {
      axios
        .get("http://127.0.0.1:8000/lorawan/mlmodels/")
        .then((response) => {
          setData(response.data.results || []);
        })
        .catch((error) => {
          console.error("Error fetching models:", error);
        });
    }, []);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/lorawan/modelpredictioninfos/")
            .then((response) => {
                setHistoryData(response.data.results || [])
            })
    }, []);

    const handleModalClick = (modelID) => {
        // Set open
        setIsOpen(true)
        setSelectedID(modelID)
        console.log(selectedID)

    }

    const filteredData = data.filter(model => 
        String(model.name).includes(search)
    )

    return (
      <Card title="AI Models">
        <div id="aiModelContainer">
          <div className="aiModelListControls">
            <select
              className="aiModelSort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by: Name</option>
              <option value="created_at">Sort by: Date</option>
            </select>
            <input
              className="aiModelSearch"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="aiModelGrid">
            {filteredData &&
              filteredData.map((model) => (
                <Card key={model.id} title={model.name} id="aiModelInfo">
                  <p>Name: {model.name}</p>
                  <p>Algorithm Type: {model.algorithm_type}</p>
                  <p>Algorithm Version: {model.version}</p>
                  <p>
                    Created at: {new Date(model.created_at).toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedID(selectedID === model.id ? null : model.id);
                    }}
                  >
                    View
                  </button>
                </Card>
              ))}
          </div>
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <h2>Prediction History</h2>
            {selectedID &&
            historyData.filter((item) => item.model_id === selectedID)
              .length === 0 ? (
              <p>No predictions found for this model</p>
            ) : (
              historyData
                .filter((item) => item.model_id === selectedID)
                .map((item) => (
                  <div key={item.id} className="aiHistoryItem">
                    <p>File: {item.input_file_name}</p>
                    <p>
                      Date: {new Date(item.predicted_at).toLocaleDateString()}
                    </p>
                    <p>Packets Analysed: {item.num_packets}</p>
                    <p>Anomalies Detected: {item.anomalies_detected}</p>
                    <p>Accuracy: {(item.accuracy * 100).toFixed(2)}</p>
                    <p>Precision: {(item.precision * 100).toFixed(2)}</p>
                    <p>Recall: {(item.recall * 100).toFixed(2)}</p>
                    <p>F1 Score: {(item.f1_score * 100).toFixed(2)}</p>
                    <p>
                      Silhouette Score:{" "}
                      {(item.silhouette_score * 100).toFixed(2)}
                    </p>
                  </div>
                ))
            )}
          </Modal>
        </div>
      </Card>
    );
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
    <Card title="Run Model">
      <div className="btn-column">
        <input type="file" onChange={handleFileChange}/>
        
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="IsolationForest">Isolation Forest</option>
          <option value="LocalOutlierFactor">Local Outlier Factor</option>
        </select>
        
        <button onClick={handleFileRun}>Run File</button>
        <button onClick={handleAddToDB}>Add to DB</button>
      </div>
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
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Navbar from '../../components/Navbar/Navbar'
import SideNavbar from '../../components/Navbar/SideNavbar'
import Card from '../../components/Card/Card'
import axios from 'axios'
import './AIinfo.css'

const Graph = () => {
    return(
        <Card id="aiGraph" title="Graph">
        </Card>
    )
}

const ModelRetraining = () => {
    return(
        <Card id="modelRetraining" title="Model Retraining">

        </Card>
    )
}

const Statistics = () => {
    return(
        <Card id="aiStats" title="Statistics">

        </Card>
    )
}


const AddModel = () => {
    const [modelName, setModelName] = useState("")
    const [modelVersion, setModelVersion] = useState("")
    const [modelType, setModelType] = useState("")

    function handleAddModel(e){
        e.preventDefault()
        axios.post("http://localhost:8000/lorawan/mlmodels/", {
            name: modelName,
            version: modelVersion,
            algorithm_type: modelType,
        })
        .then(response => {
            console.log("Model added successfully:", response.data);
            setModelName("");
            setModelVersion("");
            setModelType("");
        })
        .catch(error => {
            console.error("Error adding model:", error);
        });
    }

    return(
        <Card id="addModel" title="Add Model">
            <form onSubmit={handleAddModel} className="addModelContainer">
                <label>
                    Model Name
                    <input 
                        type="text" 
                        value={modelName}
                        onChange={e => setModelName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Model Version
                    <input 
                        type="number" 
                        value={modelVersion}
                        onChange={e => setModelVersion(e.target.value)}
                    />
                </label>
                <label>
                    Model Type
                    <input 
                        type="text"
                        value={modelType}
                        onChange={e => setModelType(e.target.value)}
                     />
                </label>
                <input type="submit" value="Add Model" />
            </form>
        </Card>
    )
}

const AiModelContainer = () => {
    const [data, setData] = useState([]);
    const [selectedID, setSelectedID] = useState(null);
    const [historyData, setHistoryData] = useState([]);

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


    console.log(historyData)

    return (
      <div id="aiModelContainer">
        <div className="aiModelInfoContainerSearchbar">
          <span>Sort By</span>
          <span>Filter By</span>
          <span>Search</span>
        </div>
        <div className="aiModelGrid">
          {data &&
            data.map((model) => (
              <Card key={model.id} title={model.name} id="aiModelInfo">
                <p>Name: {model.name}</p>
                <p>Algorithm Type: {model.algorithm_type}</p>
                <p>Algorithm Version: {model.version}</p>
                <p>Created at: {new Date(model.created_at).toLocaleString()}</p>
                <button onClick={() => setSelectedID(selectedID === model.id ? null : model.id)}>
                  {selectedID === model.id ? 'Close' : 'View History'}
                </button>
                {selectedID === model.id && (
                  <div className="aiHistoryMenu">
                    <h4>Previous Runs</h4>
                    {historyData.filter(item => item.model_id === model.id).length === 0 ? (
                      <p>No predictions found for this model.</p>
                    ) : (
                      historyData
                        .filter(item => item.model_id === model.id)
                        .map(item => (
                          <div key={item.id} className="aiHistoryItem">
                            <p>File:{item.input_file_name}</p>
                            <p>Date: {new Date(item.predicted_at).toLocaleString()}</p>
                            <p>Packets Analyzed: {item.num_packets}</p>
                            <p>Anomalies Detected: {item.anomalies_detected} ({item.anomaly_percentage.toFixed(2)}%)</p>
                            {item.accuracy && (
                              <p>Accuracy: {(item.accuracy * 100).toFixed(2)}%</p>
                            )}
                            <p>Precision: {(item.precision * 100).toFixed(2)}%</p>
                            <p>Recall: {(item.recall * 100).toFixed(2)}%</p>
                            <p>F1 Score: {(item.f1_score* 100).toFixed(2)}%</p>
                            <p>Silhouette Score: {(item.silhouette_score * 100).toFixed(2)}%</p>
                          </div>
                        ))
                    )}
                  </div>
                )}
              </Card>
            ))}
        </div>
      </div>
    );
}

const AIinfoContentContainer = () => {
    return(
        <div id="aiInfoContentContainer">
            <AddModel />
            <ModelRetraining />
            <AiModelContainer />
            <Graph />
            <Statistics />
        </div>
    )
}

const AIinfo = () => {
    return (
        <div id="aiContainer">
            <Navbar />
            <SideNavbar />
            <AIinfoContentContainer />
        </div>
    )
}

export default AIinfo
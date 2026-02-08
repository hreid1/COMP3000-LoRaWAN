import React, { useState } from 'react'
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

const AImodel = ({ model_name, version, accuracy, precision, f1score, recall, silhouette }) => {
    return(
        <Card title="AI Model Info">
            <div className="aimodelinfo">
                <p>Model Name: {model_name}</p>
                <p>Version: {version}</p>
                <p>Model Type: Unsupervised</p>
                <p>Last Used: 01/01/2001 14:42:38</p>
            </div>
            <h4>Performance Metrics</h4>
            <div className="aimodelperformance">
                <p>Accuracy: {accuracy}</p>
                <p>Precision: {precision}</p>
                <p>F1 Score: {f1score}</p>
                <p>Recall: {recall}</p>
                <p>Silhouette Score: {silhouette}</p>
            </div>
        </Card>
    )
}

const ModelRetraining = () => {
    return(
        <Card id="aiModelRetraining" title="Model Retraining">
        </Card>
    )
}

const Statistics = () => {
    return(
        <Card id="aiStats" title="Information">
        </Card>
    )
}

const ViewExistingModels = () => {
    return (
        <Card className="test" title="Existing models">
        </Card>
    )
}

const AIinfoContentContainer = () => {
    const models = [
        { id: 1, model_name: "Isolation Forest", version: "1.0", accuracy: "95.2%", precision: "0.94", recall: "0.90", f1score: "0.92", silhouette: "0.85" },
        { id: 2, model_name: "Local Outlier Factor", version: "1.0", accuracy: "92.1%", precision: "0.91", recall: "0.87", f1score: "0.89", silhouette: "0.82" },
        { id: 3, model_name: "Local Outlier Factor", version: "1.0", accuracy: "92.1%", precision: "0.91", recall: "0.87", f1score: "0.89", silhouette: "0.82" },
        { id: 4, model_name: "Local Outlier Factor", version: "1.0", accuracy: "92.1%", precision: "0.91", recall: "0.87", f1score: "0.89", silhouette: "0.82" },
    ]

    return(
        <div className="aiInfoContentContainer">
            <AddModel />
            <ModelRetraining />
            <div id="aiModelInfoGrid">
                {models.map(model => (
                    <AImodel 
                        key={model.id}
                        model_name={model.model_name}
                        version={model.version}
                        accuracy={model.accuracy}
                        precision={model.precision}
                        recall={model.recall}
                        f1score={model.f1score}
                        silhouette={model.silhouette}
                    />
                ))}
            </div>
            <ViewExistingModels />
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
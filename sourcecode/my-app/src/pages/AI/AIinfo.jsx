import React, { useEffect, useState } from 'react'
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

const AImodel = ({ data }) => {
    
    return(
        <div id="aiModelInfoContainer">
            {data && data.map(model => (
                <Card key ={model.id} id="aiModelInfo" title="AI Model Info">
                    <p>Model Name: {model.name} </p>
                    <p>Version: {model.version}</p>
                    <p>Model Type: {model.algorithm_type}</p>
                    <p>Created At: {new Date(model.created_at).toLocaleString()}</p>
                </Card>
            ))}
        </div>
    )
}

const AIinfoContentContainer = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/lorawan/mlmodels/")
        .then((response) => {
            setData(response.data.results || []);
        })
        .catch(error => {
            console.error("Error fetching models:", error);
        })
    }, []);


    return(
        <div id="aiInfoContentContainer">
            <AddModel />
            <ModelRetraining />
            <AIInfo2 />
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
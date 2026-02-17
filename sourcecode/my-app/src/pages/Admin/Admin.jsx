import React, {useState} from 'react'
import './Admin.css'
import Card from '../../components/Card/Card'
import axios from 'axios'

const ModelRetraining = () => {
    return(
        <Card id="modelRetraining" title="Model Retraining">
            <span>Retraining specific models - changing modelTrainingInfo </span>
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
        <Card id="addModel" title="Add ML Model">
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

const ManageUsers = () => {
    return(
        <Card id="manageUsers" title="User Management">
            <span>CRUD on users and roles</span>
            <ul></ul>
        </Card>

    )
}

const ManageModels = () => {
    return(
        <Card title="Model Management">
            <ul>Adjusting threshold/parameters of models</ul>
            <ul>Export data</ul>
        </Card>
    )
}

const ManageSystem = () => {
    return(
        <Card title="System Management">
            <ul>System status indicator</ul>
            <ul></ul>

        </Card>
    )
}

const AdminContent = () => {
    return(
        <div id="adminContentContainer">
            <AddModel />
            <ModelRetraining />
            <ManageUsers />
            <ManageModels />
            <ManageSystem />
        </div>
    )
}


const Admin = () => {
  return (
    <div>
        <AdminContent />
    </div>
  )
}

export default Admin
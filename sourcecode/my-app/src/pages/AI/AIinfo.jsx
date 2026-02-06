import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import SideNavbar from '../../components/Navbar/SideNavbar'
import Card from '../../components/Card/Card'
import './AIinfo.css'

const Graph = () => {
    return(
        <Card id="aiGraph" title="Graph">
            <div>
                Graph placeholder
            </div>
        </Card>
    )
}

const AddModel = () => {
    return(
        <Card id="addModel" title="Add Model">
            <div>
                Add Model placeholder
            </div>
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
            <p>Ability to retrain the models by uploading a file, gives a progress bar similar to Matlab progress chart</p>
        </Card>
    )
}

const Statistics = () => {
    return(
        <Card id="aiStats" title="Information">
            <div>
                <p>Active Model: Isolation Forest</p>
                <p>Files searched: 197,955</p>
                <p>Anomalies Detected: 33,537</p>
                <p>Type of Anomalies Detected: Jammer Attack</p>
            </div>
        </Card>
    )
}

const ViewExistingModels = () => {
    return (
        <Card className="test" title="Existing models">
            <p>Maybe add a button to view all existing models</p>
            <p>?</p>
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
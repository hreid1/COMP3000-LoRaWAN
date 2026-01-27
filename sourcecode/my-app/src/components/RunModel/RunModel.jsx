import './RunModel.css'
import axios from 'axios'

// Responsible for running model on dataset
    // Multi-action button pointing to each of the models: isolation forest, local outlier factor and autoencoder (TBC)
    // Set States for 
const RunModel = ({ file }) => {

    function handleIF(){
        const formData = new FormData
        formData.append("file", file)
        axios.get("http://localhost:8000/lorawan/run/if/")
        .then (response => {
            console.log(response);
        })
    }

    return(
        <>
            <button>Pick Model</button>
            <div>
                <button onClick={handleIF}>Isolation Forest</button>
                <button>Local Outlier Factor</button>
                <button>Autoencoder</button>
            </div>
        </>
    )
}

export default RunModel
import { useState } from 'react'
import React from 'react'
import axios from 'axios'

const Devices = () => {

    const[loading, setLoading] = useState(false)
    const[data, setData] = useState(false)

    const model = async () => {
        setLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/lorawan/run-model/");
            setData(response.data);
        } catch(error) {
            console.error("Error loading model")
        } finally {
            setLoading(false)
        }
    }


    return (
      <div>
        <span>This is the devices page</span>
        <div>
          <button onClick={model} disabled={loading}>
            {loading ? "Running Analysis..." : "Run Isolation Forest"}
          </button>

          {data && (
            <div style={{ marginTop: "20px" }}>
              <h3>Results:</h3>
              <p>Accuracy: {data.accuracy}</p>
              <p>Anomalies: {data.anomalies_detected}</p>
            </div>
          )}
        </div>
      </div>
    );
}

export default Devices
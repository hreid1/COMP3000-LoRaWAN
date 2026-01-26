import React from 'react'
import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import Papa from 'papaparse'
import './Dashboard.css'
import SideNavbar from '../../components/Navbar/SideNavbar'
import Navbar from '../../components/Navbar/Navbar'
import Dots from '../../assets/dots.svg'
import useNetworkTraffic from '../../hooks/useNetworkTraffic'
import UploadFile from '../../hooks/test'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js/auto'
import { Data } from '../../utils/Data'
import { BarChart } from '../../components/Charts/Graph'

Chart.register(CategoryScale);

const DeviceList = ({ data }) => {
  const numOfNodes = useMemo(() => {
    return new Set(data.map(row => row.NodeID).filter(Boolean)).size;
  }, [data]);

  //console.log("Unique Nodes: ", numOfNodes);

  const isEmpty = data.length != 0;

  return(
    <div id="deviceList" className="dashCard">
      <div className='marker'></div>
      <div className="cardHeader">
        <span className="cardTitle">Device List</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        { isEmpty && (
          <span>Number of Nodes: {numOfNodes}</span>
        )}
      </div>
    </div>
  )
}

const AnomalyList = ({ data }) => {

  const isEmpty = data && typeof data.num_anomalies !== "undefined";
  //console.log(isEmpty)

  return(
    <div id="anomalyList" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Anomaly List</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        { isEmpty && (
          <span>Number of anomalies: {data.num_anomalies}</span>
        )}
      </div>
    </div>
  )
}

const Announcements = ({ data }) => {

  // Checks if the data2 array is empty: if it is it wont render the content
  const isEmpty = data && typeof data.num_anomalies !== "undefined";

  //console.log(data.top_anomaly_node)
  //console.log(data.top_anomaly_node_anomalies)

  return(
    <div id="announcements" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Recent Alerts</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        { isEmpty && (
          <div>
            <span>Node {data.top_anomaly_node} contains {data.top_anomaly_node_anomalies} anomalies</span> 
          </div>
        )}
      </div>
    </div>
  )
}

const NetworkTraffic = ({ data, error, loading, data2, handleFileChange, handleParse, model }) => {
  
  return (
    <div id="networkTraffic" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Dataset</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        <div className="btnContainer">
          <input
            onChange={handleFileChange}
            id="csvInput"
            name="file"
            type="file"
          />
          <button onClick={handleParse}>Parse</button>
          <button onClick={model} disabled={loading}>
            {loading ? "Running Analysis" : "Run Isolation Forest"}
          </button>
        </div>
        <div style={{ marginTop: "1rem" }}>
          {error
            ? error
            : data.length > 0 && (
                <table className="networkTable">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.keys(row).map((key) => (
                          <td key={key + rowIndex}>{row[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
        </div>
      </div>
    </div>
  );
}

const TrafficScore = ({ data }) => {
  // If number of anomalies > 100 -> Bad -> Show red colour
  // 100 > If number of anomalies > 55 -> Moderate -> Show orange colour
  // 55 > Num of anomalies -> Good -> Show green colour
  // jammer.csv -> 33537 anomalies
  // no-jammer.csv

  const handleTrafficScore = (num) => {
    if (num > 30000) {
      return {label: "Bad", color: "red"};
    } else if (num > 100) {
      return {label: "Moderate", color: "orange"};
    } else {
      return {label: "Good", color: "green"};
    }
  }

  // The card content of traffic score will only show when the user has successfully uploaded a file and ran the model
  const hasResults = data && typeof data.num_anomalies !== 'undefined';
  const score = hasResults ? handleTrafficScore(data.num_anomalies) : { label: '', color: '' };

  return(
    <div id="trafficScore" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Traffic Score</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        {hasResults && (
          <div>
            <span style={{ color: score.color, fontWeight: "bold", padding: "10px" }}>
              {score.label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const Graph = ({ data }) => {
  // From networktraffic.data: Count the number of different NodeID's to get a number of Nodes at play
  // Also want to count the number of records per node
  // And then display top 

  const nodeCounts = data.reduce((acc, item) => {
    if (item.NodeID) {
      acc[item.NodeID] = (acc[item.NodeID] || 0) + 1;
    }
    return acc;
  }, {});

  const sortedNodes = Object.entries(nodeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4); 

  const labels = sortedNodes.map(([nodeID]) => nodeID);
  const counts = sortedNodes.map(([_, count]) => count);

  const [chartData, setChartData] = useState({
    labels,
    datasets: [
      {
        label: "Records per NodeID (Top 4)",
        data: counts,
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f"
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

  // When the chart updates
  useEffect(() => {
    setChartData({
      labels,
      datasets: [
        {
          label: "Records per NodeID (Top 4)",
          data: counts,
          backgroundColor: [
            "rgba(75,192,192,1)",
            "#ecf0f1",
            "#50AF95",
            "#f3ba2f"
          ],
          borderColor: "black",
          borderWidth: 2
        }
      ]
    });
  }, [data]);

  return (
    <div id="graph" className="dashCard">
      <div className="marker"></div>
      <div className="cardHeader">
        <span className="cardTitle">Graph</span>
        <img src={Dots} alt="Dots" className="dots" />
      </div>
      <div className="cardContent">
        <BarChart chartData={chartData} />
      </div>
    </div>
  );
}

const MainDashContent = (props) => {
  const networkTraffic = useNetworkTraffic();
  //

  // networkTraffic.data contains information from csv file
  //console.log(networkTraffic.data)

  return (
    <div className='dashContentContainer'>
      <DeviceList data={networkTraffic.data}/>
      <AnomalyList data={networkTraffic.data2}/>
      <Announcements data={networkTraffic.data2}/>
      <NetworkTraffic data={networkTraffic.data} 
        error={networkTraffic.error} 
        loading={networkTraffic.loading} 
        data2={networkTraffic.data2}
        handleFileChange={networkTraffic.handleFileChange}
        handleParse={networkTraffic.handleParse}
        model={networkTraffic.model}
      />
      <TrafficScore data={networkTraffic.data2}/>
      <Graph data={networkTraffic.data}/>
    </div>
  )
}


const Dashboard = () => {
  return (
    <div id="dashContainer">
      <Navbar />
      <SideNavbar />
      <MainDashContent />
    </div>
  );
}

export default Dashboard
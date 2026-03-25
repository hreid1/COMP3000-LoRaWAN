import React, { useEffect } from "react";
import { useState } from "react";
import './Logs.css'
import Card from '../../components/Card/Card';
import axios from "axios";

const LogItem = ({}) => {

  return (
    <div>

    </div>

  )
}

const LogContent = ({}) => {
  
  return(
    <div className="logContentContainer">
      <Card title="System Logs">
      </Card>
    </div>
  )
}

const Logs = () => {
  const [data, setData] = useState({
    logs: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logs] = await Promise.all([
          axios.get("http://127.0.0.1:8000/lorawan/logs/")
        ])
        console.log(logs)
        setData({
          logs: logs.data.results || [],
          loading: false,
          error: null
        })
      } catch (err) {
        setData(prev => ({ ...prev, loading: false, error: err.message}))
      }
    }
    fetchData()
  }, [])  

  return(
    <LogContent logs={data.logs} loading={data.loading} error={data.error} />
  )
}

export default Logs
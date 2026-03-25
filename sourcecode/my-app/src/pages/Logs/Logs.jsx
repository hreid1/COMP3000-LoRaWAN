import React, { useEffect } from "react";
import { useState } from "react";
import './Logs.css'
import Card from '../../components/Card/Card';
import axios from "axios";

const LogItem = ({ log }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      info: "#3b82f6",
      warning: "#f59e0b",
      error: "#ef4444",
      debug: "#8b5cf6"
    };
    return colors[severity] || "#6b7280";
  };

  return (
    <div style={{
      padding: "12px",
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "#f9fafb",
      marginBottom: "0"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div style={{ flex: 1, }}>
          <p style={{ margin: "0 0 4px 0", fontWeight: "600", fontSize: "14px", color: "#1f2937" }}>
            {log.title}
          </p>
          <p style={{ margin: "0", fontSize: "13px", color: "#6b7280" }}>
            {log.description}
          </p>
        </div>
        <span style={{
          padding: "3px 10px",
          borderRadius: "4px",
          backgroundColor: getSeverityColor(log.severity),
          color: "white",
          fontSize: "11px",
          fontWeight: "500",
          whiteSpace: "nowrap",
          marginLeft: "8px"
        }}>
          {log.severity}
        </span>
      </div>
      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
        Type: {log.log_type}
      </div>
      <div style={{ fontSize: "12px", color: "#9ca3af" }}>
        Time: {log.created_at}
      </div>
    </div>
  )
}

const LogContent = ({ logs, loading, error }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      info: "#3b82f6",
      warning: "#f59e0b",
      error: "#ef4444",
      debug: "#8b5cf6"
    };
    return colors[severity] || "#6b7280";
  };

  if (loading) {
    return (
      <div className="logContentContainer">
        <p>Loading logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logContentContainer">
        <p style={{ color: "#ef4444" }}>Error: {error}</p>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="logContentContainer">
        <p>No logs available</p>
      </div>
    );
  }

  return(
    <div className="logContentContainer">
      <Card title="System Logs">
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          maxHeight: "600px",
          overflowY: "auto"
        }}>
          {logs.map((log) => (
            <LogItem key={log.id} log={log} />
          ))}
        </div>
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
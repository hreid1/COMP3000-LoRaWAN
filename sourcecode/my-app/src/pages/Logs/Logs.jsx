import React from "react";
import { useState } from "react";
import './Logs.css'
import Card from '../../components/Card/Card';

const LogItem = () => {
  return (
    <Card title="Log Card">
      <span>Hello Test</span>
    </Card>
  )
}

const LogContent = () => {
  return(
    <div className="logContentContainer">
      <LogItem />

    </div>
  )
}

const Logs = () => {
  return(
    <LogContent />
  )
}

export default Logs
import React from 'react'
import Card from '../../components/Card/Card'

const AnomalyContent = () => {

  return(
    <Card title="What should be included">
      <ul>List of anomalies</ul>
      <ul>Anomaly Details</ul>
      <ul>Filter by: Date, Model, device</ul>
      <ul>Severity indicators - is an anomaly a critical, moderate or low intensity anomaly</ul>
      <ul>Actions on those anomalies - dismiss</ul>
      <ul>Graphs to show recent trends/historical data</ul>
    </Card>
  )
}

const Anomaly = () => {
  return (
    <div>
      <AnomalyContent />
    </div>
  )
}

export default Anomaly
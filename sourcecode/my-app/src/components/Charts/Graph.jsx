import { Bar } from "react-chartjs-2";

export const BarChart = ({ chartData }) => {
    return (
        <div className="chart-container" style={{ height: "100%", minHeight: 0 }}>
            <h2 style={{ textAlign: "center"}}>Nodes sending the most records</h2>
            <Bar 
                data={chartData}
                options= {{
                    maintainAspectRatio: false, 
                    plugins: {
                        title: {
                            display: true,
                            text: "X"
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
                height={250}
            />
        </div>
    )
}
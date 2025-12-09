import { Bar } from "react-chartjs-2";

export const BarChart = ({ chartData }) => {
    return (
        <div className="chart-container" style={{ height: "100%", minHeight: 0 }}>
            <h2 style={{ textAlign: "center"}}>Bar Chart</h2>
            <Bar 
                data={chartData}
                options= {{
                    maintainAspectRatio: false, // <-- important for responsive height
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
                height={250} // <-- ensures the chart fits the card
            />
        </div>
    )
}
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement, 
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
    responsive: true,
    plguins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.JS Bar Chart'
        }
    }
};

const labels = ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            backgroundColor: 'rgba(53, 162, 235, 0.5'
        }
    ]
}

export function Map() {
    return <Bar options={options} data={data} />
}
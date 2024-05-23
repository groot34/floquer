import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const getChartData = (salaries) => {
    return {
        labels: salaries.map((salary) => salary.year),
        datasets: [
            {
                label: 'Average Salary (USD)',
                data: salaries.map((salary) => salary.averageSalary),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
                tension: 0.1
            }
        ]
    };
};

export const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: true,
            text: 'ML Engineer Salaries from 2020 to 2024'
        }
    },
    maintainAspectRatio: false
};

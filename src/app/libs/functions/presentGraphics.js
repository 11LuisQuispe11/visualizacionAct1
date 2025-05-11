// import { LineChart } from '../charts/lineChart.js';
import { PieChart } from '../charts/pieChart.js';
// import { AreaChart } from '../charts/areaChart.js';
import { BarChart } from '../charts/barChart.js';
import { CSVHandler } from '../data/csvHandler.js';
import { initializeTable } from './createTable.js';
import { HistogramChart } from '../charts/histogramChart.js';

// Initialize loading states
document.getElementById('container-line').innerHTML = 'Loading';
document.getElementById('container-pie').innerHTML = 'Loading';
// document.getElementById('container-area').innerHTML = 'Loading';
document.getElementById('container-bars').innerHTML = 'Loading';
document.getElementById('container-histogram').innerHTML = 'Loading';
document.getElementById('sales-table').innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

// Initialize data handlers and visualizations
const csvSales = new CSVHandler('/src/app/libs/data/sales.csv');

// Create table
initializeTable();

// Initialize charts
csvSales.extractDataFromSales().then(data => {
    // Initialize pie chart
    document.getElementById('container-pie').innerHTML = '';
    const pieChart = new PieChart(data);
    pieChart.styles = {
        width: 500,
        height: 500,
    };
    pieChart.initChart('container-pie');
    document.getElementById('container-bars').innerHTML = '';
    const barChart = new BarChart(data);
    barChart.style = {
        height: 700,
        width: 900,
    }
    barChart.initChart('container-bars');
    const histogramChart = new HistogramChart(data);

    histogramChart.initChart('container-histogram');
}).catch(error => {
    console.error("Error extracting data:", error);
})
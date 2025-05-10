
import { LineChart } from '../charts/lineChart.js';
import { PieChart } from '../charts/pieChart.js';
import { AreaChart } from '../charts/areaChart.js';
import { BarChart } from '../charts/barChart.js';
import { CSVHandler } from '../data/csvHandler.js';

const csvSales = new CSVHandler('./src/app/libs/data/sales.csv');
csvSales.extractData().then(data => {

})
// csvHandler.extractData().then(data => {
//     // Initialize charts with the loaded data
//     const lineChart = new LineChart(data);
//     const pieChart = new PieChart(data);
//     const areaChart = new AreaChart(data);
//     const barChart = new BarChart(data);
// }).catch(error => {
//     console.error('Error loading data for charts:', error);
// });
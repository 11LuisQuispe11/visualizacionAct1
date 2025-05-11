import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { D3Table } from '../table/table.js';
import { CSVHandler } from '../data/csvHandler.js';

// Load CSV and render table
export function createTableFromCSV(csvPath, selector) {
    // Show loading state
    const container = document.getElementById(selector);
    if (container) {
        container.innerHTML = '<tr><td colspan="3">Loading data...</td></tr>';
    }

    const csvHandler = new CSVHandler(csvPath);
    csvHandler.extractDataFromSales()
        .then(data => {
            if (!data || data.length === 0) {
                throw new Error('No data received from CSV');
            }

            const table = new D3Table({ 
                containerId: selector,
                columns: ['Store', 'Weekly_Sales']
            });
            table.render(data);
        })
        .catch(error => {
            console.error('Error loading CSV:', error);
            if (container) {
                container.innerHTML = '<tr><td colspan="3">Error loading data. Please try again.</td></tr>';
            }
        });
}

// Let's update the path to be relative to the server root
export function initializeTable() {
    createTableFromCSV('/src/app/libs/data/sales.csv', 'sales-table');
}
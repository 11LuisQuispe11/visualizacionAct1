import { CSVHandler } from '../data/csvHandler.js';
import { Counter } from '../counters/counter.js';

const csvHandler = new CSVHandler("src/app/libs/data/sales.csv");

csvHandler
    .extractDataFromSales()
    .then((data) => {
        // Calculate totals
        const totalSales = data.length
        const uniqueStores = new Set(data.map(row => row.Store)).size;
        const features = data.reduce((acc, row) => acc + row.Weekly_Sales, 0);

        // Initialize counters
        const salesCount = new Counter();
        const storeCount = new Counter();
        const featureCount = new Counter();

        // Update counters with real data
        salesCount.countUp({from: 0, to: totalSales, duration: 1000, id: 'sales-count'});
        storeCount.countUp({from: 0, to: uniqueStores, duration: 1000, id: 'store-count'});
        featureCount.countUp({from: 0, to: features, duration: 1000, id: 'feature-count'});
    })
    .catch((error) => {
        console.error("Error extracting data:", error);
    });
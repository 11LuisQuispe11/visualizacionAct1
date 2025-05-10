import { CSVHandler } from '../data/csvHandler.js';
import { Counter } from '../counters/counter.js';

console.log("Modules loaded successfully");

const csvHandler = new CSVHandler("src/app/libs/data/sales.csv");
console.log("CSVHandler instance created:", csvHandler);

csvHandler
    .extractData()
    .then((data) => {
        console.log("Data extracted:", data);

        // Calculate totals
        const totalSales = data.reduce((sum, row) => sum + row.Weekly_Sales, 0);
        const uniqueStores = new Set(data.map(row => row.Store)).size;
        const features = Object.keys(data[0]).length;

        // Initialize counters
        const salesCount = new Counter();
        const storeCount = new Counter();
        const featureCount = new Counter();

        // Update counters with real data
        salesCount.countUp({from: 0, to: Math.round(totalSales), duration: 2000, id: 'sales-count'});
        storeCount.countUp({from: 0, to: uniqueStores, duration: 2000, id: 'store-count'});
        featureCount.countUp({from: 0, to: features, duration: 2000, id: 'feature-count'});
    })
    .catch((error) => {
        console.error("Error extracting data:", error);
    });
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class CSVHandler {
    constructor(path) {
        // Ensure the path starts from the root of the server
        this.path = path.startsWith('/') ? path : '/' + path;
    }

    async extractDataFromSales() {
        try {
            const data = await d3.csv(this.path);
            
            // Transform the data
            const transformedData = data.map(d => ({
                Store: +d.Store,
                Dept: +d.Dept,
                Date: new Date(d.Date),
                Weekly_Sales: +d.Weekly_Sales,
                IsHoliday: d.IsHoliday === 'TRUE'
            }));

            if (!transformedData || transformedData.length === 0) {
                throw new Error('No data loaded from CSV');
            }

            return transformedData;
        } catch (error) {
            console.error("Error loading CSV:", error);
            throw error;
        }
    }
}
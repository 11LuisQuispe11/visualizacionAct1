import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class CSVHandler {
    constructor(path) {
        this.path = path;
    }

    async extractData() {
        try {
            console.log("Loading CSV from:", this.path);
            const data = await d3.csv(this.path);
            
            // Transform the data
            const transformedData = data.map(d => ({
                Store: +d.Store,
                Dept: +d.Dept,
                Date: new Date(d.Date),
                Weekly_Sales: +d.Weekly_Sales,
                IsHoliday: d.IsHoliday === 'TRUE'
            }));
            
            console.log("CSV loaded successfully:", transformedData);
            return transformedData;
        } catch (error) {
            console.error("Error loading CSV:", error);
            throw error;
        }
    }
}
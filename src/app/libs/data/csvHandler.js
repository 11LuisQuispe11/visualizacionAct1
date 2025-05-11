import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class CSVHandler {
    constructor(path) {
        this.path = path;
    }

    async extractDataFromSales() {
        try {
            const parseDate = d3.timeParse("%d/%m/%Y");

            const data = await d3.csv(this.path);
            
            // Transform the data
            const transformedData = data.map(d => ({
                Store: +d.Store,
                Dept: +d.Dept,
                Date: parseDate(d.Date),
                Weekly_Sales: +d.Weekly_Sales,
                IsHoliday: d.IsHoliday === 'TRUE'
            }));

            return transformedData;
        } catch (error) {
            console.error("Error loading CSV:", error);
            throw error;
        }
    }
}

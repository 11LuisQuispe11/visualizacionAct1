import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class CSVHandler {
    constructor(path) {
        this.path = path.startsWith('/') ? path : '/' + path;
    }

    validateData(row) {
        return (
            row.Store && 
            !isNaN(+row.Store) &&
            row.Weekly_Sales && 
            !isNaN(+row.Weekly_Sales) &&
            row.IsHoliday !== undefined
        );
    }

    async extractDataFromSales() {
        try {
            const data = await d3.csv(this.path);
            
            if (!Array.isArray(data)) {
                throw new Error('Invalid CSV data format');
            }

            // Transform and validate the data
            const transformedData = data
                .filter(this.validateData)
                .map(d => ({
                    Store: +d.Store,
                    Dept: d.Dept ? +d.Dept : null,
                    Date: d.Date ? new Date(d.Date) : null,
                    Weekly_Sales: +d.Weekly_Sales,
                    IsHoliday: d.IsHoliday === 'TRUE'
                }));

            if (transformedData.length === 0) {
                throw new Error('No valid data found in CSV');
            }

            return transformedData;
        } catch (error) {
            console.error("Error loading CSV:", error);
            throw error;
        }
    }
}
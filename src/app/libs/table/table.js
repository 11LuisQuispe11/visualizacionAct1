import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export class D3Table {
    constructor({ containerId, columns }) {
        this.container = document.getElementById(containerId);
        this.columns = columns || ['Store', 'Weekly_Sales'];
        this.sortColumn = null;
        this.sortAscending = true;
        this.pageSize = 10;
        this.currentPage = 0;
    }

    processData(data) {
        if (!Array.isArray(data)) {
            console.error('Invalid data format received:', data);
            return [];
        }

        try {
            // Group by Store and aggregate data
            const groupedData = {};
            data.forEach(d => {
                if (!groupedData[d.Store]) {
                    groupedData[d.Store] = {
                        Store: d.Store,
                        Weekly_Sales: 0
                    };
                }
                groupedData[d.Store].Weekly_Sales += +d.Weekly_Sales;
            });

            return Object.values(groupedData);
        } catch (error) {
            console.error('Error processing data:', error);
            return [];
        }
    }

    formatValue(value, column) {
        if (value === undefined || value === null) return '';
        
        if (column === 'Weekly_Sales') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        }
        return value;
    }

    render(rawData) {
        this.rawData = rawData;
        if (!this.container) {
            console.error('Container not found');
            return;
        }

        const data = this.processData(rawData);
        if (data.length === 0) {
            this.container.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
            return;
        }
        
        // Clear existing content
        this.container.innerHTML = '';

        // Create table
        const table = d3.select(this.container)
            .append('table')
            .attr('class', 'data-table');

        // Create header
        const thead = table.append('thead');
        thead.append('tr')
            .selectAll('th')
            .data(this.columns)
            .join('th')
            .text(d => d)
            .style('cursor', 'pointer')
            .on('click', (event, d) => this.sort(data, d));

        // Create body
        const tbody = table.append('tbody');
        
        // Calculate pagination
        const start = this.currentPage * this.pageSize;
        const paginatedData = data.slice(start, start + this.pageSize);

        // Create rows
        const rows = tbody.selectAll('tr')
            .data(paginatedData)
            .join('tr');

        // Create cells
        rows.selectAll('td')
            .data(d => this.columns.map(col => ({
                value: d[col],
                column: col
            })))
            .join('td')
            .text(d => this.formatValue(d.value, d.column));

        // Add pagination controls
        this.renderPagination(data.length);
    }

    renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.pageSize);
        
        const pagination = d3.select(this.container)
            .append('div')
            .attr('class', 'pagination');

        // Previous button
        pagination.append('button')
            .text('Previous')
            .attr('disabled', this.currentPage === 0 ? true : null)
            .on('click', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    this.render(this.rawData);
                }
            });

        // Page numbers
        pagination.append('span')
            .text(`Page ${this.currentPage + 1} of ${totalPages}`);

        // Next button
        pagination.append('button')
            .text('Next')
            .attr('disabled', this.currentPage >= totalPages - 1 ? true : null)
            .on('click', () => {
                if (this.currentPage < totalPages - 1) {
                    this.currentPage++;
                    this.render(this.rawData);
                }
            });
    }

    sort(data, column) {
        if (this.sortColumn === column) {
            this.sortAscending = !this.sortAscending;
        } else {
            this.sortColumn = column;
            this.sortAscending = true;
        }

        data.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            return this.sortAscending 
                ? d3.ascending(aVal, bVal)
                : d3.descending(aVal, bVal);
        });

        this.render(this.rawData);
    }

    update(newData) {
        this.rawData = newData;
        this.render(newData);
    }
}
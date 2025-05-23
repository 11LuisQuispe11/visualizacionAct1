import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export class HistogramChart {
    constructor(data) {
        this.data = data;
        this.styles = {
            width: 960,
            height: 500,  // Increased height for better visibility
            marginTop: 30,
            marginRight: 20,
            marginBottom: 50, // Increased for date labels
            marginLeft: 80    // Increased for sales labels
        };
    }

    processData(rawData) {
        if (!rawData || !Array.isArray(rawData)) return [];

        // Convert dates and aggregate sales by date
        const salesByDate = d3.rollup(
            rawData,
            v => d3.sum(v, d => d.Weekly_Sales), // Sum of sales
            d => d3.timeDay(d.Date) // Group by day
        );

        // Convert to array of objects
        return Array.from(salesByDate, ([date, sales]) => ({
            date: date,
            sales: sales
        })).sort((a, b) => d3.ascending(a.date, b.date));
    }

    initChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Process the data
        const data = this.processData(this.data);
        if (data.length === 0) return;

        // Clear previous content
        container.innerHTML = '';

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', this.styles.width)
            .attr('height', this.styles.height)
            .attr('viewBox', [0, 0, this.styles.width, this.styles.height])
            .attr('style', 'max-width: 100%; height: auto;');

        // Create scales
        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.date))
            .range([this.styles.marginLeft, this.styles.width - this.styles.marginRight]);

        // Calculate the actual range of sales values
        const maxSales = 50000000;

        const y = d3.scaleLinear()
            .domain([0, maxSales * 1.1]) // Add 10% padding to max value
            .range([this.styles.height - this.styles.marginBottom, this.styles.marginTop])
            .nice(); // This will round the scale to nice values

        // Create the histogram bins
        const binWidth = (x.range()[1] - x.range()[0]) / 30; // Adjust number of bins as needed
        this.color = d3.scaleOrdinal()
            .domain(this.data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), 65).reverse());

        // Create bars
        svg.append('g')
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => x(d.date))
            .attr('y', d => y(d.sales))
            .attr('width', binWidth - 1)
            .attr('height', d => y(0) - y(d.sales))
            .attr('fill', this.color)
            .on('mouseover', function (event, d) {
                // d3.select(this).attr('fill', '#28796c');
                // Show tooltip
                tooltip.style('display', 'block')
                    .html(`Fechas de ventas: ${d.date.toLocaleDateString()}<br>Ventas: $${d3.format(',.2f')(d.sales)}`);
            })
            .on('mousemove', function (event) {
                tooltip.style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0,${this.styles.height - this.styles.marginBottom})`)
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat('%m/%d/%Y')))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');

        // Add Y axis
        svg.append('g')
            .attr('transform', `translate(${this.styles.marginLeft},0)`)
            .call(d3.axisLeft(y)
                .ticks(10)  // Adjusted number of ticks
                .tickSize(-this.styles.width + this.styles.marginLeft + this.styles.marginRight) // Add grid lines
                .tickFormat(d => '$' + d3.format(',.0f')(d)))
            .call(g => g.select(".domain").remove()) // Remove the axis line
            .call(g => g.selectAll(".tick line") // Style grid lines
                .attr("stroke", "#ddd")
                .attr("opacity", 0.5));

        // Add labels
        svg.append('text')
            .attr('class', 'x-label')
            .attr('text-anchor', 'middle')
            .attr('x', this.styles.width / 2)
            .attr('y', this.styles.height - 5)
            .text('Fechas');

        svg.append('text')
            .attr('class', 'y-label')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(this.styles.height / 2))
            .attr('y', 15)
            .text('Ventas ($)');

        // Create tooltip
        const tooltip = d3.select(container)
            .append('div')
            .attr('class', 'tooltip')
            .style('display', 'none')
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', '1px solid #ddd')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none');
    }
}
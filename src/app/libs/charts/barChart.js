import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export class BarChart {
    constructor(data) {
        this.data = this.processData(data);
        this.width = 960;
        this.styles = {
            width: 960,
            height: 500,
            top: 20,
            right: 30,
            bottom: 70, // Increased to accommodate rotated labels
            left: 60    // Increased to accommodate sales values
        };
    }

    processData(rawData) {
        if (!rawData) return [];

        // Group by Store and sum Weekly_Sales
        const groupedData = d3.rollups(
            rawData,
            v => d3.sum(v, d => d.Weekly_Sales),
            d => d.Store
        );

        // Sort by store number
        groupedData.sort((a, b) => a[0] - b[0]);
        return groupedData;
    }

    initChart(id) {
        if (!this.data || this.data.length === 0) {
            console.error("No data available for bar chart");
            return;
        }
        this.color = d3.scaleOrdinal()
            .domain(this.data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse());

        // Create scales
        this.x = d3.scaleBand()
            .domain(this.data.map(d => d[0]))
            .range([this.styles.left, this.styles.width - this.styles.right])
            .padding(0.1);

        this.y = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d[1])])
            .nice()
            .range([this.styles.height - this.styles.bottom, this.styles.top]);

        // Create SVG
        this.svg = d3.create("svg")
            .attr("width", this.styles.width)
            .attr("height", this.styles.height)
            .attr("viewBox", [0, 0, this.styles.width, this.styles.height])
            .attr("style", "max-width: 100%; height: auto;");

        // Draw bars
        const colors = d3.scaleOrdinal()
            .domain(this.data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse());
        this.svg.append("g")
            .selectAll("rect")
            .data(this.data)
            .join("rect")
            .attr("x", d => this.x(d[0]))
            .attr("y", d => this.y(d[1]))
            .attr("height", d => this.y(0) - this.y(d[1]))
            .attr("width", this.x.bandwidth())
            .attr("fill", colors)
            .append("title")
            .text(d => `Store ${d[0]}\nSales: $${d3.format(",.2f")(d[1])}`);

        // Add X axis
        this.svg.append("g")
            .attr("transform", `translate(0,${this.styles.height - this.styles.bottom})`)
            .call(d3.axisBottom(this.x).tickFormat(d => `Store ${d}`))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        this.svg.append("g")
            .attr("transform", `translate(${this.styles.left},0)`)
            .call(d3.axisLeft(this.y)
                .tickFormat(d => `$${d3.format(",.0f")(d)}`))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -this.styles.left)
                .attr("y", this.styles.top - 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Total Sales"));

        // Add to container
        const container = document.getElementById(id);
        if (container) {
            container.appendChild(this.svg.node());
        } else {
            console.error(`Container with id '${id}' not found`);
        }
    }

    updateChart(newData) {
        if (!newData || !this.svg) return;

        const processedData = this.processData(newData);

        // Update scales
        this.x.domain(processedData.map(d => d[0]));
        this.y.domain([0, d3.max(processedData, d => d[1])]).nice();

        // Update bars
        const bars = this.svg.selectAll("rect")
            .data(processedData);

        // Remove old bars
        bars.exit().remove();

        // Update existing bars
        bars.transition()
            .duration(750)
            .attr("x", d => this.x(d[0]))
            .attr("y", d => this.y(d[1]))
            .attr("height", d => this.y(0) - this.y(d[1]))
            .attr("width", this.x.bandwidth());

        // Add new bars
        bars.enter()
            .append("rect")
            .attr("fill", "steelblue")
            .attr("x", d => this.x(d[0]))
            .attr("y", this.y(0))
            .attr("height", 0)
            .attr("width", this.x.bandwidth())
            .transition()
            .duration(750)
            .attr("y", d => this.y(d[1]))
            .attr("height", d => this.y(0) - this.y(d[1]));

        // Update tooltips
        this.svg.selectAll("rect title")
            .text(d => `Store ${d[0]}\nSales: $${d3.format(",.2f")(d[1])}`);

        // Update X axis
        this.svg.select("g:nth-child(2)")
            .transition()
            .duration(750)
            .call(d3.axisBottom(this.x).tickFormat(d => `Store ${d}`))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Update Y axis
        this.svg.select("g:nth-child(3)")
            .transition()
            .duration(750)
            .call(d3.axisLeft(this.y)
                .tickFormat(d => `$${d3.format(",.0f")(d)}`));
    }

    destroyChart() {
        if (this.svg) {
            this.svg.remove();
            this.svg = null;
        }
    }
    /**
     * @param {{ width: number; height: number; margin: { top: number; right: number; bottom: number; left: number; }; }} styles
     */
    set style(styles) {
        this.styles = { ...this.styles, ...styles };
    }
}

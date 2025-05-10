import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { Chart } from './chart.js';

export class BarChart extends Chart {
    constructor(data) {
        super(data);
        this.data = data;
        this.styles = {
            width: 960,
            height: 500,
            marginTop: 20,
            marginRight: 30,
            marginBottom: 30,
            marginLeft: 40
        };
    }


    initChart(id) {
        if (!this.data) return;

        const processedData = this.processData(this.data);

        // Create scales
        this.x = d3.scaleBand()
            .domain(processedData.map(d => d[0]))
            .range([this.margin.left, this.width - this.margin.right])
            .padding(0.1);

        this.y = d3.scaleLinear()
            .domain([0, d3.max(processedData, d => d[1])])
            .nice()
            .range([this.height - this.margin.bottom, this.margin.top]);

        // Create SVG
        this.svg = d3.create("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height])
            .attr("style", "max-width: 100%; height: auto;");

        // Draw bars
        this.svg.append("g")
            .selectAll("rect")
            .data(processedData)
            .join("rect")
            .attr("x", d => this.x(d[0]))
            .attr("y", d => this.y(d[1]))
            .attr("height", d => this.y(0) - this.y(d[1]))
            .attr("width", this.x.bandwidth())
            .attr("fill", "steelblue");

        // Add X axis
        this.svg.append("g")
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(this.x).tickFormat(d => `Store ${d}`))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(this.y))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -this.margin.left)
                .attr("y", this.margin.top - 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Total Sales"));

        // Add to container
        const container = document.getElementById(id);
        container.appendChild(this.svg.node());
    }

    updateChart(newData) {
        if (!newData || !this.svg) return;

        const processedData = newData

        // Update scales
        this.x.domain(processedData.map(d => d[0]));
        this.y.domain([0, d3.max(processedData, d => d[1])]).nice();

        // Update bars
        this.svg.selectAll("rect")
            .data(processedData)
            .join("rect")
            .transition()
            .duration(750)
            .attr("x", d => this.x(d[0]))
            .attr("y", d => this.y(d[1]))
            .attr("height", d => this.y(0) - this.y(d[1]))
            .attr("width", this.x.bandwidth());

        // Update axes
        this.svg.select("g")
            .transition()
            .duration(750)
            .call(d3.axisBottom(this.x).tickFormat(d => `Store ${d}`));

        this.svg.select("g:nth-child(3)")
            .transition()
            .duration(750)
            .call(d3.axisLeft(this.y));
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
        this.styles = styles;
    }
}

// Example usage:
d3.csv("./sales data-set.csv").then(function(data) {
    const barChart = new BarChart(data);
});

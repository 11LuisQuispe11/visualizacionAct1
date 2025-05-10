import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { Chart } from './chart.js';

export class LineChart extends Chart {
    constructor(data) {
        super(data);
        this.styles = {
            width: 928,
            height: 500,
            marginTop: 20,
            marginRight: 30,
            marginBottom: 30,
            marginLeft: 40
        }
        this.initChart();
    }


    initChart(id) {
        // Initialize scales
        this.x = d3.scaleUtc()
            .domain(d3.extent(this.data, d => d.date))
            .range([this.marginLeft, this.width - this.marginRight]);

        this.y = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.value)])
            .range([this.height - this.marginBottom, this.marginTop]);

        // Create line generator
        this.line = d3.line()
            .x(d => this.x(d.date))
            .y(d => this.y(d.value));

        // Create SVG
        this.svg = d3.create("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height])
            .attr("style", "max-width: 100%; height: auto;");

        // Add X axis
        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height - this.marginBottom})`)
            .call(d3.axisBottom(this.x));

        // Add Y axis
        this.svg.append("g")
            .attr("transform", `translate(${this.marginLeft}, 0)`)
            .call(d3.axisLeft(this.y));

        // Add the line path
        this.svg.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", this.line);

        // Append to container
        const containerLine = document.getElementById(id);
        containerLine.appendChild(this.svg.node());
    }
 
    updateChart(newData) {
        if (!newData || !this.svg) return;

        this.data = newData;

        // Update scales
        this.x.domain(d3.extent(this.data, d => d.date));
        this.y.domain([0, d3.max(this.data, d => d.value)]);

        // Update line
        this.svg.select("path")
            .datum(this.data)
            .transition()
            .duration(750)
            .attr("d", this.line);

        // Update axes
        this.svg.select("g")
            .transition()
            .duration(750)
            .call(d3.axisBottom(this.x));

        this.svg.select("g:nth-child(2)")
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
     * @param {{ width: number; height: number; marginTop: number; marginRight: number; marginBottom: number; marginLeft: number; }} styles
     */
    set style(styles) {
        this.styles = styles;
    }
}

// Example usage:
const lineChart = new LineChart();
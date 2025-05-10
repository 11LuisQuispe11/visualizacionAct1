import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { Chart } from './chart.js';

export class AreaChart extends Chart {
    constructor(data) {
        super(data);
        this.data = data
        this.styles = {
            width: 928,
            height: 500,
            marginTop: 20,
            marginRight: 30, 
            marginBottom: 30,
            marginLeft: 40
        };
    }



    initChart(id) {
        // Initialize scales
        this.x = d3.scaleUtc()
            .domain(d3.extent(this.data, d => d.date))
            .range([this.marginLeft, this.width - this.marginRight]);

        this.y = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.close)])
            .range([this.height - this.marginBottom, this.marginTop]);

        // Create area generator
        this.area = d3.area()
            .x(d => this.x(d.date))
            .y0(this.y(0))
            .y1(d => this.y(d.close));

        // Create SVG
        this.svg = d3.create("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height])
            .attr("style", "max-width: 100%; height: auto;");

        // Add the area path
        this.svg.append("path")
            .attr("fill", "steelblue")
            .attr("d", this.area(this.data));

        // Add X axis
        this.svg.append("g")
            .attr("transform", `translate(0,${this.height - this.marginBottom})`)
            .call(d3.axisBottom(this.x).ticks(this.width / 80).tickSizeOuter(0));

        // Add Y axis
        this.svg.append("g")
            .attr("transform", `translate(${this.marginLeft},0)`)
            .call(d3.axisLeft(this.y).ticks(this.height / 40))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", this.width - this.marginLeft - this.marginRight)
                .attr("stroke-opacity", 0.1))
            .call(g => g.append("text")
                .attr("x", -this.marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Daily close ($)"));

        // Append to container
        const containerArea = document.getElementById(id);
        containerArea.appendChild(this.svg.node());
    }

    updateChart(newData) {
        this.data = newData.map(d => ({...d, date: new Date(d.date)}));
        
        // Update scales
        this.x.domain(d3.extent(this.data, d => d.date));
        this.y.domain([0, d3.max(this.data, d => d.close)]);

        // Update area
        this.svg.select("path")
            .datum(this.data)
            .attr("d", this.area);

        // Update axes
        this.svg.select("g").call(d3.axisBottom(this.x).ticks(this.width / 80).tickSizeOuter(0));
        this.svg.select("g:nth-child(3)").call(d3.axisLeft(this.y).ticks(this.height / 40));
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

        // Reinitialize the chart with new styles
        this.initChart();
    }
}

// Example usage:
d3.csv("./sales data-set.csv").then(function(data) {
    const areaChart = new AreaChart();
});
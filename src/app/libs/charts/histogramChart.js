import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { Chart } from "./chart.js";

class HistogramChart {
    constructor(data) {
        super(data);
        this.data = data || [];
        this.styles = {
            width: 960,
            height: 500,
            marginTop: 20,
            marginRight: 20,
            marginBottom: 30,
            marginLeft: 40
        };
        this.svg = null;
    }

    initChart(id) {
        // Bin the data
        const bins = d3.bin()
            .thresholds(40)
            .value((d) => d.rate)
            (this.data);

        // Declare the x (horizontal position) scale
        const x = d3.scaleLinear()
            .domain([bins[0].x0, bins[bins.length - 1].x1])
            .range([this.styles.marginLeft, this.styles.width - this.styles.marginRight]);

        // Declare the y (vertical position) scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, (d) => d.length)])
            .range([this.styles.height - this.styles.marginBottom, this.styles.marginTop]);

        // Create the SVG container
        this.svg = d3.create("svg")
            .attr("width", this.styles.width)
            .attr("height", this.styles.height)
            .attr("viewBox", [0, 0, this.styles.width, this.styles.height])
            .attr("style", "max-width: 100%; height: auto;");

        // Add a rect for each bin
        this.svg.append("g")
            .attr("fill", "steelblue")
            .selectAll()
            .data(bins)
            .join("rect")
            .attr("x", (d) => x(d.x0) + 1)
            .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
            .attr("y", (d) => y(d.length))
            .attr("height", (d) => y(0) - y(d.length));

        // Add the x-axis and label
        this.svg.append("g")
            .attr("transform", `translate(0,${this.styles.height - this.styles.marginBottom})`)
            .call(d3.axisBottom(x).ticks(this.styles.width / 80).tickSizeOuter(0))
            .call((g) => g.append("text")
                .attr("x", this.styles.width)
                .attr("y", this.styles.marginBottom - 4)
                .attr("fill", "currentColor")
                .attr("text-anchor", "end")
                .text("Unemployment rate (%) →"));

        // Add the y-axis and label, and remove the domain line
        this.svg.append("g")
            .attr("transform", `translate(${this.styles.marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(this.styles.height / 40))
            .call((g) => g.select(".domain").remove())
            .call((g) => g.append("text")
                .attr("x", -this.styles.marginLeft)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Frequency (no. of counties)"));

        const containerHistogram = document.getElementById(data);
        containerHistogram.appendChild(this.svg.node());
    }

    updateChart(newData) {
        this.data = newData;
        if (this.svg) {
            this.svg.remove();
        }
        this.initChart();
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

export { HistogramChart };
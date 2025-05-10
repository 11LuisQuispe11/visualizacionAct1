import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { Chart } from './chart.js';

export class PieChart extends Chart {
  constructor(data) {
    super(data);
    this.data = data;
    this.styles = {
      width: 960,
      height: 500,
      radius: Math.min(960, 500) / 2
    };

    this.initChart();
  }

  initChart(id) {
    // Create arc generator
    this.arc = d3.arc()
      .innerRadius(this.radius * 0.67)
      .outerRadius(this.radius - 1);

    // Create pie generator
    this.pie = d3.pie()
      .padAngle(1 / this.radius)
      .sort(null)
      .value(d => d.value);

    // Create color scale
    this.color = d3.scaleOrdinal()
      .domain(this.data.map(d => d.name))
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse());

    // Create SVG
    this.svg = d3.create("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
      .attr("style", "max-width: 100%; height: auto;");

    // Add pie slices
    this.svg.append("g")
      .selectAll()
      .data(this.pie(this.data))
      .join("path")
      .attr("fill", d => this.color(d.data.name))
      .attr("d", this.arc)
      .append("title")
      .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    // Add labels
    this.svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(this.pie(this.data))
      .join("text")
      .attr("transform", d => `translate(${this.arc.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => d.data.name))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.value.toLocaleString("en-US")));

    // Append to container
    const containerPie = document.getElementById(id);
    containerPie.appendChild(this.svg.node());
  }

  updateChart(newData) {
    if (!newData || !this.svg) return;

    this.data = newData;

    // Update color scale
    this.color.domain(this.data.map(d => d.name));

    // Update pie slices with transition
    const paths = this.svg.select("g")
      .selectAll("path")
      .data(this.pie(this.data));

    paths.transition()
      .duration(750)
      .attrTween("d", d => {
        const interpolate = d3.interpolate(this.arc._current || d, d);
        this.arc._current = interpolate(0);
        return t => this.arc(interpolate(t));
      })
      .attr("fill", d => this.color(d.data.name));

    // Update labels
    const labels = this.svg.select("g:nth-child(2)")
      .selectAll("text")
      .data(this.pie(this.data));

    labels.transition()
      .duration(750)
      .attr("transform", d => `translate(${this.arc.centroid(d)})`);

    labels.select("tspan:first-child")
      .text(d => d.data.name);

    labels.select("tspan:last-child")
      .text(d => d.data.value.toLocaleString("en-US"));
  }

  destroyChart() {
    if (this.svg) {
      this.svg.remove();
      this.svg = null;
    }
  }

  /**
 * @param {{ width: number; height: number; radius: number; }} styles
 */
  set style(styles) {
    this.styles = styles;
  }
}

// Example usage:
const pieChart = new PieChart();

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class LineChart {
  constructor(data) {
    this.data = this.processData(data);
    this.width = 500;
    this.height = 500;
    this.margin = {
      top: 20,
      right: 30,
      bottom: 40,
      left: 40
    };
  }

processData(rawData) {
  if (!rawData) return [];

  const groupedData = d3.rollup(
    rawData,
    v => d3.sum(v, d => d.Weekly_Sales),
    d => d.Date.getFullYear()
  );

  const transformedData = Array.from(groupedData, ([year, value]) => ({
    date: new Date(year, 0),
    value: value
  }));

  return transformedData;
}


  initChart(id) {
    const { top, right, bottom, left } = this.margin;

    const svg = d3.create("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    const x = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.date)) // Utiliza la extensión de fechas de los datos
      .range([left, this.width - right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value)]).nice()
      .range([this.height - bottom, top]);

    const xAxis = g => g
      .attr("transform", `translate(0,${this.height - bottom})`)
      .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-40)");

    const yAxis = g => g
      .attr("transform", `translate(${left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove());

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.value));

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    const container = document.getElementById(id);
    if (!container) {
      console.error('Container not found!');
    } else {
      console.log('Container found!');
      container.appendChild(svg.node());
    }
  }

  set styles(newStyles) {
    const { width, height, marginTop, marginRight, marginBottom, marginLeft } = newStyles;
    if (width) this.width = width;
    if (height) this.height = height;

    // Asegúrate de que margin se modifique correctamente
    this.margin.top = marginTop ?? this.margin.top;
    this.margin.right = marginRight ?? this.margin.right;
    this.margin.bottom = marginBottom ?? this.margin.bottom;
    this.margin.left = marginLeft ?? this.margin.left;
  }}


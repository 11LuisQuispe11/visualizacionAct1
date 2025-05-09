import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

const containerLine = document.getElementById("container-line");
const styles = {
    width: 640,
    height: 400,
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 40,
    marginRight: 20,
}

const x_axis = d3.scaleUtc()
    .domain([new Date('2025-04-25'), new Date('2025-12-31')])
    .range([styles.marginLeft, styles.width - styles.marginRight]);

const y_axis = d3.scaleLinear()
    .domain([0, 100])
    .range([styles.height - styles.marginBottom, styles.marginTop]);

const svg = d3.create("svg")
.attr("width", styles.width)
.attr("height", styles.height)

svg.append("g")
    .attr("transform", `translate(0, ${styles.height - styles.marginBottom})`)
    .call(d3.axisBottom(x_axis));
svg.append("g")
    .attr("transform", `translate(${styles.marginLeft}, 0)`)
    .call(d3.axisLeft(y_axis));

const data = [
    { date: new Date('2025-04-25'), value: 10 },
    { date: new Date('2025-05-01'), value: 20 },
    { date: new Date('2025-06-15'), value: 30 },
    { date: new Date('2025-07-20'), value: 40 },
    { date: new Date('2025-08-10'), value: 50 },
    { date: new Date('2025-09-05'), value: 60 },
    { date: new Date('2025-10-15'), value: 70 },
    { date: new Date('2025-11-25'), value: 80 },
    { date: new Date('2025-12-31'), value: 90 }
];
const line = d3.line()
    .x(d => x_axis(d.date))
    .y(d => y_axis(d.value));

svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line);

containerLine.append(svg.node());
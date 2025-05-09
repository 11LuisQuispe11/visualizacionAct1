import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

d3.csv("./sales data-set.csv").then(function(data) {
    // Aquí puedes trabajar con la data cargada
    console.log(data);  // Imprime los registros en consola
});


const aapl = [
  {date: "2007-04-23", close: 93.24},
  {date: "2007-04-24", close: 95.35},
  {date: "2007-04-25", close: 98.84},
  {date: "2007-04-26", close: 99.92},
  {date: "2007-04-29", close: 99.8},
  {date: "2007-05-01", close: 99.47},
  {date: "2007-05-02", close: 100.39},
  {date: "2007-05-03", close: 100.4},
  {date: "2007-05-04", close: 100.81},
  {date: "2007-05-07", close: 103.92}
];

// ⚡ Solución: Parsear las fechas como objetos Date
for (const d of aapl) {
  d.date = new Date(d.date);
}

// Declarar dimensiones y márgenes
const width = 928;
const height = 500;
const marginTop = 20;
const marginRight = 30;
const marginBottom = 30;
const marginLeft = 40;

// Escala x
const x = d3.scaleUtc(d3.extent(aapl, d => d.date), [marginLeft, width - marginRight]);

// Escala y
const y = d3.scaleLinear([0, d3.max(aapl, d => d.close)], [height - marginBottom, marginTop]);

// Generador de área
const area = d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.close));

// Crear SVG
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// Agregar el área
svg.append("path")
    .attr("fill", "steelblue")
    .attr("d", area(aapl));

// Agregar eje X
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

// Agregar eje Y
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Daily close ($)"));

// Agregar SVG al contenedor
const containerArea = document.getElementById("container-area");
containerArea.appendChild(svg.node());
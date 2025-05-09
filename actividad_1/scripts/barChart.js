import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 800;
const height = 500;
const margin = { top: 30, right: 30, bottom: 40, left: 70 };

// Leer el CSV
d3.csv("./sales data-set.csv").then(function(data) {
    // Convertir datos numéricos
    data.forEach(d => {
        d.Store = +d.Store;
        d.Weekly_Sales = +d.Weekly_Sales;
    });

    // Agrupar por tienda y sumar ventas totales
    const salesByStore = d3.rollups(
        data,
        v => d3.sum(v, d => d.Weekly_Sales),
        d => d.Store
    );

    // Ordenar por Store (opcional)
    salesByStore.sort((a, b) => a[0] - b[0]);

    // Crear escalas
    const x = d3.scaleBand()
        .domain(salesByStore.map(d => d[0]))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(salesByStore, d => d[1])])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Crear SVG
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Dibujar barras
    svg.append("g")
        .selectAll("rect")
        .data(salesByStore)
        .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(0) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue");

    // Eje X
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d => `Store ${d}`))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Eje Y
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", margin.top - 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Total Sales"));

    // Agregar al contenedor
    const container = document.getElementById("container-bars");
    container.appendChild(svg.node());
});

// // html
// <html>
//   <head>
//     <meta charset="utf-8" />
//     <title>Pie Chart</title>
//     <script src="https://d3js.org/d3.v5.min.js"></script>
//   </head>
//   <body>
//     <div id="pie"></div>
//     <script src="app.js"></script>
//   </body>
// </html>
// array created
// array created
const data = [
  { label: 'Rel.', value: 585 },
  { label: 'Died', value: 155 },
  { label: 'EU.', value: 112 },
  { label: 'Deaths w/in 24hrs', value: 165 },
  { label: 'TSFR', value: 42 },
  { label: 'DOA', value: 52 },
  { label: 'Reh.', value: 10 },
  { label: 'Escaped', value: 1 },
]
// dimensions and margins
const width = 400;
const height = 400;
const margin = 40;
// SVG elements
const svg = d3.select('#pie')
  .append('svg')
  .attr('width', width)
  .attr('height', height);
  svg.append('text')
  .attr('x', width / 2)
  .attr('y', margin / 2)
  .attr('text-anchor', 'middle')
  .style('font-size', '18px')
  .text('Animal Mortality Rate');
// Pie layout
  const pie = d3.pie()
  .value(d => d.value);
const pieData = pie(data);
// arc generator
const radius = Math.min(width, height) / 2 - margin;
const arc = d3.arc()
  .innerRadius(0)
  .outerRadius(radius);
// create pie chart
  const chart = svg.append('g')
  .attr('transform', `translate(${width / 2}, ${height / 2})`);
const arcs = chart.selectAll('arc')
  .data(pieData)
  .enter()
  .append('g');
arcs.append('path')
  .attr('d', arc)
  .attr('fill', (d, i) => d3.schemeCategory10[i]);
arcs.append('text')
  .attr('transform', d => `translate(${arc.centroid(d)})`)
  .attr('text-anchor', 'middle')
  .text(d => d.data.label);
  // pie color
var color = d3.scaleOrdinal()
.range(["#00FF01","#8A0000","#FF6347","#800000","#FFFF00","#008080","#B22222","#7FFF00","#000000"]);
import * as d3 from "../frozen/d3.js";
/**
 * @class ScatterChartComponent
 * @description to plot 2d f(x), with optional smoothing line
 */

export class ScatterChartComponent {
  /**
   * @param {object} options
   * @param {string} options.targetElementId
   * @param {object} data
   * @param {Array<number>} data.x
   * @param {Array<number>} data.y
   */
  constructor(options, data) {
    this.options = options
    this.data = data
    console.log(this.data)
    this.render()
  }

  render() {
    console.log(this.options.targetElementId)
    const width = 928, height = 600, marginTop = 20, marginRight = 30, marginBottom = 30, marginLeft = 40;

    const x = d3.scaleUtc()
      .domain(d3.extent(this.data, d => d.date))
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.value)).nice()
      .range([height - marginBottom, marginTop]);

    const max = d3.max(this.data, d => Math.abs(d.value));

    const color = d3.scaleSequential()
      .domain([max, -max])
      .interpolator(d3.interpolateRdBu);

    const svg = d3.select(this.options.targetElementId)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    // axes
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(null, "+"))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line")
        .clone()
        .attr("x2", width - marginRight - marginLeft)
        .attr("stroke-opacity", d => d === 0 ? 1 : 0.1))
      .call(g => g.append("text")
        .attr("fill", "#000")
        .attr("x", 5)
        .attr("y", marginTop)
        .attr("dy", "0.32em")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Anomaly (°C)"));

    // scatter
    svg.append("g")
      .attr("stroke", "#000")
      .attr("stroke-opacity", 0.2)
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.value))
      .attr("fill", d => color(d.value))
      .attr("r", 2.5);
    console.log("finish render")
  }
}


export default ScatterChartComponent
import { BaseComponent } from '../baseComponent.js'
import * as d3 from "../../frozen/d3.js";


/**
  * @typedef { Object } scatterData
  * @property { Array[number] } x
  * @property { Array[number] } y
  * @property { Array[number] } c
  */

/**
  * @typedef {import("./baseOptions.js").baseOptions} baseOptions
  *
  * @typedef { baseOptions & Object } options
  * @property { number } margin
  */

export class ScatterPlotComponent extends BaseComponent {
  /**
    * @param { options } options
    * @param { scatterData[] } data
    * @param { string } cid
    * @param { string } customCss
    */
  constructor(data,options, cid, customCss) {
    super(cid, customCss)
    this.options = options
    this.data = data
  }

  aRender() {
    const width = this.options.width
    const height = this.options.height
    const margin = this.options.margin

    const x = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.x))
      .range([margin, width - margin]);

    const y = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.y))
      .range([height - margin, margin]);

    const max = d3.max(this.data, d => Math.abs(d.c));


    const color = d3.scaleDiverging(d3.interpolateViridis)
      .domain([-1 * max, 0, max])

    const container = d3.select(`#${this.cid}`)
    if (container.empty()) {
      throw new Error
    }
    const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    // axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call(g => g.select(".domain").remove());

    svg.append("g")
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(y).ticks(null, "+"))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line")
        .clone()
        .attr("x2", width - margin - margin)
        .attr("stroke-opacity", d => d === 0 ? 1 : 0.1))
      .call(g => g.append("text")
        .attr("fill", "#000")
        .attr("x", 5)
        .attr("y", margin)
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
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("fill", d => color(d.c))
      .attr("r", 2.5);
    console.log("finish render")
    this.component = svg
  }

  async onMount() {
    await super.onMount()
    this.aRender();
  }

  async onUnmount() {
    await super.onUnmount()
    if (this.component) {
      this.component.destroy()
      this.component = null
      this.data = null
    }
  }
}


export default ScatterPlotComponent

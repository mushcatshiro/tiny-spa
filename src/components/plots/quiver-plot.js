import { BaseComponent } from '../baseComponent.js'
import * as d3 from '../../frozen/d3.js'

/**
  * @typedef { Object } quiverData
  * @property { Array[number] } u
  * @property { Array[number] } v
  * @property { Array[number] } x
  * @property { Array[number] } y
  * @property { Array[number] } m
  * @property { Array[number] } a
  */

/**
  * @typedef { Object } options
  * @property { number } width
  * @property { number } height
  * @property { number } scaleRange
  * @property { number } domainRange
  * @property { number } domainCenter
  * @property { boolean } pivotMid
  * @property { number } quiverLength
  */

class QuiverPlotComponent extends BaseComponent {
  /**
    * @param { quiverData[] } data
    * @param { options } options
    * @param { string } cid
    * @param { string } customCss
    */
  constructor(data, options, cid, customCss) {
    super(cid, customCss)
    this.options = options
    this.data = data
  }

  // - [ ] cutomizable color bar scale, parameterize, black boundary box
  aRender() {
    const width = this.options.width
    const height = this.options.height
    const scaleRange = this.options.scaleRange
    const domainRange = this.options.domainRange
    const domainCenter = this.options.domainCenter
    const container = d3.create("div")
      .attr("class", "")
      .style("width", `${width}px`)
      .style("height", `${height}px`)
      .style("overflow", "hidden")
      .style("position", "relative")
    const dpr = window.devicePixelRatio || 1
    const canvas = container.append("canvas")
      .attr("width", width * dpr)
      .attr("height", height * dpr)

    const canvasNode = canvas.node()
    let ctx = canvasNode.getContext("2d")
    ctx.scale(dpr, dpr)

    const xScale = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.x))
      .range([scaleRange, width - scaleRange])

    const yScale = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.y))
      .range([height - scaleRange, scaleRange])

    let colorScale = d3.scaleDiverging(d3.interpolateViridis)
      .domain([-1 * domainRange, domainCenter, domainRange])

    const draw = (transform = d3.zoomIdentity) => {
      if (!ctx) return;
      ctx.save()
      ctx.clearRect(0, 0, width, height)
      ctx.translate(transform.x, transform.y)
      ctx.scale(transform.k, transform.k)


      for (let i = 0; i < this.data.length; i++) {
        const d = this.data[i]
        const xPos = xScale(d.x)
        const yPos = yScale(d.y)
        var length = this.options.quiverLength
        var sx = xPos
        var sy = yPos
        if (this.options.pivotMid) {
          length /=  2
          sx -= Math.cos(d.a) * length
          sy += Math.sin(d.a) * length
        }
        const tx = xPos + Math.cos(d.a) * length
        const ty = yPos - Math.sin(d.a) * length
        ctx.strokeStyle = colorScale(d.m)
        ctx.lineWidth = 1.5 / transform.k
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(tx, ty)

        const headLen = 4
        ctx.lineTo(tx - headLen * Math.cos(d.a - Math.PI / 6), ty + headLen * Math.sin(d.a - Math.PI / 6))
        ctx.moveTo(tx, ty)
        ctx.lineTo(tx - headLen * Math.cos(d.a + Math.PI / 6), ty + headLen * Math.sin(d.a + Math.PI / 6))
        ctx.stroke()
      }
      ctx.restore()
    }

    const zoomBehavior = d3.zoom()
      .scaleExtent([1, 2])
      .translateExtent([[0, 0], [width, height]])
      .on("zoom", (event) => {
        draw(event.transform)
      })
    canvas.call(zoomBehavior)
    this.getComponentContainer().append(container.node())

    const component = {
      node: container.node(),
      updateColors: (min, zero, max) => {
        colorScale.domain([min, zero, max])
        draw(d3.zoomTransform(canvasNode))
      },
      resetColors: () => {
        const maxVal = d3.max(this.data, d => Math.abs(d.m))
        colorScale.domain([-maxVal, 0, maxVal])
        draw(d3.zoomTransform(canvasNode))
      }
    }
    component.resetColors()
    this.component = component
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

export {
  QuiverPlotComponent
}

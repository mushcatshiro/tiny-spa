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

class QuiverPlotComponent extends BaseComponent {
  /**
    * @param { quiverData[] } data
    * @param { string } cid
    * @param { string } customCss
    */
  constructor(data, cid, customCss) {
    super(cid, customCss)
    this.data = data
  }

  actualRender() {
    // cutomizable color bar scale
    const width = 500 // parameterize
    const height = 500
    const container = d3.create("div")
      .attr("class", "")
      .style("width", `${width}px`)
      .style("height", `${height}px`)
      .style("overflow", "hidden")
      .style("position", "relative")
    const canvas = container.append("canvas")
      .attr("width", width)
      .attr("height", height)

    const canvasNode = canvas.node()
    let ctx = canvasNode.getContext("2d")

    const xScale = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.x))
      .range([20, width - 20]) // parameterize

    const yScale = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.y))
      .range([height - 20, 20])

    let colorScale = d3.scaleDiverging(d3.interpolateViridis)
      .domain([-2, 0, 2]) // parameterize

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
        const length = 15 // parameterize
        const tx = xPos + Math.cos(d.a) * length
        const ty = yPos - Math.sin(d.a) * length
        ctx.strokeStyle = colorScale(d.m)
        ctx.lineWidth = 1.5 / transform.k
        ctx.beginPath()
        ctx.moveTo(xPos, yPos)
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
    super.onMount()
    this.actualRender();
  }

  async onUnmount() {
    super.onUnmount()
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

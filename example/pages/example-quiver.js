import { BaseController  } from 'tiny-spa/baseController.js'
import { QuiverPlotComponent } from 'tiny-spa/components/plots/quiver-plot.js'
import { ScatterPlotComponent } from 'tiny-spa/components/plots/scatter-plot.js'
import * as d3 from 'tiny-spa/frozen/d3.js'

export class VectorVizController extends BaseController {
  constructor(appId) {
    super(appId)
    const qConfig = {
      width: 500,
      height: 500,
      scaleRange: 20,
      domainRange: 2,
      domainCenter: 0,
      margin: 30,
    }
    const data = this.generateData()
    this.components.push(new QuiverPlotComponent(
      data, qConfig, "chart", ""
    ))
    this.components.push(new ScatterPlotComponent(
      data, qConfig, "chart", ""
    ))
  }

  generateData() {
    const n = 20;
    const xl = d3.range(n).map(i => -1 + (2 * i) / (n - 1));
    const yl = d3.range(n).map(i => -1 + (2 * i) / (n - 1));
    console.log(xl)

    // Initialize 6 flat arrays
    const x = [];
    const y = [];
    const u = [];
    const v = [];
    const m = [];
    const a = [];

    // Flatten the meshgrid logic into 1D arrays
    for (let j = 0; j < yl.length; j++) {
      for (let i = 0; i < xl.length; i++) {
        const currX = xl[i];
        const currY = yl[j];

        // Vector field math (Saddle point / complex flow example)
        const currU = currX * currX - currY * currY - 0.4;
        const currV = 2 * currX * currY;

        // Calculate magnitude and angle
        const magnitude = Math.sqrt(currU ** 2 + currV ** 2);
        const angle = Math.atan2(currV, currU);

        // Push to flat arrays
        x.push(currX);
        y.push(currY);
        u.push(currU);
        v.push(currV);
        m.push(magnitude);
        a.push(angle);
      }
    }

    // Return as an array of 6 arrays to match your processor input
    const result = []
    for (let i = 0; i < x.length; i++) {
      result[i] = {
        x: x[i], y: y[i], u: u[i], v: v[i],
        m: m ? m[i] : Math.sqrt(u[i]**2 + v[i]**2),
        c: m ? m[i] : Math.sqrt(u[i]**2 + v[i]**2),
        a: a ? a[i] : Math.atan2(v[i], u[i])
        };
    }
    return result;
  }

  async onMount(signal) {
    await super.onMount(signal);
  }

  async onUnmount() {
    await super.onUnmount()
  }
}

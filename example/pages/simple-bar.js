import { BaseController  } from 'tiny-spa/baseController.js'
import { BaseComponent } from 'tiny-spa/components/baseComponent.js'
import { MockHttpRequest } from 'tiny-spa/components/http-request.js'


export class SimpleChartController extends BaseController {
  constructor(appId) {
    super(appId)
    this.components.push(new ChartComponent)
  }
}

class ChartComponent extends BaseComponent {
  constructor() {
    super("simple-bar")
    this.chartData = []
    this.fetchData(0);

    setTimeout(() => {
      const refreshButton = document.getElementById('refreshDataBtn');
      if (refreshButton) {
        refreshButton.addEventListener('click', () => this.fetchData(200));
      }
    }, 0);
  }

  /**
    * @param { number } delay
    */
  async fetchData(delay) {
    const req = new MockHttpRequest(
      "GET", "http://127.0.0.1/api", {}, {}, delay,
      {
        code: 200,
        headers : "",
        body: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100))
      },
    )

    const resp = await req.execute()
    this.chartData = resp.body
    this.updateChart();
  }

  updateChart() {
    const chartContainer = document.getElementById(this.cid);
    if (chartContainer) {
      chartContainer.innerHTML = this.chartData.map(value =>
        `<div style="width: ${value}%; background-color: #4CAF50; color: white; text-align: right; padding: 5px; margin-bottom: 5px; border-radius: 3px;">${value}</div>`
      ).join('');
    }
  }
}

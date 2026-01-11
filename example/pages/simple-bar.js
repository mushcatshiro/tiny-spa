import { BaseComponent } from 'tiny-spa/components/baseComponent.js'
import { MockHttpRequest } from 'tiny-spa/components/http-request.js'


export class ChartComponent extends BaseComponent {
  constructor() {
    super("simple-bar-container")
    this.chartData = []

    this.init();
  }

  init() {
    this.simpleBarDivId = "#simple-bar";
  }

  async onMount() {
    console.log("onMount");
    await this.fetchData(0);
    this.addListener('#refreshDataBtn', 'click', async () => await this.fetchData(200));
  }

  /**
    * @param { number } delay
    */
  async fetchData(delay) {
    console.log("here")
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
    const chartContainer = this.getComponentContainer()
      .querySelector(this.simpleBarDivId);
    if (chartContainer) {
      chartContainer.innerHTML = this.chartData.map(value =>
        `<div style="width: ${value}%; background-color: #4CAF50; color: white; text-align: right; padding: 5px; margin-bottom: 5px; border-radius: 3px;">${value}</div>`
      ).join('');
    }
  }
}

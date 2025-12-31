import { BaseController, BaseComponent } from 'tiny-spa/baseController.js'
import { MockHttpRequest } from 'tiny-spa/components/http-request.js'

export class HomeController extends BaseController {
  constructor() {
    super()
    this.components.push(new HomeComponent)
  }
}

class HomeComponent extends BaseComponent {
  constructor() {
    super("home-component")
    this.chartData = []
    this.fetchData();

    setTimeout(() => {
      const refreshButton = document.getElementById('refreshDataBtn');
      if (refreshButton) {
        refreshButton.addEventListener('click', () => this.fetchData());
      }
    }, 0);
  }

  async fetchData() {
    const req = new MockHttpRequest(
      "GET", "http://127.0.0.1/api", {}, {},
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
    const chartContainer = document.getElementById('chart');
    if (chartContainer) {
      chartContainer.innerHTML = this.chartData.map(value =>
        `<div style="width: ${value}%; background-color: #4CAF50; color: white; text-align: right; padding: 5px; margin-bottom: 5px; border-radius: 3px;">${value}</div>`
      ).join('');
    }
  }
}

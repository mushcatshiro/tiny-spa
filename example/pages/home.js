// pages/home.js

export class HomeController {
  constructor() {
    this.chartData = [];
    // Initial data fetch when the page loads
    this.fetchData();

    // We need to wait a tick for the DOM to be updated by the router
    setTimeout(() => {
      const refreshButton = document.getElementById('refreshDataBtn');
      if (refreshButton) {
        refreshButton.addEventListener('click', () => this.fetchData());
      }
    }, 0);
  }

  async onMount() { }

  /**
   * Simulates fetching data from a backend.
   */
  async fetchData() {
    console.log('Fetching new data...');
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate some random data
    this.chartData = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    console.log('Data fetched:', this.chartData);

    this.updateChart();
  }

  /**
   * Updates the chart in the DOM with the new data.
   */
  updateChart() {
    const chartContainer = document.getElementById('chart');
    if (chartContainer) {
      // Simple bar chart representation
      chartContainer.innerHTML = this.chartData.map(value =>
        `<div style="width: ${value}%; background-color: #4CAF50; color: white; text-align: right; padding: 5px; margin-bottom: 5px; border-radius: 3px;">${value}</div>`
      ).join('');
    }
  }
}
import * as d3 from "tiny-spa/frozen/d3.js";
import { ScatterChartComponent } from 'tiny-spa/components/scatter-plot.js'

export class ExampleScatterChartController {
  constructor() {
    const url = "https://corsproxy.io/?https://data.giss.nasa.gov/gistemp/tabledata_v3/GLB.Ts+dSST.csv";

    // 1. Fetch the data as plain text instead of parsing it directly.
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        // 2. Clean the text by removing the first two metadata lines.
        const lines = text.split('\n');
        const cleanedText = lines.slice(1).join('\n');

        // 3. Parse the cleaned CSV string. d3.csvParse will now correctly
        // identify "Year,Jan,Feb..." as the header.
        const raw = d3.csvParse(cleanedText);

        // Your data pivoting logic from here was correct!
        const data = [];
        const months = raw.columns.slice(1, 13); // Get month columns: Jan, Feb, ...

        raw.forEach(d => {
          // Ensure the row has a valid year before processing
          if (d.Year && !isNaN(d.Year)) {
            months.forEach((month, monthIndex) => {
              const val = d[month];
              // Check for missing data points, which are marked as "***"
              if (val !== "***") {
                data.push({
                  date: new Date(Date.UTC(+d.Year, monthIndex, 1)), // monthIndex is 0-11
                  value: +val // Convert value from string to number
                });
              }
            });
          }
        });

        // 4. Render the chart with the correctly formatted data.
        new ScatterChartComponent(
          { "targetElementId": "#chart" },
          data
        );
      })
      .catch(error => {
        console.error('Failed to fetch or process data:', error);
      });
  }
}
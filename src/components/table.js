/**
 * @class TableComponent
 * @description A reusable component to generate a table from JSON data.
 * The table can be configured to be searchable across all columns.
 */
export class TableComponent {
  /**
   * @param {object} options - The configuration for the table.
   * @param {string} options.targetElementId - The ID of the DOM element where the table will be rendered.
   * @param {Array<object>} options.data - The JSON data to display, an array of objects.
   * @param {boolean} [options.isSearchable=false] - A flag to enable or disable the search functionality.
   * @param {string} [options.title=''] - An optional title to display above the table.
   */
  constructor(options) {
    // --- 1. Parameter Validation and Initialization ---
    if (!options.targetElementId || !document.getElementById(options.targetElementId)) {
      throw new Error('A valid targetElementId must be provided.');
    }
    if (!options.data || !Array.isArray(options.data) || options.data.length === 0) {
      throw new Error('Data must be a non-empty array of objects.');
    }

    this.targetElement = document.getElementById(options.targetElementId);
    this.originalData = options.data;
    this.filteredData = [...this.originalData]; // Start with all data visible
    this.isSearchable = options.isSearchable || false;
    this.title = options.title || '';

    // Get table headers from the keys of the first object in the data array
    this.headerKeys = Object.keys(this.originalData[0]);

    // Debounce the search handler to prevent excessive re-renders on every keystroke
    this.debouncedSearch = this.debounce(this.handleSearch.bind(this), 300);

    // --- 2. Render the Component ---
    this.render();
  }

  /**
   * Utility to delay function execution.
   * @param {Function} func - The function to debounce.
   * @param {number} delay - The delay in milliseconds.
   * @returns {Function} - The debounced function.
   */
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  /**
   * Handles the search input event, filters data, and re-renders the table body.
   * @param {Event} event - The input event from the search field.
   */
  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();

    if (!searchTerm) {
      this.filteredData = [...this.originalData];
    } else {
      this.filteredData = this.originalData.filter(row => {
        // Check if ANY value in the row contains the search term
        return Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm)
        );
      });
    }

    this.renderTableBody();
  }

  /**
   * Renders only the body of the table. This is efficient for search updates.
   */
  renderTableBody() {
    const tbody = this.targetElement.querySelector('tbody');
    if (!tbody) return;

    // Clear existing rows
    tbody.innerHTML = '';

    // Handle case where no results are found
    if (this.filteredData.length === 0) {
      const colCount = this.headerKeys.length;
      tbody.innerHTML = `
        <tr>
          <td colspan="${colCount}" class="text-center py-10 px-4 text-gray-500">
            <p class="font-semibold">No results found.</p>
            <p class="text-sm">Try adjusting your search term.</p>
          </td>
        </tr>`;
      return;
    }

    // Create and append new rows
    const rowsHtml = this.filteredData.map((row, index) => {
      const cellsHtml = this.headerKeys.map(key =>
        `<td class="p-4 text-gray-700">${row[key]}</td>`
      ).join('');

      return `<tr class="border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors duration-200">${cellsHtml}</tr>`;
    }).join('');

    tbody.innerHTML = rowsHtml;
  }

  /**
   * Renders the entire component structure (search bar, table shell) and attaches event listeners.
   */
  render() {
    // --- Component's Main Structure ---
    const componentHtml = `
      <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div class="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 bg-gray-50">
          ${this.title ? `<h2 class="text-xl font-bold text-gray-800">${this.title}</h2>` : '<div></div>'}
          ${this.isSearchable ? `
          <div class="relative w-full sm:w-auto">
            <input type="text" placeholder="Search table..." class="search-input w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>` : ''}
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm text-left">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>${this.headerKeys.map(key => `
                <th class="p-4 font-semibold text-gray-600 uppercase tracking-wider">${key}</th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              <!-- Table body will be rendered here -->
              </tbody>
          </table>
        </div>
      </div>`;

    // Set the HTML and render the initial table body
    this.targetElement.innerHTML = componentHtml;
    this.renderTableBody();

    // --- Attach Event Listeners ---
    if (this.isSearchable) {
      const searchInput = this.targetElement.querySelector('.search-input');
      searchInput.addEventListener('input', this.debouncedSearch);
    }
  }
}

export default TableComponent
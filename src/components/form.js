// spa-framework/components/form.js

/**
 * @class FormComponent
 * @description A reusable component to generate and handle HTML forms from a JSON config.
 */
export class FormComponent {
  /**
   * @param {object} config - The configuration object for the form.
   * @param {string} config.targetElementId - The ID of the DOM element where the form will be rendered.
   * @param {Array<object>} config.fields - An array of field configuration objects.
   * @param {object} config.submitButton - Configuration for the submit button.
   * @param {object} config.api - API endpoint details for form submission.
   */
  constructor(config) {
    this.config = config;
    this.render();
  }

  /**
   * Generates the form's HTML based on the configuration.
   * @returns {string} The complete HTML string for the form.
   */
  generateHtml() {
    const fieldsHtml = this.config.fields.map(field => {
      const requiredAttr = field.required ? 'required' : '';
      let fieldHtml = `<div class="form-field" style="margin-bottom: 1rem;">
  <label for="${field.name}" style="display: block; margin-bottom: 0.5rem;">${field.label}</label>`;

      switch (field.type) {
        case 'textarea':
          fieldHtml += `<textarea id="${field.name}" name="${field.name}" ${requiredAttr} style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;"></textarea>`;
          break;
        case 'email':
        case 'text':
        case 'password':
        case 'number':
        default:
          fieldHtml += `<input type="${field.type}" id="${field.name}" name="${field.name}" ${requiredAttr} style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;">`;
          break;
      }
      fieldHtml += `</div>`;
      return fieldHtml;
    }).join('');

    return `<form id="generated-form">
  ${fieldsHtml}
  <button type="submit" style="padding: 0.75rem 1.5rem; border: none; background-color: #007bff; color: white; border-radius: 4px; cursor: pointer;">
    ${this.config.submitButton.text}
  </button>
</form>
<div id="form-status" style="margin-top: 1rem;"></div>`;
  }

  /**
   * Renders the form into the target element and attaches event listeners.
   */
  render() {
    const targetElement = document.getElementById(this.config.targetElementId);
    if (!targetElement) {
      console.error(`Form component target element with ID "${this.config.targetElementId}" not found.`);
      return;
    }

    targetElement.innerHTML = this.generateHtml();
    this.attachEventListeners();
  }

  /**
   * Attaches the submit event listener to the form.
   */
  attachEventListeners() {
    const form = document.getElementById('generated-form');
    if (form) {
      form.addEventListener('submit', (event) => this.handleSubmit(event));
    }
  }

  /**
   * Handles the form submission.
   * @param {Event} event - The form submission event.
   */
  async handleSubmit(event) {
    event.preventDefault();
    const formStatus = document.getElementById('form-status');
    formStatus.textContent = 'Submitting...';
    formStatus.style.color = 'black';

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      // In a real app, you would uncomment this fetch call.
      // For this demo, we will simulate the API call.
      console.log('Submitting to:', this.config.api.endpoint);
      console.log('With data:', data);

      /*
      const response = await fetch(this.config.api.endpoint, {
          method: this.config.api.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      */

      // Simulate a successful API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      formStatus.textContent = 'Form submitted successfully!';
      formStatus.style.color = 'green';
      event.target.reset();

    } catch (error) {
      console.error('Form submission error:', error);
      formStatus.textContent = 'Failed to submit form. Please try again.';
      formStatus.style.color = 'red';
    }
  }
}

export default FormComponent
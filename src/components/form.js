import { BaseController, SpaError } from '../baseController.js'

/**
  * @typedef { Object } formField
  * @property { string } formType
  * @property { string } formName
  * @property { string } formLabel
  * @property { boolean } formRequired
  */

/**
  * @typedef { Object } submitBtnObj
  * @property { string } text
  */

/**
  * @typedef { Object } apiObj
  * @property { string } endpoint
  * @property { string } method
  */

/**
  * @typedef { Object } formConfig
  * @property { string } targetElementId
  * @property { Array<formField> } fields
  * @property { submitBtnObj } submitButton
  * @property { apiObj } api
  */

/**
  * @class FormComponent
  * @description A reusable component to generate and handle HTML forms from a JSON config.
  */
export class FormComponent extends BaseController {
  /**
    * @param { formConfig } formConfig - The configuration object for the form.
    * @param { string } cid
    * @param { string } customCss
    */
  constructor(formConfig, cid, customCss) {
    super(cid, customCss)
    this.formConfig = formConfig;
    this.render();
  }

  /**
   * Generates the form's HTML based on the configuration.
   * @returns {string} The complete HTML string for the form.
   */
  generateHtml() {
    const fieldsHtml = this.formConfig.fields.map(field => {
      const requiredAttr = field.formRequired ? 'required' : '';
      let fieldHtml = `<div class="form-field" style="margin-bottom: 1rem;">
  <label for="${field.formName}" style="display: block; margin-bottom: 0.5rem;">${field.formLabel}</label>`;

      switch (field.formType) {
        case 'textarea':
          fieldHtml += `<textarea id="${field.formName}" name="${field.formName}" ${requiredAttr} style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;"></textarea>`;
          break;
        case 'email':
        case 'text':
        case 'password':
        case 'number':
        default:
          fieldHtml += `<input type="${field.formType}" id="${field.formName}" name="${field.formName}" ${requiredAttr} style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;">`;
          break;
      }
      fieldHtml += `</div>`;
      return fieldHtml;
    }).join('');

    return `<form id="generated-form">
  ${fieldsHtml}
  <button type="submit" style="padding: 0.75rem 1.5rem; border: none; background-color: #007bff; color: white; border-radius: 4px; cursor: pointer;">
    ${this.formConfig.submitButton.text}
  </button>
</form>
<div id="form-status" style="margin-top: 1rem;"></div>`;
  }

  render() {
    const targetElement = document.getElementById(this.config.targetElementId);
    if (!targetElement) {
      console.error(`Form component target element with ID "${this.config.targetElementId}" not found.`);
      return;
    }

    targetElement.innerHTML = this.generateHtml();
    this.attachEventListeners();
  }

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

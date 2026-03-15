import { SpaError } from '../baseController.js'
import { BaseComponent } from './baseComponent.js'

/**
  * @typedef { Object } option
  * @property { string } value
  * @property { string } displayValue
  */

/**
  * @typedef { Object } baseField
  * @property { string } formType
  * @property { string } formName
  * @property { string } formLabel
  * @property { boolean } formRequired
  */

/**
  * @typedef {(
  *  ( baseField & { formType: "text" } ) |
  *  ( baseField & { formType: "number" } ) |
  *  ( baseField & { formType: "datetime-local" } ) |
  *  ( baseField & { formType: "select", options: Array<option> } ) |
  *  ( baseField & { formType: "email", pattern?: string } ) |
  *  ( baseField & { formType: "url", pattern?: string } ) |
  *  ( baseField & { formType: "file", accept: string } ) |
  *  ( baseField & { formType: "textarea" } ) |
  *  ( baseField & { formType: "password" } )
  * )} formField
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
  * @property { function } customSubmitFunc
  */

/**
  * @param { string } targetElmId
  * @param { string } btnText
  * @param { string } endpoint
  * @param { string } method
  */
function buildSubmitBtnFormConfig(targetElmId, btnText, endpoint, method) {
  return {
    targetElementId: targetElmId,
    submitBtnObj: { text: btnText },
    apiObj: { endpoint: endpoint, method: method },
  }
}

function buildFormField() {}

/**
  * @class FormComponent
  * @description A reusable component to generate and handle HTML forms from a JSON config.
  */
class FormComponent extends BaseComponent {
  /**
    * @param { formConfig } formConfig - The configuration object for the form.
    * @param { string } cid
    * @param { string } customCss
    */
  constructor(formConfig, cid, customCss) {
    super(cid, customCss)
    this.customSubmitFunc = formConfig.customSubmitFunc
    this.config = formConfig;
    this.registerDefaultCss()
  }

  registerDefaultCss() {
    this.defaultCss = `
    .form-field {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    textarea, input, option, select {
      width: 100%;
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
    button {
      padding: 0.75rem 1.5rem;
      border: none;
      background-color: #007bff;
      color: white;
      border-radius: 4px;
      cursor: pointer;
    }
    #form-status {
      margin-top: 1rem;
    }`
  }

  /**
   * Generates the form's HTML based on the configuration.
   * @returns {string} The complete HTML string for the form.
   */
  generateHtml() {
    const fieldsHtml = this.config.fields.map(field => {
      const requiredAttr = field.formRequired ? 'required' : '';
      const patternAttr = ('pattern' in field && field.pattern) ? `pattern="${field.pattern}"` : '';
      let fieldHtml = `<div class="form-field">
      <label for="${field.formName}">${field.formLabel}</label>`;

      switch (field.formType) {
        case 'textarea':
          fieldHtml += `<textarea id="${field.formName}" name="${field.formName}" ${requiredAttr}></textarea>`;
          break;
        case 'url':
        case 'email':
          fieldHtml += `<input type="${field.formName}" id="${field.formName}" name="${field.formName}" ${patternAttr} ${requiredAttr} />`;
          break
        case 'file':
          fieldHtml += `<input type="file" id="${field.formName}" name="${field.formName}" accept="${field.accept}" ${requiredAttr} />`;
          break
        case 'select':
          fieldHtml += `<select id="${field.formName}" name="${field.formName}" ${requiredAttr}>`
          for (const opt of field.options) {
            fieldHtml += `<option value="${opt.value}">${opt.displayValue}</option>`
          }
          fieldHtml += `<select/>`
          break
        case 'datetime-local': // min max
        case 'number': // min max
        case 'text': // minlength maxlength
        case 'password': // minlength
          fieldHtml += `<input type="${field.formType}" id="${field.formName}" name="${field.formName}" ${requiredAttr} />`;
          break
        default:
          throw new SpaError(`Unexpected formField ${field}`)
          break;
      }
      fieldHtml += `</div>`;
      return fieldHtml;
    }).join('');

    return `
      <form id="${this.cid}-form" for=${this.config.api.endpoint} method="POST">
      ${fieldsHtml}
      <button type="submit">
        ${this.config.submitButton.text}
      </button>
      </form>
      <div id="form-status"></div>`;
  }

  async onMount() {
    super.onMount();
    const targetElement = document.getElementById(this.config.targetElementId);
    if (!targetElement) {
      throw new SpaError(
        `Form component target element with ID "${this.config.targetElementId}" not found.`
      );
    }

    this.getComponentContainer().insertAdjacentHTML('beforeend', this.generateHtml())
    const fn = this.customSubmitFunc ? this.customSubmitFunc : this.handleSubmit
    this.addListener(`${this.cid}-form`, 'submit', fn)
  }

  /**
   * Handles the form submission.
   * @param { Event & { target: HTMLFormElement } } event - The form submission event.
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

      const response = await fetch(this.config.api.endpoint, {
          method: this.config.api.method || 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

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

export async function mockSubmitFunc(event) {
  event.preventDefault();
  const formStatus = document.getElementById('form-status');
  formStatus.textContent = 'Submitting...';
  formStatus.style.color = 'black';

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());
  await new Promise(resolve => setTimeout(resolve, 1000));
  formStatus.textContent = 'Form submitted successfully!';
  formStatus.style.color = 'green';
  event.target.reset();
}

export {
  buildSubmitBtnFormConfig,
  buildFormField,
  FormComponent,
}

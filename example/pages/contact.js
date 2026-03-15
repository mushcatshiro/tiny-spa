// spa-framework/pages/contact.js
import { BaseController } from 'tiny-spa/baseController.js'
import { FormComponent, mockSubmitFunc } from 'tiny-spa/components/form.js';

export class ContactController extends BaseController {
  constructor(appId) {
    super(appId)
    /** @typedef {import('tiny-spa/components/form.js').formConfig} formConfig */
    /** @type {formConfig} */
    const config = {
      targetElementId: 'contact-form-container',
      fields: [
        {
          formType: 'text',
          formName: 'name',
          formLabel: 'Your Name',
          formRequired: true
        },
        {
          formType: 'number',
          formName: 'age',
          formLabel: 'Your Age',
          formRequired: true
        },
        {
          formType: 'datetime-local',
          formName: 'datetime',
          formLabel: 'Date & Time',
          formRequired: true
        },
        {
          formType: 'select',
          formName: 'country',
          formLabel: 'Country',
          options: [
            {value: "US", displayValue:"United States of America"},
            {value: "UK", displayValue:"United Kingdom"},
          ],
          formRequired: true
        },
        {
          formType: 'email',
          formName: 'email',
          formLabel: 'Your Email',
          formRequired: true,
        },
        {
          formType: 'url',
          formName: 'url',
          formLabel: 'URL',
          pattern: 'https://.*',
          formRequired: true
        },
        {
          formType: 'textarea',
          formName: 'message',
          formLabel: 'Message',
          formRequired: true
        },
        {
          formType: 'password',
          formName: 'password',
          formLabel: 'Password',
          formRequired: true
        },
      ],
      submitButton: {
        text: 'Send Message'
      },
      api: {
        // This is the backend endpoint the form will post to.
        endpoint: 'https://api.example.com/contact',
        method: 'POST'
      },
      customSubmitFunc: mockSubmitFunc,
    };

    // Initialize the form component with the configuration.
    // The component handles its own rendering and logic.
    this.components.push(
      new FormComponent(config, "contact-form-container", "")
    );
  }
}

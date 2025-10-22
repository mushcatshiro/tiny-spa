// spa-framework/pages/contact.js
import { BaseController } from 'tiny-spa/baseController.js'
import { FormComponent } from 'tiny-spa/components/form.js';

export class ContactController extends BaseController {
  constructor() {
    super()
    // Define the entire form structure and behavior in a single JSON object.
    const formConfig = {
      targetElementId: 'contact-form-container',
      fields: [
        {
          type: 'text',
          name: 'name',
          label: 'Your Name',
          required: true
        },
        {
          type: 'email',
          name: 'email',
          label: 'Your Email',
          required: true
        },
        {
          type: 'textarea',
          name: 'message',
          label: 'Message',
          required: true
        }
      ],
      submitButton: {
        text: 'Send Message'
      },
      api: {
        // This is the backend endpoint the form will post to.
        endpoint: 'https://api.example.com/contact',
        method: 'POST'
      }
    };

    // Initialize the form component with the configuration.
    // The component handles its own rendering and logic.
    new FormComponent(formConfig);
  }
}
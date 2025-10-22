import BaseController from 'tiny-spa/baseController.js';
import { MarkdownBlockComponent } from 'tiny-spa/components/markdown-block.js'


export class ExampleMdController extends BaseController {
  constructor() {
    super()
    new MarkdownBlockComponent("#md-block", "./pages/example.md")
  }
}
import { BaseController  } from 'tiny-spa/baseController.js'
import { QuiverPlotComponent } from 'tiny-spa/components/plots/quiver-plot.js'

export class QuiverController extends BaseController {
  constructor(appId) {
    super(appId)
    this.components.push(new QuiverPlotComponent(
      [], "some-cid", ""
    ))
  }

  async onMount() {
    super.onMount();
  }

  async onUnmount() {
    super.onUnmount()
  }
}

import TableComponent from "tiny-spa/components/table.js";
import { HttpRequest } from "tiny-spa/components/http-request.js";


export class ExampleHttpRequestController {
  constructor() {}
  async onMount() {
    const r = new HttpRequest(
      "GET",
      "https://dummyjson.com/posts?limit=10"
    )
    const resp = await r.execute()
    new TableComponent({
      targetElementId: "table-container-1",
      data: resp.posts,
      isSearchable: false, 
      title: "random posts"
    })
  }
}
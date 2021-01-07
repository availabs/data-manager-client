import PageView from "./components/PageView"

import WebFormat from "./format.type"

const config = {
  type: PageView,
  wrappers: [
    "dms-provider",
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: WebFormat,
    title: "Website Test"
  }
}
export default config;

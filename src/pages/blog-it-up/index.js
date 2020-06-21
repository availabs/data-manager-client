// import DmsComponents from "components/DMS"
// import DmsWrappers from "components/DMS/wrappers"

// import {
//   addComponents,
//   addWrappers
// } from "components/avl-components/ComponentFactory"

import config from "./config"

// addComponents(DmsComponents)
// addWrappers(DmsWrappers)

export default {
  path: "/blog",
  mainNav: true,
  // exact: true,
  auth: true,
  name: 'Blog it Up',
  icon: 'fas fa-blog',
  layoutSettings: {
    fixed: false,
    nav: 'side',
    headerBar: false,
    theme: 'TEST_THEME'
  },
  component: config
}

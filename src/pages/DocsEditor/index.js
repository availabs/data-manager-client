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
  path: "/docs",
  mainNav: true,
  // exact: true,
  auth: true,
  name: 'Docs',
  icon: '',
  layoutSettings: {
    fixed: false,
    nav: 'side',
    maxWidth: 'max-w-7xl',
    headerBar: false,
    theme: 'flat'
  },
  component: config
}

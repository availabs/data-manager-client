import React from "react"
import { Redirect } from "react-router-dom"

import DmsComponents from "components/DMS"
import DmsWrappers from "components/DMS/wrappers"

import Factory, {
  addComponents,
  addWrappers
} from "components/avl-components/ComponentFactory"

import config from "./config"

addComponents(DmsComponents)
addWrappers(DmsWrappers)

export default [
  // { path: "/", exact: true, component: <Redirect to="/dms"/> },
  { path: "/dms",
    mainNav: true,
    // exact: true,
    // auth: true,
    name: 'Blog It Up',
    icon: 'HomeOutline',
    layoutSettings: {
      fixed: true,
      nav: 'side',
      maxWidth: '',
      headerBar: false,
      theme: 'light'
    },
    component: config
  }
]

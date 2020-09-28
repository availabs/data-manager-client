import AmsComponents from "components/AMS"
import AmsWrappers from "components/AMS/wrappers"

import DmsComponents from "components/DMS"

import {
  addComponents,
  addWrappers
} from "components/avl-components/ComponentFactory"

addComponents(AmsComponents)
addWrappers(AmsWrappers)

addComponents(DmsComponents)

const AUTH = {
  type: "ams-manager",
  wrappers: [
    "ams-redux",
    "ams-router"
  ],
  props: { project: "NPMRDS" },
  children: [
    { type: "ams-login",
      props: { amsAction: "login" }
    },
    { type: "ams-logout",
      props: { amsAction: "logout", redirectTo: "/" }
    },
    { type: "ams-project-management",
      props: {
        amsAction: "project-management",
        authLevel: 5
      }
    }
  ]
}

export default {
  path: "/auth",
  mainNav: false,
  // exact: true,
  // auth: true,
  layoutSettings: {
    fixed: true,
    nav: 'side',
    headerBar: false,
    theme: 'TEST_THEME'
  },
  component: AUTH
}

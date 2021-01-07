import React from "react"

import { Redirect } from "react-router-dom"

import admin from "./admin.config"

import view from "./view.config"

const webTest = [
  { path: "/web-test",
    mainNav: true,
    // auth: true,
    exact: true,
    name: 'Web Test',
    icon: 'fas fa-blog',
    layoutSettings: {
      fixed: true,
      navBar: 'side',
      headerBar: false
    },
    component: () => <Redirect to="/web-test/view/page/home"/>
  },
  { path: "/web-test",
    mainNav: false,
    // auth: true,
    // exact: true,
    name: 'Web Test',
    icon: 'fas fa-blog',
    layoutSettings: {
      fixed: true,
      navBar: 'side',
      headerBar: false
    },
    component: view
  },
  { path: "/web-test-dev",
    mainNav: true,
    // auth: true,
    name: 'Web Test Dev',
    icon: 'fas fa-blog',
    layoutSettings: {
      fixed: true,
      navBar: 'side',
      headerBar: false
    },
    component: admin
  }
]
export default webTest

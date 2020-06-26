import config from "./config"
import wrapper from "./TestWrapper"

export default [
  wrapper,
  {
    path: "/test",
    mainNav: true,
    // exact: true,
    auth: true,
    name: 'Test',
    icon: 'fas fa-vial',
    layoutSettings: {
      fixed: false,
      nav: 'side',
      headerBar: false,
      theme: 'TEST_THEME'
    },
    component: config
  }
]

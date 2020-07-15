import config from "./config"
import consumer from "./TestConsumer"

export default [
  consumer,
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

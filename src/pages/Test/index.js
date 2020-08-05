import config from "./config"
import consumer from "./TestConsumer"
import stuff from "./TestStuff"

export default [
  consumer,
  stuff,
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

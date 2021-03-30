import config from "./config"

export default {
  path: "/shmp-cms",
  mainNav: false,
  exact: false,
  auth: true,
  layoutSettings: {
    nav: 'side',
    headerBar: false,
    theme: 'TEST_THEME'
  },
  component: config
}

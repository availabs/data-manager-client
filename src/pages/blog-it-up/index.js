import config from "./config"

export default {
  path: "/blog",
  mainNav: true,
  // exact: true,
  auth: true,
  name: 'Blog it Up',
  icon: 'fas fa-blog',
  layoutSettings: {
    fixed: true,
    nav: 'side',
    headerBar: false,
    theme: 'TEST_THEME'
  },
  component: config
}

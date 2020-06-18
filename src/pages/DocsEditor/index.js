import config from "./docs-config"


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

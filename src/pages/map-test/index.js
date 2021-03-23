import config from "./config"

const MapTest = [
  {
    path: "/map-test",
    mainNav: true,
    // exact: true,
    auth: true,
    name: 'Map Test',
    icon: 'fas fa-map',
    layoutSettings: {
      fixed: true,
      nav: 'top',
      headerBar: false,
      theme: 'TEST_THEME'
    },
    component: config
  }
]
export default MapTest

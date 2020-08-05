import TestStuff from "./stuff"

const format = {
  app: "Test",
  type: "Fake",
  attributes: [
    { key: "text",
      type: "text"
    },
    { key: "index",
      type: "number"
    }
  ]
}

export default {
  path: '/test/stuff',
  exact: true,
  auth: true,
  layoutSettings: {
    fixed: false,
    nav: 'side',
    headerBar: false,
    theme: 'TEST_THEME'
  },
  component: {
    type: TestStuff,
    wrappers: [
      "dms-provider",
      "show-loading",
      "dms-falcor"
    ],
    props: { format }
  }
}

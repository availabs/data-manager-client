import { /*docsPage, docsSection,*/ npmrdsDoc } from './docs.type'
import SectionManager from './components/SectionManager'
import PageEdit from './components/PageEdit'
import PageView from './components/PageView'


let config = {
  type: "dms-content",
  // type: "dms-manager",
  wrappers: [
// wrapper order is important
// from index zero to i, higher index wrappers send props into lower index wrappers
// higher index wrappers do not see props from lower index wrappers
    "dms-manager",
    "dms-provider",
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: npmrdsDoc,
    title: "Documentation",
  },
  children: [   
  // dms-manager children are special
  // they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: SectionManager,
      props: {
        dmsAction: "list"
      }
    },
    { type: PageView,
      props: { dmsAction: "view" }
    },

    { type: PageEdit,
      props: {
        dmsAction: "create",
      },
      wrappers: [ "dms-create", "with-auth"]
    },

    { type: PageEdit,
      props: { dmsAction: "edit" },
      wrappers: ["dms-edit","with-auth"]
    }
  ]
}

export default {
  path: "/docs",
  mainNav: true,
  // exact: true,
  auth: true,
  name: 'Docs Editor',
  icon: '',
  layoutSettings: {
    fixed: true,
    nav: 'side',
    maxWidth: '',
    headerBar: false,
    theme: 'flat'
  },
  component: config
}

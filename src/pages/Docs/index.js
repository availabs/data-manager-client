import { /*docsPage, docsSection,*/ npmrdsDoc } from './docs.type'
import SectionManager from './components/SectionManager'


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
    { type: "dms-header",
      props: { title: "Documentation" }
    },
// dms-manager children are special
// they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: SectionManager,
      props: {
        dmsAction: "list"
      }
    },

    { type: "dms-card", // generic dms component for viewing a single data item
      props: { dmsAction: "view" },
      wrappers: [
        { type: "dms-view",
          options: {
            mapDataToProps: {
// mapDataToProps is used by dms-view to map data items to wrapped component props
// prop: [...attributes]
              title: "item:data.title",
              body: [
                "item:data.test-format-2",
              ],
              footer: [
                "item:data.creator",
                { path: "item:updated_at",
                  format: "date"
                }
              ]
            }
          }
        }
      ]
    },

    { type: "dms-create",
      props: {
        dmsAction: "create",
        // dmsActions: [
        //   { action: "dms:fake-three",
        //     buttonTheme: "buttonPrimary"
        //   },
        //   { action: "dms:fake-four",
        //     buttonTheme: "buttonSuccess"
        //   }
        // ]
      },
      wrappers: ["with-auth"]
    },

    { type: "dms-edit",
      props: { dmsAction: "edit" },
      wrappers: ["with-auth"]
    }
  ]
}

export default {
  path: "/docs",
  mainNav: true,
  // exact: true,
  auth: true,
  name: 'Docs',
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

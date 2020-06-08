import { DMS_DOCS } from "./dms-docs.type"

import get from "lodash.get"

export default ({
  type: "dms-manager", // top level component for managing data items
  wrappers: [
// wrapper order is important
// from index zero to i, higher index wrappers send props into lower index wrappers
// higher index wrappers do not see props from lower index wrappers
    "show-loading",
    "dms-router",
    "dms-falcor",
    "use-auth"
  ],
  props: {
    format: DMS_DOCS,
    title: "DMS Docs",
    buttonColors: {
      reply: "green"
    },
    authRules: {
      create: {
        args: ["props:user.authLevel"],
        comparator: al => +al === 10
      },
      edit: {
        args: ["props:user.authLevel"],
        comparator: al => +al === 10
      },
      delete: {
        args: ["props:user.authLevel"],
        comparator: al => +al === 10
      }
    }
  },
  children: [
// dms-manager children are special
// they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: "dms-list", // generic dms component for viewing multiple data items
      props: {
        dmsAction: "list",
        attributes: [
          "title", "body",
          "dms:view", "dms:edit", "dms:delete",
          { action: "api:delete",
            label: "API delete",
            color: "red",
            showConfirm: true }
        ],
        title: "DMS Docs"
      },
      wrappers: ["with-theme"]
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
                "item:data.body",
                "item:data.tags",
                "item:updated_at"
              ]
            }
          }
        }
      ]
    },

    { type: "dms-create",
      props: { dmsAction: "create" },
      wrappers: ["use-auth"]
    },

    { type: "dms-edit",
      props: { dmsAction: "edit" },
      wrappers: ["use-auth"]
    },

    { type: "dms-card",
      props: { dmsAction: "delete" },
      wrappers: [
        { type: "dms-view",
          options: {
            mapDataToProps: {
              title: "item:data.title",
              body: [
                "item:data.body",
                "item:data.tags",
                "item:updated_at"
              ]
            },
            actions: [{
              action: "api:delete",
              showConfirm: true
            }]
          }
        }
      ]
    }
  ]
})

import { BLOG_POST } from "./blog_post"

import get from "lodash.get"

export default ({
  type: "dms-manager", // top level component for managing data items
  wrappers: [
// wrapper order is important
// from index zero to i, higher index wrappers send props into lower index wrappers
// higher index wrappers do not see props from lower index wrappers
    "dms-router",
    "dms-falcor",
    "use-auth"
  ],
  props: {
    format: BLOG_POST,
    // useRouter: true,
    title: "Blog It Up",
    buttonColors: {
      reply: "green"
    },
    authRules: {
      create: {
        args: ["props:user.authLevel"],
        comparator: al => al !== null
      },
      edit: {
        args: ["item:data.bloggerId", "props:user.id"],
        comparator: (arg1, arg2) => +arg1 === +arg2
      },
      delete: {
        args: ["item:data.bloggerId", "props:user.id", "props:user.authLevel"],
        comparator: (arg1, arg2, arg3) => (+arg1 === +arg2) || (+arg3 === 10)
      },
      reply: {
        args: ["props:user.authLevel"],
        comparator: al => al !== null
      }
    }
  },
  children: [
// dms-manager children are special
// they are only shown when the dms-manager state.dmsAction === child.props.dmsAction
    { type: "dms-list", // generic dms component for viewing multiple data items
      // wrappers: ["use-auth"],
      props: {
        attributes: [
          "title", "bloggerId",
          "dms:view", "dms:edit", "dms:delete"
        ],
        title: "Blogs",
        filter: {
          args: ["item:data.replyTo"],
          comparator: arg1 => arg1 === null
        }
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
                "item:data.bloggerId",
                "item:data.body",
                "item:data.tags",
                "item:updated_at",
                "props:user.id"
              ]
            },
            actions: [
              { action: "dms:reply",
// this sends props into the DMS Manager reply component from the dms-view wrapper
                seedProps: props => ({ test: "prop" })
              }
            ]
          }
        },
        "use-auth"
      ],
      children: [
        { type: "dms-list",
          props: {
            attributes: ["title", "bloggerId", "body"],
            className: "mt-5",
            title: "Replies"
          },
          wrappers: [{
            type: "dms-falcor",
            options: {
              filter: {
                args: ["item:data.replyTo", "props:blog-post.id"],
                comparator: (arg1, arg2) => +arg1 === +arg2
              }
            }
          }]
        }
      ]
    },

    { type: "dms-create",
      props: { dmsAction: "create" },
      wrappers: ["use-auth"]
    },

    { type: "dms-create",
      props: { dmsAction: "reply" },
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
                "item:data.bloggerId",
                "item:data.body",
                "item:data.tags",
                "item:updated_at",
                "props:user.id"
              ]
            },
            actions: [{
              action: "api:delete",
              seedProps: props =>
// these ids are sent to the api:delete function
                get(props, "dataItems", []).reduce((a, c) =>
                  get(c, ["data", "replyTo"]) == get(props, ["blog-post", "id"]) ? [...a, c.id] : a
                , [])
            }]
          }
        },
        "use-auth"
      ]
    }
  ]
})

import React from "react"

import { BLOG_POST } from "./blog-post.type"
import BlogPost from "./blog-post"

import get from "lodash.get"

export default ({
  type: ({ children }) => <div className="flex"><div className="mt-20 pt-8 flex-1 w-full mx-auto max-w-7xl mb-10">{ children }</div></div>,
  // type: "dms-manager",
  wrappers: [
// wrapper order is important
// from index zero to i, higher index wrappers send props into lower index wrappers
// higher index wrappers do not see props from lower index wrappers
    "dms-manager",
    { type: "dms-provider",
      options: {
        buttonThemes: {
          reply: "buttonInfo"
        }
      }
    },
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: BLOG_POST,
    title: "Blog it Up",
    className: "max-w-7xl m-auto pb-10",
    authRules: {
      create: {
        args: ["props:user.authLevel"],
        comparator: al => al !== null
      },
      edit: {
        args: ["item:data.bloggerId", "props:user.id", "props:user.authLevel"],
        comparator: (arg1, arg2, arg3) => (+arg1 === +arg2) || (+arg3 === 10)
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
    { type: "dms-header",
      props: { title: "Blog it Up" }
    },
// dms-manager children are special
// they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: "dms-list",
      props: {
        dmsAction: "list",
        dmsActions: ["dms:fake-one", "dms:fake-two"],
        columns: [
          "self:data.title",
          "self:data.bloggerId",
          { source: "self:updated_at",
            format: "date:MMM Do, YYYY h:mm a"
          },
          "dms:view",
          "dms:edit",
          "dms:delete"
        ],
        filter: {
          args: ["self:data.replyTo"],
          comparator: arg1 => !Boolean(arg1)
        }
      }
    },

    { type: BlogPost,
      props: { dmsAction: "view" }
    },

    { type: "dms-card", // generic dms component for viewing a single data item
      props: {
        dmsAction: "viewOld",
        dmsActions: [
          { action: "dms:fake-three",
            buttonTheme: "buttonPrimary"
          },
          { action: "dms:fake-four",
            buttonTheme: "buttonSuccess"
          }
        ],
      },
      wrappers: [
        { type: "dms-view",
          options: {
            mapDataToProps: {
// mapDataToProps is used by dms-view to map data items to wrapped component props
// prop: [...attributes]
              title: "item:data.title",
              body: [
                "item:data.body",
                "item:data.bloggerId",
                "item:data.tags",
                "item:updated_at"
              ]
            },
            actions: ["dms:reply"]
          }
        }
      ],
      children: [
        { type: "dms-list",
          props: {
            columns: ["title", "bloggerId", "body"],
            className: "mt-5",
            title: "Replies"
          },
          wrappers: [
            "with-theme",
            {
              type: "dms-falcor",
              options: {
                filter: {
                  args: ["self:data.replyTo", "props:blog-post.id"],
                  comparator: (arg1, arg2) => +arg1 === +arg2
                }
              }
            }
          ]
        }
      ]
    },

    { type: "dms-create",
      props: { dmsAction: "create" },
// dms-create defaults to dmsAction: "create"
// the prop is required here due to the wrapper
      wrappers: ["with-auth"]
    },

    { type: "dms-create",
      props: { dmsAction: "reply" },
      wrappers: ["with-auth"]
    },

    { type: "dms-edit",
      props: { dmsAction: "edit" },
      wrappers: ["with-auth"]
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
                "item:data.image",
                "item:updated_at",
                "props:user.id"
              ]
            },
            actions: [{
              action: "api:delete",
              showConfirm: true,
              seedProps: props =>
// these ids are sent to the api:delete function
                get(props, "dataItems", []).reduce((a, c) =>
                  get(c, ["data", "replyTo"]) === get(props, ["blog-post", "id"]) ? [...a, c.id] : a
                , [])
            }]
          }
        },
        "with-auth"
      ]
    }
  ]
})

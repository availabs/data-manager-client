import React from "react"

import get from "lodash.get"

export default
{
  path: '/',
  mainNav: true,
  exact: true,
  name: 'Blog Test',
  icon: 'HomeOutline',
  layoutSettings: {
    fixed: true,
    nav: 'side',
    maxWidth: '',
    headerBar: false,
    theme: 'light'
  },

  component: {
    type: "dms-manager", // top level component for managing data items
    wrappers: [
      { type: "dms-falcor",
        options: {
          // path: ["dms", "data", "user", "props:user.id", "props:app", "props:type"],
          filter: {
            args: ["item:data.replyTo"],
            comparator: arg1 => arg1 === null
          },
        }
      },
      "use-auth"
    ],
    props: {
      app: "my-blog",
      type: "blog-post",
      defaultAction: "list",
      actions: ["create"],
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
          comparator: (arg1, arg2) => arg1 === arg2
        },
        delete: {
          args: ["item:data.bloggerId", "props:user.id", "props:user.authLevel"],
          comparator: (arg1, arg2, arg3) => (arg1 === arg2) || (arg3 === 10)
        },
        reply: {
          args: ["props:user.authLevel"],
          comparator: al => al !== null
        }
      }
    },
    children: [
// dms-manager children are special
// they are only shown when the dms-manager state.action === child.props.action
      { type: "dms-list", // generic dms component for viewing multiple data items
        // wrappers: ["use-auth"],
        props: {
          // action: "list",
          attributes: [
            "title", "bloggerId",
            "action:view", "action:edit", "action:delete"
          ],
          title: "Blogs"
        }

      },

      { type: "dms-card", // generic dms component for viewing a single data item
        props: {
          mapDataToProps: {
// mapDataToProps is used by dms-card to map data attributes to component props
// attribute: prop
            title: "title",
            body: "content"
          },
          actions: [
            { action: "reply",
// this send props into the DMS Manager reply component from the dms-card component
              seedProps: props => ({ test: "prop" })
            }
          ],
        },
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
                  comparator: (arg1, arg2) => arg1 === arg2
                }
              }
            }]
          }
        ]
      },

      { type: "dms-create",
        props: { action: "create" },
        wrappers: ["use-auth"]
      },

      { type: "dms-create",
        props: { action: "reply" },
        wrappers: ["use-auth"]
      },

      { type: "dms-create",
        props: {
          action: "edit",
          faclor: "set",
          loadStateFromData: true
        },
        wrappers: ["use-auth"]
      }
    ]
  }
}

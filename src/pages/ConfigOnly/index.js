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
    nav: 'top',
    maxWidth: 'max-w-7xl',
    headerBar: false,
    theme: 'light'
  },

  component: {
    type: "dms-manager", // top level component for managing data items
    wrappers: ["use-auth"],
    props: {
      app: "my-blog",
      formatType: "blog-post",
      defaultAction: "list",
      actions: ["create"],
      // filter: d => get(d, ["data", "replyTo"], null) === null
      filter: {
// TODO: streamline filter creation
        // args: ["item:data.replyTo"],
        // comparator: arg => arg === null,
// END TODO
        path: ["data", "replyTo"],
        value: null,
        comparator: (data, value) => data === value
      },
      title: "Blog It Up",
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
// this send props into the DMS Manager reply component
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
                  path: ["data", "replyTo"], // this retrieves from a data item
                  value: "from:blog-post.id", // this can be a value or retreives from props
                  comparator: (d, v) => d === v
                }
              }
            }]
          }
        ]
      },

      { type: "dms-create",
        props: { action: "create" },
        wrappers: ["use-auth", "with-theme"]
      },

      { type: "dms-create",
        props: { action: "reply" },
        wrappers: ["use-auth"]
      }
    ]
  }
}

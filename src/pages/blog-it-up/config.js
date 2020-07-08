import { BLOG_POST } from "./blog-post.type"
import BlogPost from "./blog-post"

import get from "lodash.get"

export default ({
  type: "dms-content",
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
    { type: "dms-table",
      props: {
        dmsAction: "list",
        columns: [
          { path: "self:data.title",
            filter: "fuzzyText"
          },
          "self:data.bloggerId",
          { path: "self:updated_at",
            format: "date",
            disableFilters: true
          },
          "dms:edit",
          "dms:delete"
        ],
        filter: {
          args: ["self:data.replyTo"],
          comparator: arg1 => !Boolean(arg1),
          sortType: d => new Date(d).valueOf()
        }
      }
    },

    { type: BlogPost,
      props: { dmsAction: "view" }
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
              ],
              footer: [
                "item:updated_at"
              ]
            },
            actions: [{
              action: "api:delete",
              showConfirm: true,
              seedProps: props => {
// these ids are sent to the api:delete function
                const postId = +get(props, ["blog-post", "id"], null),
                  posts = get(props, "dataItems", []).map(d => ({ id: +d.id, replyTo: +d.data.replyTo }));

                const getReplies = (posts, id, final) => {
                  const replies = posts.filter(d => d.replyTo === id);
                  if (!replies.length) return final;

                  for (const reply of replies) {
                    final.push(...getReplies(posts, reply.id, [reply.id]));
                  }

                  return final;
                }
                return getReplies(posts, postId, [postId]);
              }
            }]
          }
        },
        "with-auth"
      ]
    }
  ]
})

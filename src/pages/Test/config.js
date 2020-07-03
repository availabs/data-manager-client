import React from 'react';

import TEST_FORMAT from "./test-config.type"

const domain = [
  "Text 1", "Text 2", "Text 3",
  '???????? ????????',
  '????????? ??????????',
  "!!!!!!!!", "###### #####",
  "!!! !!!!! !!!", "######## #######",
  '????????? ?????? ???',
  '???? ?????? ????????????',
  "!!! !!!!!!", "####### ######",
  "!!!!!!!! !!!!!", "########## ########",
  '????????? ???? ?????',
  '?? ????????? ??????? ?? ??',
  "!!!! !!!!!! !!!!", "####### #####",
  "!!!!!!!!! !!!!", "######### #######",
  '????????? ????? ??? ???',
  '?????????? ???? ????????????',
  "!!!!! !!!! !!!!", "####### #######",
  "!!!!!!!! !!!!!!!!", "########### ########"
]

export default {
  type: ({ children }) => <div className="flex"><div className="mt-20 flex-1 w-full mx-auto max-w-7xl mb-10">{ children }</div></div>,
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
    format: TEST_FORMAT,
    title: "Testing",
  },
  children: [
    { type: "dms-header",
      props: { title: "Testing Stuff" }
    },
// dms-manager children are special
// they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: "dms-list",
      props: {
        dmsAction: "list",
        dmsActions: ["dms:fake-one", "dms:fake-two"],
        columns: [
          "self:data.title",
          "self:data.creator",
          { path: "self:updated_at",
            format: "date"
          },
          "dms:view",
          "dms:edit",
          { action: "api:delete", showConfirm: true }
        ]
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
                "item:data.test-format",
                "item:data.test-image"
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
        domain,
        dmsActions: [
          { action: "dms:fake-three",
            buttonTheme: "buttonPrimary"
          },
          { action: "dms:fake-four",
            buttonTheme: "buttonSuccess"
          }
        ]
      },
      wrappers: ["with-auth"]
    },

    { type: "dms-edit",
      props: { dmsAction: "edit", domain },
      wrappers: ["with-auth"]
    },

    { type: "dms-card",
      props: { dmsAction: "delete" },
      wrappers: [
        { type: "dms-view",
          options: {
            mapDataToProps: {
// mapDataToProps is used by dms-view to map data items to wrapped component props
// prop: [...attributes]
              title: "item:data.title",
              body: [
                "item:data.test-format",
                "item:data.test-image"
              ],
              footer: [
                "item:data.creator",
                "item:updated_at"
              ]
            }
          }
        }
      ]
    }
  ]
}

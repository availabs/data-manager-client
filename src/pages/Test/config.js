import React from "react"

import TEST_FORMAT from "./test-config.type"

const FakeComp = ({ text, children, className, ...props }) =>
  <div>
    <div className={ className }>
      <div>{ text }</div>
    </div>
    <div>
     { children }
    </div>
  </div>

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
          home: "buttonInfo",
          create: "buttonSuccess",
          edit: "buttonPrimary"
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
      }
    },
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: TEST_FORMAT
  },
  children: [
    { type: "dms-header",
      props: { title: "Testing Stuff" }
    },
// dms-manager children are special
// they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: "dms-table",
      props: {
        dmsAction: "list",
        dmsActions: [
          { action: "dms:fake-one",
            seedProps: () => ({ text: "FAKE ONE IS SUPER FAKE!!!" })
          },
          { action: "dms:fake-two",
            seedProps: () => ({ text: "FAKE TWO IS SUPER FAKE!!!" })
          }
        ],
        columns: [
          "self:data.title",
          "self:data.creator",
          { path: "self:updated_at",
            format: "date"
          },
          "dms:edit",
          { action: "api:delete", showConfirm: true }
        ]
      }
    },

    { type: FakeComp,
      props: {
        dmsAction: "fake-one",
        className: "text-xl text-center font-bold"
      }
    },

    { type: FakeComp,
      props: {
        dmsAction: "fake-two",
        className: "text-xl text-center font-bold"
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
                "item:data.test-format-array",
                "item:data.test-format-1",
                "item:data.test-number-array",
                "item:data.test-image",
                "item:data.text-editor"
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

  ]
}

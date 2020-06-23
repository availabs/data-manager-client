import React from "react"

import { DMS_DOCS } from "./dms-docs.type"
// import {doc} from "pages/DocsEditor/doc-page"
import { DmsButton } from "../components/dms-button"

const BrokeAss = ({ sections, setValues }) => {
  if (!sections.activeSection) return null;
  return (
    <div>

      <div className="flex">
        <button disabled={ !sections.canGoPrev } onClick={ e => sections.prev() }
          className="mr-2 px-2 py-1 bg-gray-300 disabled:bg-red-300 disabled:cursor-not-allowed">
          PREV
        </button>
        <button disabled={ !sections.canGoNext } onClick={ e => sections.next() }
          className="px-2 py-1 bg-gray-300 disabled:bg-red-300 disabled:cursor-not-allowed">
          NEXT
        </button>
        <div className="flex-1 flex justify-end">
          <DmsButton action={ sections.dmsAction }/>
        </div>
      </div>

      <div>
        { sections.activeSection.attributes
            .map(({ Input, ...att }) => (
                <div key={ att.key}>
                  <label>{att.key}: verified? {att.verified+""}</label>
                  <Input onChange={ v => setValues(att.key, v) }
                    value={ att.value }/>
                </div>
              )
            )
        }
      </div>

    </div>
  );
}

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

export default ({
  type: ({ children }) => <div className="flex"><div className="mt-20 pt-8 flex-1 w-full mx-auto max-w-7xl mb-10">{ children }</div></div>,
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
        }
      }
    },
    "dms-router",
    "show-loading", // receives loading prop
    "dms-falcor", // generates loading prop and passes to children
    "with-auth"
  ],
  props: {
    format: DMS_DOCS,
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
    { type: "dms-header",
      props: { title: "Dms Docs" }
    },
// dms-manager children are special
// they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: "dms-list", // generic dms component for viewing multiple data items
      props: {
        dmsAction: "list",
        sortBy: "data.chapter",
        sortOrder: "asc",
        filter: d => !d.data.chapter.includes("."),
        columns: [
          "title", "chapter",
          "dms:edit", "dms:delete",
          { action: "api:delete",
            label: "API delete",
            showConfirm: true }
        ]
      },
      wrappers: ["with-theme"]
    },

    { type: "docs-page", // generic dms component for viewing a single data item
      props: {
        dmsAction: "view"
      },
      wrappers: [
        { type: "dms-view",
          options: {
            actions: [
              ["dms:edit", "dms:delete"],
              ["dms:create"]
            ],
            mapDataToProps: {
              // $preserveKeys: true,
// mapDataToProps is used by dms-view to map data items to wrapped component props
// prop: [...attributes]
// in this case, the dms-card is expecting title and body props.
              title: "item:data.title",
              chapter: "item:data.chapter",
              body: "item:data.body",
              updated_at: "item:updated_at"
            }
          }
        },
        "with-auth"
      ],
      children: [
        { type: "dms-list",
          props: {
            columns: ["title", "chapter", "dms:edit", "dms:delete"],
            className: "mt-5",
            sortBy: "data.chapter",
            sortOrder: "asc",
          },
          wrappers: [{
            type: "dms-falcor",
            options: {
              filter: {
                args: ["props:dms-docs.data.chapter", "self:data.chapter"],
                comparator: (arg1, arg2) => {
                  const regex = new RegExp(`^${ arg1 }[.]\\d+$`)
                  return regex.test(arg2);
                }
              }
            }
          }]
        }
      ]
    },

    { type: "dms-create",
      props: { dmsAction: "createOLD", domain },
      wrappers: ["with-auth"]
    },

    { type: "dms-edit",
      props: { dmsAction: "editOld", domain },
      wrappers: ["with-auth"]
    },

    { type: BrokeAss,
      props: { dmsAction: "create", domain },
      wrappers: ["dms-create", "with-auth"]
    },

    { type: BrokeAss,
      props: { dmsAction: "edit", domain },
      wrappers: ["dms-edit", "with-auth"]
    },

    { type: "docs-page",
      props: { dmsAction: "delete" },
      wrappers: [
        { type: "dms-view",
          options: {
            mapDataToProps: {
              title: "item:data.title",
              chapter: "item:data.chapter",
              body: "item:data.body",
              updated_at: "item:updated_at"
            },
            actions: ["api:delete"]
          }
        }
      ]
    }
  ]
})

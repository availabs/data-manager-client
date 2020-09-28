import React from "react"
import { useTheme } from "components/avl-components/wrappers/with-theme"
import { DmsButton } from "components/dms/components/dms-button"
import ReadOnlyEditor from "components/dms/components/editor/editor.read-only"
// import { hasValue } from "components/avl-components/components/Inputs/utils"
import doc from './doc.type'

export const Create = ({ createState, setValues, item, ...props }) => {
  const theme = useTheme();
  let Title = createState.sections[0].attributes[0]
  let Content = createState.sections[0].attributes[1]
  let UserID = createState.sections[0].attributes[2]

  return (
    <div className='max-w-2xl mx-auto'>
      <form onSubmit={ e => e.preventDefault() }>
        <div className="w-full flex flex-col justify-centerhasValue h-min-screen">
          <div
            className={`text-3xl text-3xl font-bold leading-7`}>
            <Title.Input
              className={`p-4 border-none active:border-none focus:outline-none custom-bg ${theme.text}`}
              autoFocus={ true }
              value={ Title.value }
              placeholder={'Untilted'}
              onChange={ Title.onChange }
            />
          </div>
          <div
            className={`hidden`}>
            <div>{UserID.name} | {UserID.key} | {UserID.value}</div>
            <UserID.Input
              className={`border-none active:border-none focus:outline-none custom-bg h-full ${theme.text}`}
              value={ UserID.value }

            />
          </div>
          <div
            className={`p-2 font-thin overflow-hidden`}>
            <Content.Input
              className={`p-4 border-none active:border-none focus:outline-none custom-bg h-full ${theme.text}`}
              value={ Content.value }
              onChange={ Content.onChange }
            />
          </div>

        </div>
        <div className="mt-2 mb-4 max-w-2xl">
          <DmsButton className="w-1/2" large  type="submit"
            action={ createState.dmsAction } item={ item } props={ props }/>
        </div>
      </form>
    </div>
  );
}

const View = ({ item, dataItems, ...props }) => {
  const theme = useTheme();
  if (!item || !item.data) return null;
  const { data } = item
  return (
    <div className={ `max-w-2xl mx-auto`}>
      <div className="w-full flex flex-col justify-center hasValue h-min-screen">
        <div className={`px-2 pt-2 pb-6 text-3xl font-bold leading-7 ${theme.text}`}>
            {data.title}
        </div>
        <div className={'p-2 pb-6  font-thin'}>
          <ReadOnlyEditor value={data.body} />
        </div>
      </div>
    </div>
  )
}


const config =  ({
  type: "dms-manager", // top level component for managing data items
  wrappers: [
// wrapper order is important
// from index zero to i, higher index wrappers send props into lower index wrappers
// higher index wrappers do not see props from lower index wrappers
    "dms-provider",
    "dms-router",
    "show-loading",
    "dms-falcor",
    "with-auth"
  ],
  props: {
    format: doc,
    title: " ",
    className: 'h-full',
    // noHeader: true,
    authRules: {
      view: {
        args: ["props:user.authLevel"],
        comparator: al => true
      },
      create: {
        args: ["props:user.authLevel"],
        comparator: al => al !== null
      },
      edit: {
        args: ["item:data.userId", "props:user.id", "props:user.authLevel"],
        comparator: (arg1, arg2, arg3) => (+arg1 === +arg2) || (+arg3 === 10)
      },
      delete: {
        args: ["item:data.userId", "props:user.id", "props:user.authLevel"],
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
    // they are only shown when the dms-manager state.stack.top.action === child.props.dmsAction
    { type: "dms-table", // generic dms component for viewing multiple data items
      props: {
        dmsAction: "list",
        buttonTheme: "textbutton",
        columns: [
          {
            path: 'self:data.title',
            className: 'text-lg font-medium'
          },
          // "title",
          { path: "self:data.userId",
            disableFilters: true,
            disableSortBy: true
          },
          "dms:view",
          "dms:edit",
          "dms:delete"
        ],
        title: "Pages",

      },
      wrappers: ["with-theme"]
    },
    { type: View,
      props: { dmsAction: "view" },
      //wrappers: ['dms-view'],

    },
    { type: Create,
      props: {
        dmsAction: "create",
        dmsActions: ["dms:create","dms:fake"],
        className: "h-full"
      },
      // dms-create defaults to dmsAction: "create"
      // the prop is required here due to the wrapper
      wrappers: [ "dms-create", "with-auth",]
    },
    { type: Create,
      props: { dmsAction: "edit" },
      wrappers: [ "dms-edit", "with-auth"]
    },

    { type: "dms-card",
      props: { dmsAction: "delete" },
      wrappers: [
        { type: "dms-view",
          options: {
            mapDataToProps: {
              title: "item:data.title",
              body: [
                "item:data.userId",
                "item:data.content",
                "item:updated_at",
                "props:user.id"
              ]
            },
            actions: [{
              action: "api:delete",
              showConfirm: true,
            }]
          }
        },
        "with-auth"
      ]
    }
  ]
})



export default {
  path: "/admin",
  mainNav: true,
  // exact: true,
  auth: false,
  name: 'CMS',
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

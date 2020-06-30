import React from "react"
import { useTheme } from "components/avl-components/wrappers/with-theme"
import { DmsButton } from "components/DMS/components/dms-button"
// import { hasValue } from "components/avl-components/components/Inputs/utils"


const doc = {
  app: "docs",
  type: "page",
  attributes: [
    { key: "title",
      type: "text",
      required: true
    },
    { key: "body",
      type: "richtext",
      required: true
    },
    { key: "userId",
      name: "User",
      type: "text",
      default: "props:user.id", // default value will be pulled from props.user.id
      editable: false
    }
  ]
}



export const CreateCustom = ({ createState, setValues, item, ...props }) => {
  const theme = useTheme();
  let Title = createState.sections[0].attributes[0]
  let Content = createState.sections[0].attributes[1]
  let UserID = createState.sections[0].attributes[2]
  
  return (
    <div className='max-w-6xl mx-auto border'>
      <form onSubmit={ e => e.preventDefault() }>
        <div className="w-full flex flex-col justify-centerhasValue h-min-screen">
           
          <div 
            className={`text-3xl`}>
            <Title.Input 
              className={`p-4 border-none active:border-none focus:outline-none custom-bg ${theme.text}`}
              autoFocus={ true } 
              value={ Title.value }
              placeholder={'Untilted'}
              onChange={ v => setValues(Title.key, v) }
            />
          </div>
          <div 
            className={``}>
            <div>{UserID.name} | {UserID.key} | {UserID.value}</div>
            <UserID.Input 
              className={`border-none active:border-none focus:outline-none custom-bg h-full ${theme.text}`}
              value={ UserID.value }
              onChange={ v => setValues(UserID.key, v) }
            />
          </div>
          <div 
            className={`p-2`}>
            <Content.Input 
              className={`p-4 border-none active:border-none focus:outline-none custom-bg h-full ${theme.text}`}
              value={ Content.value }
              onChange={ v => setValues(Content.key, v) }
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


export default ({
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
        buttonTheme: "buttonText",
        columns: [
          { 
            source: 'self:data.title',
            className: 'text-lg font-medium'
          },
          // "title",
          "userId",
          "dms:view",
          "dms:edit",
          "dms:delete"
        ],
        title: "Pages",

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
                "item:data.userId",
                "item:data.body",
                "item:updated_at"
              ]
            }
          }
        }
      ],

    },
    { type: CreateCustom,
      props: { 
        dmsAction: "create",
        dmsActions: ["dms:create","dms:fake"],
        className: "h-full"
      },
      // dms-create defaults to dmsAction: "create"
      // the prop is required here due to the wrapper
      wrappers: [ "dms-create", "with-auth",]
    },
    { type: 'dms-create',
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
                "item:data.body",
                "item:updated_at",
                "props:user.id"
              ]
            },
            actions: [{
              action: "api:delete",
              showConfirm: true,
//               seedProps: props =>
// // these ids are sent to the api:delete function
//                 get(props, "dataItems", []).reduce((a, c) =>
//                   get(c, ["data", "replyTo"]) === get(props, ["docs", "id"]) ? [...a, c.id] : a
//                 , [])
            }]
          }
        },
        "with-auth"
      ]
    }
  ]
})

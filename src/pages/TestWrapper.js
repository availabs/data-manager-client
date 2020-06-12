import React from "react"

import { DMS_DOCS } from "components/DMS/docs/dms-docs.type"

class Component extends React.Component {
  render() {
    return (
      <div className="relative">
        { this.props.children }
      </div>
    )
  }
}
const SideBar = ({ children, ...props }) =>
  <div className="absolute left-0 top-0 p-5"
    style={ { width: "250px" } }>
    <ul>
      { children }
    </ul>
  </div>

const SideBarItem = ({ children, active, ...props }) =>
  <li { ...props }
    className={ `
      px-5 cursor-pointer border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-200 rounded
      ${ active ? "bg-gray-200" : "" }
    ` }>
    { children }
  </li>

const Content = ({ title, content, children }) =>
  <div className="absolute left-0 top-0 p-5"
    style={ { marginLeft: "250px" } }>
    <div className="text-2xl font-bold">{ title }</div>
    <div className="p-5 rounded-lg border-2">{ content }</div>
    <div>
      { children }
    </div>
  </div>

export default {
  path: '/test-wrapper',
  name: 'Test Wrapper',
  mainNav: true,
  layoutSettings: {
    fixed: true,
    theme: 'light'
  },
  component: {
    type: Component,
    props: {
      format: DMS_DOCS
    },
    wrappers: [
      "dms-provider",
      "show-loading",
      "dms-falcor"
    ],
    children: [
      { type: SideBar,
        wrappers: [
          { type: "dms-consumer",
            options: {
              defaultAction: "props:dataItems-->data.chapter==0->id",
              mapDataToProps: {
                children: [
                  { path: "props:dataItems",
                    filter: {
                      args: ["item:data.chapter"],
                      comparator: chapter => /^\d+$/.test(chapter)
                    },
                    props: {
                      active: "props:item.id==item:id"
                    },
                    type: SideBarItem,
                    key: "item:id",
                    value: "item:data.title",
                    interact: "item:id"
                  },
                  { type: "div",
                    props: {
                      className: "border-b-4 border-black my-5 text-center"
                    },
                    value: "TESTS BELOW"
                  },
                  { path: "props:dmsAction",
                    type: "div",
                    props: {
                      className: "border-2 p-2 rounded"
                    }
                  },
                  { path: "item:data.title",
                    type: "div",
                    props: {
                      className: "border-2 p-2 rounded"
                    }
                  },
                  { path: "item:data->body", // -> get
                    type: "div",
                    props: {
                      className: "border-2 p-2 rounded"
                    }
                  },
                  "props:dataItems>>>data.title", // >>> array map
                  { path: "props:dataItems->5.data.title", // -> get from array
                    type: "div",
                    props: {
                      className: "rounded border-2 p-2"
                    }
                  },
                  { path: "props:dataItems==>data.chapter==0", // ==> array filter
                    type: "div",
                    props: {
                      className: "rounded border-2 p-2"
                    },
                    value: "item:data.title"
                  },
                  { path: "props:dataItems-->data.chapter==0->data.title", // --> array reduce
                    type: "div",
                    props: {
                      className: "rounded border-2 p-2"
                    }
                  }
                ]
              }
            }
          }
        ]
      }, // END SIDEBAR

      { type: Content,
        wrappers: [
          { type: "dms-consumer",
            options: {
              mapDataToProps: {
                title: "props:item.data.title",
                content: "props:item.data.body"
              }
            }
          }
        ]
      }
    ]
  }
}

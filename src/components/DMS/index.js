import React from "react"

import DmsComponents from "./components"

import { DmsButton, Title, ButtonColorContext } from "./components/parts"
import { AuthContext } from "./components/auth-context"

import get from "lodash.get"

const DATA_FORMAT = {
  id: "unique-database-id",

  app: "app-name",
  type: "string",
  attributes: "jsonb",
/*
  attributes: [
    { type: enum:[text, textarea, number], // required
      key: "string" // required
    }
  ]
*/

  created_at: "datetime",
  created_by: "avail-auth-user-id",

  updated_at: "datetime",
  updated_by: "avail-auth-user-id"
}
const DATA_ITEM = {
  id: "unique-database-id",

  app: "app-name",
  type: "string",
  data: "jsonb",

  created_at: "datetime",
  created_by: "avail-auth-user-id",

  updated_at: "datetime",
  updated_by: "avail-auth-user-id"
}

class DmsManager extends React.Component {
  static defaultProps = {
    actions: ["create"],
    defaultAction: "list",
    dataItems: [],
    app: "app-name",
    type: "format-type",
    format: {},
    className: "m-10 border-2 p-5 rounded-lg",
    dataFilter: false,
    authRules: {},
    buttonColors: {}
  }
  state = {
    stack: [{
      action: this.props.defaultAction,
      id: null,
      props: {}
    }]
  }

  interact(action, id = null, props) {
    const stack = [...this.state.stack];

    if (action === "back") {
      (stack.length > 1) && stack.pop();
    }
    else if (action.includes("falcor:")) {
window.alert("DATA: " + JSON.stringify(props))
console.log("INTERACT WITH FALCOR:", action, id, props)
      stack.pop();
    }
    else {
      stack.push({ action, id, props });
    }
    this.setState({ stack });
  }
  getTop() {
    const stack = this.state.stack,
      length = stack.length;
    return stack[length - 1];
  }

  renderChildren(action, id, props) {
    const child = React.Children.toArray(this.props.children)
      .reduce((a, c) => c.props.action === action ? c : a, null);

    if (child === null) return child;

    if (action === "list") {
      return React.cloneElement(child,
        { ...child.props,
          ...props,
          app: this.props.app,
          type: this.props.type,
          interact: this.interact.bind(this),
          dataItems: this.props.dataItems,
          format: this.props.format
        }
      );
    }

    const data = this.props.dataItems.reduce((a, c) =>
      c.id === id ? c : a
    , null)

    return React.cloneElement(child,
      { ...child.props,
        ...props,
        app: this.props.app,
        type: this.props.type,
        interact: this.interact.bind(this),
        format: this.props.format,
        [this.props.type]: data
      }
    );
  }

  render() {
    const { action, id, props } = this.getTop(),
      { authRules, user, buttonColors } = this.props;

    return (
      <div className={ this.props.className }>
        <AuthContext.Provider value={ { authRules, user } }>
          <ButtonColorContext.Provider value={ buttonColors }>
            <div>
              <Title large>
                { this.props.title || `${ this.props.app } Manager` }
              </Title>
              <div className="mb-5">
                { this.state.stack.length === 1 ? null :
                    <DmsButton action="back" interact={ (...args) => this.interact(...args) }/>
                }
                { this.props.actions
                    .filter(a => (a !== "create") || (action === "list"))
                    .map(action =>
                      <DmsButton key={ action } action={ action }
                        interact={ (...args) => this.interact(...args) }/>
                    )
                }
              </div>
            </div>
            <div>
              { this.renderChildren(action, id, props) }
            </div>
          </ButtonColorContext.Provider>
        </AuthContext.Provider>
      </div>
    )
  }
}

export default {
  ...DmsComponents,
  "dms-manager": DmsManager
}

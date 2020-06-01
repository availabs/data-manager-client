import React from "react"

import DmsComponents from "./components"

import { Button, DmsButton, Title, ButtonColorContext } from "./components/parts"
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
    authRules: {},
    buttonColors: {},
    apiInteract: () => Promise.resolve()
  }
  state = {
    stack: [{
      dmsAction: this.props.defaultAction,
      id: null,
      props: {}
    }]
  }

  async interact(dmsAction, id, props) {
    const stack = [...this.state.stack];

    if (dmsAction === "back") {
      (stack.length > 1) && stack.pop();
    }
    else if (/^api:/.test(dmsAction)) {
      await this.props.apiInteract(dmsAction, id, props);
      stack.pop();
    }
    else {
      stack.push({ dmsAction, id, props });
    }
    this.setState({ stack });
  }
  getTop() {
    const { stack } = this.state;
    return stack[stack.length - 1];
  }

  renderChildren(dmsAction, id, props) {
    const child = React.Children.toArray(this.props.children)
      .reduce((a, c) => c.props.dmsAction === dmsAction ? c : a, null);

    if (child === null) return child;

    if (dmsAction === "list") {
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
    const { dmsAction, id, props } = this.getTop(),
      { authRules, user, buttonColors } = this.props;

    return (
      <div className={ this.props.className }>
        <AuthContext.Provider value={ { authRules, user, interact: (...args) => this.interact(...args) } }>
          <ButtonColorContext.Provider value={ buttonColors }>
            <div>
              <Title large>
                { this.props.title || `${ this.props.app } Manager` }
              </Title>
              <div className="mb-5">
                { this.state.stack.length === 1 ? null :
                    <DmsButton action="back"/>
                }
                { this.props.actions
                    .filter(a => (a !== "create") || (dmsAction === "list"))
                    .map(action =>
                      <DmsButton key={ action } action={ action }/>
                    )
                }
              </div>
            </div>
            <div>
              { this.renderChildren(dmsAction, id, props) }
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

import React from "react"

import DmsComponents from "./components"

import { connect } from "react-redux"
import { reduxFalcor } from "utils/redux-falcor"

import {
  fetchFalcorDeps,
  mapStateToProps
} from "./wrappers/dms-falcor"

import { DmsButton, Title } from "./components/parts"
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
    formatType: "format-name",
    format: {},
    className: "m-10 border-2 p-5 rounded-lg",
    dataFilter: false,
    authRules: {}
  }
  state = {
    stack: [{
      action: this.props.defaultAction,
      id: null,
      props: {}
    }]
  }

  fetchFalcorDeps

  interact(action, id = null, props) {
    const stack = [...this.state.stack];
    if (action === "back") {
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
          formatType: this.props.formatType,
          interact: this.interact.bind(this),
          dataItems: this.props.dataItems,
          format: this.props.format,
          authRules: this.props.authRules
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
        formatType: this.props.formatType,
        interact: this.interact.bind(this),
        format: this.props.format,
        type: this.props.formatType,
        [this.props.formatType]: data
      }
    );
  }

  render() {
    const { action, id, props } = this.getTop(),
      { authRules, user } = this.props;
    return (
      <div className={ this.props.className }>
        <AuthContext.Provider value={ { authRules, user } }>
          <div>
            <Title large>
              { this.props.title || `${ this.props.app } Manager` }
            </Title>
            <div className="mb-5">
              { action === "list" ? null :
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
        </AuthContext.Provider>
      </div>
    )
  }
}

export default {
  ...DmsComponents,
  "dms-manager": connect(mapStateToProps, null)(reduxFalcor(DmsManager))
}

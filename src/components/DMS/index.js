import React from "react"

import DmsComponents from "./components"

import { connect } from "react-redux"
import { reduxFalcor } from "utils/redux-falcor"

import {
  fetchFalcorDeps,
  mapStateToProps
} from "./wrappers/dms-falcor"

import { Button, Title } from "./components/parts"

import get from "lodash.get"

const DATA_FORMAT = {
  id: "unique-database-id",

  app: "app-name",
  type: "string",
  attributes: "jsonb",

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
    className: "ml-40 mr-40 border-2 p-5 rounded-lg",
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

  interact(action, id = null, props = {}) {
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
      c.id == id ? c : a
    , null)

    return React.cloneElement(child,
      { ...child.props,
        ...props,
        app: this.props.app,
        formatType: this.props.formatType,
        interact: this.interact.bind(this),
        format: this.props.format,
        type: this.props.formatType,
        [this.props.formatType]: data,
        authRules: this.props.authRules
      }
    );
  }

  render() {
    const { action, id, props } = this.getTop();
    return (
      <div className={ this.props.className }>
        <div>
          <Title large>
            { this.props.title || `${ this.props.app } Manager` }
          </Title>
          <div className="mb-5">
            { action === "list" ? null :
                <Button onClick={ e => (e.stopPropagation(), this.interact("back")) }>
                  back
                </Button>
            }
            { this.props.actions
                .filter(a => (a !== "create") || (action === "list"))
                .map(action =>
                  <Button key={ action } onClick={ e => (e.stopPropagation(), this.interact(action)) }>
                    { action }
                  </Button>
                )
            }
          </div>
        </div>
        <div>
          { this.renderChildren(action, id, props) }
        </div>
      </div>
    )
  }
}

export default {
  ...DmsComponents,
  "dms-manager": connect(mapStateToProps, null)(reduxFalcor(DmsManager))
}

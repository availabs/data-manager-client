import React from "react"

import DmsComponents from "./components"

import { Button } from "./components/parts"

import { blogPost, blogs } from "./test_formats/blog_format"

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
    dataItems: blogs,
    app: "app-name",
    format: blogPost
  }
  state = {
    stack: [{
      action: this.props.defaultAction,
      id: null,
      props: {}
    }]
  }

  // fetchFalcorDeps() {
  //   const { app, format } = this.props;
  //   this.props.falcor.get(["dms", app, format, "length"]);
  // }

  interact(action, id = null, props = {}) {
console.log("INTERACT:", action, id, props)
    const stack = [...this.state.stack];
    if (action === "back") {
      stack.pop();
    }
    else {
      stack.push({ action, id, props });
    }
    this.setState({ stack });
  }
  checkStack() {
    const stack = this.state.stack,
      length = stack.length;
    return stack[length - 1];
  }

  renderChildren() {
    const { action, id, props } = this.checkStack();

    const child = React.Children.toArray(this.props.children)
      .reduce((a, c) => c.props.action === action ? c : a, null);

    if (child === null) return child;

    if (action === "list") {
      return React.cloneElement(child,
        { ...child.props,
          ...props,
          interact: this.interact.bind(this),
          dataItems: this.props.dataItems,
          format: this.props.format
        }
      );
    }

    const data = this.props.dataItems.reduce((a, c) =>
      c.id == id ? c : a
    , null)

    return React.cloneElement(child,
      { ...child.props,
        ...props,
        interact: this.interact.bind(this),
        format: this.props.format,
        data
      }
    );
  }

  render() {
    const { action } = this.checkStack();

    return (
      <div>
        <div className="mb-4">
          <div className="font-bold text-3xl mb-1">{ this.props.app } Manager</div>
          <span>
            { action === "list" ? null :
                <Button onClick={ e => this.interact("back") }>
                  back
                </Button>
            }
            { this.props.actions
                .filter(a => (a !== "create") || (action === "list"))
                .map(action =>
                  <Button key={ action } onClick={ e => this.interact(action) }>
                    { action }
                  </Button>
                )
            }
          </span>
        </div>
        <div>
          { this.renderChildren() }
        </div>
      </div>
    )
  }
}

export default {
  ...DmsComponents,
  "dms-manager": DmsManager
}

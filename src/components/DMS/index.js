import React from "react"

import DmsComponents from "./components"

import { Button, DmsButton, Title, ButtonColorContext } from "./components/parts"
import { AuthContext } from "./components/auth-context"

class DmsManager extends React.Component {
  static defaultProps = {
    actions: ["dms:create"],
    defaultAction: "list",
    dataItems: [],
    app: "app-name",
    type: "format-type",
    format: null,
    className: "m-10 border-2 p-5 rounded-lg",
    authRules: {},
    buttonColors: {},
    apiInteract: () => Promise.resolve()
  }
  constructor(...args) {
    super(...args)
    this.state = {
      stack: [{
        dmsAction: this.props.defaultAction,
        id: null,
        props: null
      }]
    }
    this.interact = this.interact.bind(this);
  }

  interact(dmsAction, id, props) {
    if (dmsAction === "back") {
      this.popAction();
    }
    else if (/^api:/.test(dmsAction)) {
      this.props.apiInteract(dmsAction, id, props)
        .then(() => this.popAction());
    }
    else {
      this.pushAction(dmsAction, id, props);
    }
  }
  pushAction(dmsAction, id, props) {
    const stack = [...this.state.stack];
    stack.push({ dmsAction, id, props });
    this.setState({ stack });
  }
  popAction() {
    if (this.state.stack.length > 1) {
      const stack = [...this.state.stack];
      stack.pop();
      this.setState({ stack });
    }
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
          format: this.props.format,
          dataItems: this.props.dataItems,
          [this.props.type]: null
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
        format: this.props.format,
        dataItems: this.props.dataItems,
        [this.props.type]: data
      }
    );
  }

  render() {
    const { dmsAction, id, props } = this.getTop(),
      { authRules, user, buttonColors } = this.props;

    return !this.props.format ? <NoFormat /> :
      ( <div className={ this.props.className }>
          <AuthContext.Provider value={ { authRules, user, interact: this.interact } }>
            <ButtonColorContext.Provider value={ buttonColors }>
              <div>
                <Title large>
                  { this.props.title || `${ this.props.app } Manager` }
                </Title>
                <div className="mb-5">
                  { this.state.stack.length === 1 ? null :
                      <DmsButton action="back" key={ "back" }/>
                  }
                  { this.props.actions
                      .filter(a => ((a !== "create") && (a !== "dms:create")) || (dmsAction === "list"))
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

const NoFormat = () => <Title large className="p-5">No format supplied!!!</Title>;

export default {
  ...DmsComponents,
  "dms-manager": DmsManager
}

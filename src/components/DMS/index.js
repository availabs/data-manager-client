import React from "react"

import DmsComponents from "./components"

import { DmsButton, Title, ButtonColorContext } from "./components/parts"
import { AuthContext } from "./components/auth-context"

import get from "lodash.get"

import { checkAuth } from "./components/auth-context"

class DmsManager extends React.Component {
  static defaultProps = {
    showHome: true,
    defaultAction: "list",
    dataItems: [],
    app: "app-name",
    type: "format-type",
    format: null,
    className: "border-2 p-5 rounded-lg",
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
      }],
      initialized: false
    }
    this.interact = this.interact.bind(this);
  }

  componentDidMount() {
    if (this.props.useRouter) {
      const { action, id } = get(this.props, "params", {});
console.log("<componentDidMount>", action, id)
      if (action) {
        this.pushAction(action, id, null);
      }
    }
  }
  componentDidUpdate(oldProps) {

  }
  initialize() {
    if (this.props.useRouter && !this.state.initialized) {
      const { action, id } = get(this.props, "params", {});
      if (action) {
        this.pushAction(action, id, null);
      }
    }
  }

  interact(dmsAction, id, props) {
    // if (["back", "dms:back"].includes(dmsAction)) {
    if (/^(dms:)*back$/.test(dmsAction)) {
      this.popAction();
    }
    // else if (["home", "dms:home"].includes(dmsAction)) {
    else if (/^(dms:)*home$/.test(dmsAction)) {
      this.clearStack();
    }
    else if (/^api:/.test(dmsAction)) {
      return this.props.apiInteract(dmsAction, id, props);
    }
    else {
      this.pushAction(dmsAction, id, props);
      if (this.props.history && id) {
        this.props.history.push(`/${ dmsAction.replace("dms:", "") }/${ id }`)
      }
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
  clearStack() {
    const stack = [...this.state.stack].slice(0, 1);
    this.setState({ stack });
  }
  getTop() {
    const { stack } = this.state;
    return stack[stack.length - 1];
  }

  renderChildren(dmsAction, id, props) {
    if (!this.props.format) return <NoFormat />;

    const child = React.Children.toArray(this.props.children)
      .reduce((a, c) => this.compareActions(get(c, ["props", "dmsAction"], ""), dmsAction) ? c : a, null);

    if (child === null) return null;

    if (/^(list|dms:list)$/.test(dmsAction)) {
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

    const item = this.props.dataItems.reduce((a, c) =>
      c.id === id ? c : a
    , null)

    const hasAuth = checkAuth(this.props.authRules, dmsAction, { user: this.props.user }, item);
    if (!hasAuth) return <NoAuth />;

    return React.cloneElement(child,
      { ...child.props,
        ...props,
        app: this.props.app,
        type: this.props.type,
        format: this.props.format,
        dataItems: this.props.dataItems,
        [this.props.type]: item
      }
    );
  }

  compareActions(action1 = "", action2 = "") {
    return action1.replace("dms:", "") === action2.replace("dms:", "");
  }

  render() {
    const { dmsAction, id, props } = this.getTop(),
      { authRules, user, buttonColors, useRouter, basePath, showHome } = this.props;

    return (
      <div className="p-20">
        <div className={ this.props.className }>
          <AuthContext.Provider value={ { authRules, user, useRouter, basePath, interact: this.interact } }>
            <ButtonColorContext.Provider value={ buttonColors }>
              <div>
                <Title large>
                  { this.props.title || `${ this.props.app } Manager` }
                </Title>
                <div className="mb-5">
                { !this.props.format ? null :
                    <div className="btn-group-horizontal">
                      { (this.state.stack.length === 1) ? null :
                          <DmsButton action="dms:back"/>
                      }
                      { (this.state.stack.length === 1) || !showHome ? null :
                          <DmsButton action="dms:home"/>
                      }
                      { dmsAction !== "list" ? null :
                          <DmsButton action="dms:create"/>
                      }
                    </div>
                  }
                </div>
              </div>
              <div>
                { this.renderChildren(dmsAction, id, props) }
              </div>
            </ButtonColorContext.Provider>
          </AuthContext.Provider>
        </div>
      </div>
    )
  }
}

const NoFormat = () => <Title large className="p-5">No format supplied!!!</Title>;
const NoAuth = () => <Title large className="p-5">You do not have authorization for this action!!!</Title>;

export default {
  ...DmsComponents,
  "dms-manager": DmsManager
}

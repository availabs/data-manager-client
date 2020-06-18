import React from "react"

import { AuthContext, DmsContext } from "../contexts"
import { checkAuth } from "../utils"

import get from "lodash.get"

export default (Component, options = {}) => {
  const {
    // format,
    authRules = {},
    // buttonColors,
    setDefaultTo = false
  } = options;

  class Wrapper extends React.Component {
    static defaultProps = {
      showHome: true,
      defaultAction: "list",
      dataItems: [],
      app: "app-name",
      type: "format-type",
      format: null,
      authRules,
      buttonColors: {},
      apiInteract: () => Promise.resolve()
    }
    constructor(...args) {
      super(...args);

      this.state = {
        stack: [{
          dmsAction: this.props.defaultAction,
          id: null,
          item: null,
          props: null
        }],
        initialized: false
      }
      this.interact = this.interact.bind(this);
      this.makeInteraction = this.makeInteraction.bind(this);
      this.makeOnClick = this.makeOnClick.bind(this);
    }

    getItem(id) {
      return this.props.dataItems.reduce((a, c) => c.id === id ? c : a, null)
    }

    componentDidMount() {
      const { action, id } = get(this.props, "params", {});
      if (action) {
        this.interact(action, id, null);
      }
    }
    componentDidUpdate() {
      if ((setDefaultTo !== false) && !this.state.item && this.props.dataItems.length) {
        this.interact("click", this.props.dataItems[setDefaultTo].id)
      }
    }

    processAction(arg) {
      let response = {
        action: "unknown",
        seedProps: () => null,
        showConfirm: false,
        label: null,
        color: null
      };
      if (typeof arg === "string") {
        response.action = arg;
      }
      else {
        response = { ...response, ...arg };
      }
      return response;
    }

    normalizeArgs(dmsAction, item, props) {
      let itemId = null;
      if (typeof item === "object") {
        itemId = get(item, "id", null);
      }
      else {
        itemId = item;
        item = this.getItem(itemId);
      }
      return [
        this.processAction(dmsAction),
        item,
        itemId,
        { ...this.props, ...props }
      ]
    }
    makeOnClick(...args) {
      const [
        { action, seedProps },
        item, itemId,
        props
      ] = this.normalizeArgs(...args);

      const { authRules, useRouter, basePath, location, history } = props,

        hasAuth = checkAuth(authRules, action, props, item);

      if (useRouter && hasAuth) {
        const { push } = history,
          { pathname } = location,
          state = get(location, "state", null) || [],
          length = state.length;

        return /^(dms:)*back$/.test(action) ?
          { key: action,
            onClick: e => {
              e.stopPropagation();
              push({
                pathname: get(state, [length - 1], basePath),
                state: state.slice(0, length - 1)
              });
            }
          }
          : /^(dms:)*home$/.test(action) ?
            { key: action,
              onClick: e => {
                e.stopPropagation();
                push({
                  pathname: basePath,
                  state: []
                });
              }
            }
          : /^api:/.test(action) ?
            { key: action,
              onClick: e => {
                e.stopPropagation();
                return Promise.resolve(this.interact(action, itemId, seedProps(props)))
                  .then(() => push({
                    pathname: get(state, [length - 1], basePath),
                    state: state.slice(0, length - 1)
                  }))
              }
            }
          : { key: action,
            onClick: e => {
                e.stopPropagation();
                push({
                  pathname: itemId ? `${ basePath }/${ action }/${ itemId }` : `${ basePath }/${ action }`,
                  state: [...state, pathname]
                });
              }
            }
      }
      return {
        key: action,
        onClick: e => {
          e.stopPropagation();
          if (!hasAuth) return Promise.resolve();
          return Promise.resolve(this.interact(action, itemId, seedProps(props)))
            .then(() => /^api:/.test(action) && this.interact("dms:back"));
        }
      }
    }
    makeInteraction(...args) {
      const [
        { action, seedProps },
        item, itemId,
        props
      ] = this.normalizeArgs(...args);

      const { authRules, useRouter, basePath, location, history } = props,

        hasAuth = checkAuth(authRules, action, props, item);

      if (useRouter && hasAuth) {
        const { push } = history,
          { pathname } = location,
          state = get(location, "state", null) || [],
          length = state.length;

        return /^(dms:)*back$/.test(action) ?
          { type: "link",
            key: action,
            to: {
              pathname: get(state, [length - 1], basePath),
              state: state.slice(0, length - 1)
            }
          }
          : /^(dms:)*home$/.test(action) ?
            { type: "link",
              key: action,
              to: {
                pathname: basePath,
                state: []
              }
            }
          : /^api:/.test(action) ?
            { tpye: "button",
              key: action,
              onClick: e => {
                e.stopPropagation();
                return Promise.resolve(this.interact(action, itemId, seedProps(props)))
                  .then(() => push({
                    pathname: get(state, [length - 1], basePath),
                    state: state.slice(0, length - 1)
                  }))
              }
            }
          : { type: "link",
              key: action,
              to: {
                pathname: itemId ? `${ basePath }/${ action }/${ itemId }` : `${ basePath }/${ action }`,
                state: [...state, pathname]
              }
            }
      }
      return {
        type: "button",
        key: action,
        onClick: e => {
          e.stopPropagation();
          if (!hasAuth) return Promise.resolve();
          return Promise.resolve(this.interact(action, itemId, seedProps(props)))
            .then(() => /^api:/.test(action) && this.interact("dms:back"));
        }
      }
    }

    interact(dmsAction, id, props) {
      if (arguments.length === 1) {
        id = dmsAction;
        dmsAction = "click";
      }

      const item = this.getItem(id)

      const hasAuth = checkAuth(this.props.authRules, dmsAction, this.props, item);
      if (!hasAuth) return;

      if (/^(dms:)*back$/.test(dmsAction)) {
        this.popAction();
      }
      else if (/^(dms:)*home$/.test(dmsAction)) {
        this.clearStack();
      }
      else if (/^api:/.test(dmsAction)) {
        return this.props.apiInteract(dmsAction, id, props);
      }
      else {
        this.pushAction(dmsAction, item, id, props);
      }
    }

    pushAction(dmsAction, item, id, props) {
      const stack = this.props.useRouter ? this.state.stack.slice(0, 1) : [...this.state.stack];

      stack.push({ dmsAction, id, item, props });
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

    getDmsProps() {
      const { app, type, dataItems } = this.props,
        top = this.getTop();

      return {
        interact: this.interact,
        makeInteraction: this.makeInteraction,
        makeOnClick: this.makeOnClick,
        stack: this.state.stack,
        app,
        type,
        dataItems,
        top,
        [type]: top.item,
        ...top
      }
    }
    render() {
      const { authRules, user } = this.props,
        dmsProps = this.getDmsProps();
      return (
        <DmsContext.Provider value={ dmsProps }>
          <AuthContext.Provider value={ { authRules, user } }>
            <Component { ...dmsProps } { ...this.props }/>
          </AuthContext.Provider>
        </DmsContext.Provider>
      )
    }
  }
  return Wrapper;
}

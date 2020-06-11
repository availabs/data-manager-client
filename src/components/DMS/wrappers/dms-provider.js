import React from "react"

import { AuthContext, DmsContext } from "../contexts"
import { checkAuth } from "../utils"

import get from "lodash.get"

export default (Component, options = {}) => {
  const {
    format,
    authRules,
    buttonColors,
    setDefaultTo = false
  } = options;

  class Wrapper extends React.Component {
    constructor(...args) {
      super(...args);

      this.state = {
        dmsAction: get(options, "defaultAction", "list"),
        item: null
      }
      this.interact = this.interact.bind(this);
    }
    componentDidUpdate() {
      if ((setDefaultTo !== false) && !this.state.item && this.props.dataItems.length) {
        this.interact("click", this.props.dataItems[setDefaultTo].id)
      }
    }
    interact(id, dmsAction = "click") {
      const item = this.props.dataItems.reduce((a, c) => c.id == id ? c : a, null),
        hasAuth = checkAuth(authRules, dmsAction, this.props, item);

      if (hasAuth) {
        this.setState({ dmsAction, item });
      }
    }
    getDmsProps() {
      const { app, type, dataItems } = this.props;

      return {
        ...this.state,
        interact: this.interact,
        app,
        type,
        dataItems
      }
    }
    render() {
      return (
        <DmsContext.Provider value={ this.getDmsProps() }>
          <AuthContext.Provider value={ { authRules, user: this.props.user } }>
            <Component { ...this.state } { ...this.props } interact={ this.interact }/>
          </AuthContext.Provider>
        </DmsContext.Provider>
      )
    }
  }
  return Wrapper;
}

import React from "react"

import { connect } from "react-redux"

import * as AUTH from "../api/auth"
import * as GROUPS from "../api/groups"
import * as USERS from "../api/users"

export default Component => {
  class AmsRedux extends React.Component {
    constructor(...args) {
      super(...args);

      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
      this.auth = this.auth.bind(this);
      this.signup = this.signup.bind(this);
      this.setPassword = this.setPassword.bind(this);
      this.resetPassword = this.resetPassword.bind(this);
    }
    login(email, password) {
      const { project } = this.props;
      this.props.login(email, password, project);
    }
    logout() {
      this.props.logout();
    }
    auth(token = null) {
      const { project } = this.props;
      this.props.auth(project, token);
    }
    signup(email, password, addToGroup = null) {
      const { project } = this.props;
      this.props.signup(email, password, project, addToGroup);
    }
    setPassword(password) {
      this.props.setPassword(password);
    }
    resetPassword(email) {
      const { project } = this.props;
      this.props.resetPassword(email, project);
    }
    render() {
      return (
        <Component { ...this.props }
          login={ this.login }
          logout={ this.logout }
          auth={ this.auth }
          signup={ this.signup }
          setPassword={ this.setPassword }
          resetPassword={ this.resetPassword }/>
      )
    }
  }
  const mapStateToProps = state => ({
      user: state.user,
      groups: state.groups,
      users: state.users
    }),
    mapDispatchToProps = {
      ...AUTH,
      ...GROUPS,
      ...USERS
    };
  return connect(mapStateToProps, mapDispatchToProps)(AmsRedux);
}

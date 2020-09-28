import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import ScrollToTop from 'utils/ScrollToTop'

import Routes from 'Routes';

import Layout from 'components/avl-components/DefaultLayout'

import DmsComponents from "components/dms"
import DmsWrappers from "components/dms/wrappers"

import { auth } from 'components/ams/api/auth';
import AmsComponents from "components/ams"
import AmsWrappers from "components/ams/wrappers"

import {
  addComponents,
  addWrappers
} from "components/avl-components/ComponentFactory"

addComponents(DmsComponents);
addWrappers(DmsWrappers);

addComponents(AmsComponents);
addWrappers(AmsWrappers);

class App extends Component {
  state = {
    isAuthenticating: true
  }
  componentDidMount() {
    this.props.auth();
  }
  componentDidUpdate(prevProps) {
    if (this.state.isAuthenticating && this.props.user.attempts) {
      this.setState({ isAuthenticating: false });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.user.authed !== this.props.user.authed) ||
      (nextProps.user.authLevel !== this.props.user.authLevel) ||
      (nextState.isAuthenticating !== this.state.isAuthenticating);
  }

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop />
        <Switch>
          {Routes.map((route, i) => {
            return (
              <Layout key={ i }
                { ...route }
                isAuthenticating={ this.state.isAuthenticating }
                menus={ Routes.filter(r => r.mainNav) }
                router={ this.props.router }
                user={ this.props.user }
              />
            );
          })}
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, { auth })(App);

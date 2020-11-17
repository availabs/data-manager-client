import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import ScrollToTop from 'utils/ScrollToTop'

import Routes from 'Routes';

import DmsComponents from "components/dms"
import DmsWrappers from "components/dms/wrappers"

import { auth } from 'components/ams/api/auth';
import AmsComponents from "components/ams"
import AmsWrappers from "components/ams/wrappers"

import {
  DefaultLayout as Layout,
  Messages,
  addComponents,
  addWrappers
} from "@availabs/avl-components"

addComponents(DmsComponents);
addWrappers(DmsWrappers);

addComponents(AmsComponents);
addWrappers(AmsWrappers);

class App extends Component {
  componentDidMount() {
    this.props.auth();
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (nextProps.user.authed !== this.props.user.authed) ||
  //     (nextProps.user.authLevel !== this.props.user.authLevel) ||
  //     (nextProps.user.attempts !== this.props.user.attempts) ||
  //     (nextProps.user.isAuthenticating !== this.props.user.isAuthenticating);
  // }

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop />
        <Switch>
          { Routes.map((route, i) =>
              <Layout key={ i }
                { ...route }
                isAuthenticating={ this.props.user.isAuthenticating }
                menus={ Routes.filter(r => r.mainNav) }
                router={ this.props.router }
                user={ this.props.user }/>
            )
          }
        </Switch>
        <Messages />
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, { auth })(App);

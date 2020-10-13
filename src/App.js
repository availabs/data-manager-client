import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import ScrollToTop from 'utils/ScrollToTop'


import Routes from 'Routes';

import Layout from 'components/avl-components/DefaultLayout'
import * as themes from 'components/avl-components/components/Themes'
import { ThemeContext } from "components/avl-components/wrappers/with-theme"
import Messages from "components/avl-components/messages"

import get from "lodash.get"

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
  static defaultProps = {
    theme: "TEST_THEME"
  }
  // state = {
  //   isAuthenticating: true
  // }
  componentDidMount() {
    this.props.auth();
  }
  componentDidUpdate(prevProps) {
// console.log("UPDATING", prevProps.user, this.props.user)
//     if (this.state.isAuthenticating && this.props.user.attempts) {
//       this.setState({ isAuthenticating: false });
//     }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.user.authed !== this.props.user.authed) ||
      (nextProps.user.authLevel !== this.props.user.authLevel) ||
      (nextProps.user.attempts !== this.props.user.attempts);// ||
      // (nextState.isAuthenticating !== this.state.isAuthenticating);
  }

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop />
        <ThemeContext.Provider value={ get(themes, this.props.theme, themes["light"]) }>
          <Switch>
            { Routes.map((route, i) =>
                <Layout key={ i }
                  { ...route }
                  isAuthenticating={ !this.props.user.attempts }
                  menus={ Routes.filter(r => r.mainNav) }
                  router={ this.props.router }
                  user={ this.props.user }/>
              )
            }
          </Switch>
          <Messages />
        </ThemeContext.Provider>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, { auth })(App);

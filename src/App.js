import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Switch } from "react-router"
import { BrowserRouter, Switch } from 'react-router-dom';
import ScrollToTop from 'utils/ScrollToTop'

import Routes from 'Routes';
import Layout from 'components/avl-components/DefaultLayout'

import { auth } from 'components/AMS/api/auth';

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

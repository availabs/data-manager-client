import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter,Switch } from 'react-router-dom';
import ScrollToTop from 'utils/ScrollToTop'

import Routes from 'Routes';
import Layout from 'layouts/DefaultLayout'

import { auth } from 'store/user';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticating: true
    }
    this.props.auth();
  }

  componentDidUpdate(prevProps) {
    if (this.state.isAuthenticating && this.props.user.attempts ) {
      this.setState({ isAuthenticating: false });
    }
  }

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Switch>
            {Routes.map((route, i) => {
              return (
                <Layout key={ i }
                  { ...route }
                  authed={ this.props.user.authed }
                  isAuthenticating={ this.state.isAuthenticating }
                  menus={ Routes.filter(r => r.mainNav) }
                  router={ this.props.router }
                  user={ this.props.user }
                />
              );
            })}
          </Switch>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    router: state.router
  };
};

const mapDispatchToProps = { auth };

export default connect(mapStateToProps, mapDispatchToProps)(App);

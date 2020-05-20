import React from 'react';
import { Route, Redirect } from "react-router-dom";
import Layouts from 'layouts/components/Layouts'
import PageFactory from 'layouts/PageFactory'
import * as themes from 'layouts/components/Themes'

import ComponentFactory from "layouts/ComponentFactory"

import LoadingPage from "./components/Loading/LoadingPage"

const DefaultLayout = ({ component, ...rest }) => {
  const Layout = Layouts[rest.layout] || Layouts['Sidebar']
  if ( rest.isAuthenticating && rest.authLevel >= 0  ) {
    return (
      <Layout {...rest}>
        <Route {...rest} render={matchProps => (
          <div style={{background:"#f0f7f9"}}>
            <LoadingPage />
          </div>
        )} />
      </Layout>
    )
  }

  return sendToLgin(rest) ?
  (
    <Redirect
      to={{
        pathname: "/login",
        state: { from: rest.router.location }
      }}
    />
  ) : (
    <Layout {...rest.layoutSettings} {...rest}>
      <Route
        {...rest}
        theme={themes[rest.layoutSettings.theme] || themes['light']}
        render={matchProps => (<ComponentFactory {...matchProps} {...rest} config={ component }/>)}
      />
    </Layout>
  )
}

function sendToLgin (props) {
  const requiredAuthLevel = props.authLevel !== undefined ? props.authLevel : props.auth ? 1 : -1;
  return props.user.authLevel < requiredAuthLevel;
}

export default DefaultLayout

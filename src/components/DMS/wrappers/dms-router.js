import React, { useState, useEffect } from "react"

import {
  useRouteMatch, useParams,
  Switch, Route, Redirect
} from "react-router-dom"

const GetParams = ({ Component, basePath, ...props }) =>
  <Component { ...props } useRouter={ true } basePath={ basePath } params={ useParams() }/>;

export default (Component, options = {}) => {
  return ({ ...props }) => {
    const { path } = useRouteMatch(),
      alt1 = `${ path }/:action`,
      alt2 = `${ path }/:action/:id`;
    return (
      <Switch>
        <Route exact path={ path }>
          <Component { ...props } useRouter={ true } basePath={ path }/>
        </Route>
        <Route exact path={ [alt1, alt2] }>
          <GetParams Component={ Component } basePath={ path } { ...props }/>
        </Route>
      </Switch>
    )
  }
}

// const GetParams = ({ path, setState }) => {
//   const { action, id } = useParams();
//   useEffect(() => {
//     setState({ action, id });
//   })
//   return (
//     <Redirect to={ path }/>
//   )
// }

// export default (Component, options = {}) => {
//   const { path } = useRouteMatch(),
//     alt = `${ path }/:action/:id`,
//     [state, setState] = useState({});
//   return ({ ...props }) => (
//     <Switch>
//       <Route exact path={ path }>
//         <Component { ...props } state={ state } useRouter={ true } basePath={ options.basePath }/>
//       </Route>
//       <Route exact path={ alt }>
//         <GetParams path={ path } setState={ setState }/>
//       </Route>
//     </Switch>
//   )
// }

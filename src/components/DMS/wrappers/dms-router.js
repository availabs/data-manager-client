import React from "react"

import {
  useRouteMatch, useParams,
  Switch, Route
} from "react-router-dom"

import get from "lodash.get"

const GetParams = ({ Component, ...props }) =>
  <Component { ...props } params={ useParams() }/>;

const ParseItems = ({ Component, ...props}) => {
  const { type } = props,
    { action, attribute, value } = useParams();

  const id = get(props, "dataItems", []).reduce((a, c) => {
    return get(c, ["data", attribute], null) == value ? c.id : a;
  }, undefined);

  if (!id) return <Component key="no-id" { ...props }/>;

  return <Component { ...props } params={ { action, id } }/>
}

export default (Component, options = {}) => {
  return ({ ...props }) => {
    const { path } = useRouteMatch(),
      alt1 = `${ path }/:action`,
      alt2 = `${ path }/:action/:id`,
      alt3 = `${ path }/:action/:attribute/:value`;
    return (
      <Switch>
        <Route exact path={ path }>
          <Component { ...props } useRouter={ true } basePath={ path }/>
        </Route>
        <Route exact path={ [alt1, alt2] }>
          <GetParams { ...props } useRouter={ true } basePath={ path }
            Component={ Component }/>
        </Route>
        <Route exact path={ alt3 }>
          <ParseItems { ...props } useRouter={ true } basePath={ path }
            Component={ Component }/>
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

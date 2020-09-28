import React from "react"

import get from "lodash.get"

const NoChild = () => <div>OOPS!!! Something went awry!</div>,
  NoAuthority = () => <div>OOPS!!! You do not have the authority!</div>

export default Component => {
  const AmsManager = ({ params, children, ...props }) => {
    const { action } = params;

    let requiredAuth = -1;

    let Children = React.Children.toArray(children)
      .filter(({ props }) => !("amsAction" in props) || (props.amsAction === action))
      .map(child => {
        requiredAuth = Math.max(requiredAuth, get(child, ["props", "authLevel"], -1));
        return React.cloneElement(child, { ...props });
      });

    if (!props.user.authed && (requiredAuth > -1)) {
      Children = React.Children.toArray(children)
        .filter(({ props }) => !("amsAction" in props) || (props.amsAction === "login"))
        .map(child => React.cloneElement(child, { ...props }));
    }
    else if (props.user.authed && (props.user.authLevel < requiredAuth)) {
      Children = [<NoAuthority key="no-auth"/>];
    }

    if (!Children.length) {
      Children = <NoChild />
    }

    return <Component { ...props }>{ Children }</Component>;
  }
  return AmsManager;
}

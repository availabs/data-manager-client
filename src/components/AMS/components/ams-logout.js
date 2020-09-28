import React from "react"

import { Redirect } from "react-router-dom"

export default ({ logout, redirectTo = "/" }) => {
  React.useEffect(() => { logout(); });
  return <Redirect to={ redirectTo }/>;
}

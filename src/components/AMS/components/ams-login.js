import React from "react"

import { Redirect, useLocation } from "react-router-dom"

import { Button } from "components/avl-components/components/Button"
import { Input } from "components/avl-components/components/Inputs"

import get from "lodash.get"

export default ({ login, user }) => {
  const [state, setState] = React.useState({ email: "", password: "" });

  const handleSubmit = React.useCallback(
    e => {
      e.preventDefault();
      const { email, password } = state;
      login(email, password);
    }
  , [state, login]);

  const { email, password } = state,
    submitDisabled = !(email && password),
    location = useLocation(),
    { pathname } = location;

  if (user.authed) {
    const from = get(location, ["state", "from"], null),
      to = pathname !== from ? from : "/";
    return <Redirect to={ to }/>
  }

  return (
    <div className="flex justify-center items-center flex-col p-40">
      <div className="inline-block rounded px-20 py-10 shadow-lg">
        <div className="text-3xl font-bold">Login</div>
        <div>
          <form onSubmit={ e => handleSubmit(e) }>
            <div className="my-2">
              <label htmlFor="email" className="block font-bold">Email</label>
              <Input type="email" id="email" required autoFocus value={ email }
                onChange={ v => setState({ ...state, email: v }) }/>
            </div>
            <div className="my-2">
              <label htmlFor="email" className="block font-bold">Password</label>
              <Input type="password" id="password" required value={ password }
                onChange={ v => setState({ ...state, password: v }) }/>
            </div>
            <div className="my-2">
              <Button disabled={ submitDisabled } type="submit"
                buttonTheme="buttonPrimaryLargeBlock">
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

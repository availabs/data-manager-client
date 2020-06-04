import React from "react"

import { connect } from "react-redux"
import { withRouter } from "react-router"
import { Redirect } from "react-router-dom"

import { login } from "store/user"

import get from "lodash.get"

class Login extends React.Component {
  state = {
    email: "",
    password: ""
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.login(this.state)
      .then(res => console.log("LOGIN RES:", res));
    console.log("LOGIN:", this.state)
  }
  render() {
    const { email, password } = this.state,
      disabled = !email || !password,
      from = get(this.props, ["location", "state", "from"], null);

    if (this.props.authed && from) {
      return <Redirect to={ from }/>
    }

    return (
      <div className="flex justify-center items-center flex-col p-40">
        <div className="inline-block rounded px-20 py-10 shadow-lg">
          <div className="text-3xl font-bold">Login</div>
          <div>
            <form onSubmit={ e => this.handleSubmit(e) }>
              <div className="my-2">
                <label htmlFor="email" className="block font-bold">Email</label>
                <input type="email" id="email" required autoFocus
                  className="px-4 py-1 rounded" value={ email }
                  onChange={ e => this.setState({ email: e.target.value }) }/>
              </div>
              <div className="my-2">
                <label htmlFor="email" className="block font-bold">Password</label>
                <input type="password" id="password" required
                  className="px-4 py-1 rounded" value={ password }
                  onChange={ e => this.setState({ password: e.target.value }) }/>
              </div>
              <div className="my-2">
                <button className={
                    ` bg-blue-500 w-full
                      text-white font-bold py-2 px-4 rounded focus:outline-none
                      ${ disabled ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700" }
                    `
                  }
                  disabled={ disabled }>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  authed: state.user.authed
})

const Connected = connect(mapStateToProps, { login })(withRouter(Login));

export default {
  path: "/login",
  exact: true,
  component: Connected,
  layoutSettings: {
    fixed: true,
    headerBar: true,
    theme: 'light'
  }
}

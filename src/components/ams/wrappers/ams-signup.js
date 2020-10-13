import React from "react"

export default Component =>
  class SignupWrapper extends React.Component {
    static defaultProps = {
      amsAction: "signup",
      addToGroup: false
    }
    state = {
      email: "",
      verify: ""
    }
    handleSubmit(e) {
      e.preventDefault();
      this.setState({ email: "", verify: "" });
      this.props.signup(this.state.email, this.props.addToGroup);
    }
    render() {
      const { email, verify } = this.state,
        canSubmit = email && verify && (email === verify);
      return (
        <Component { ...this.props } { ...this.state }
          handleSubmit={ e => this.handleSubmit(e) }
          update={ u => this.setState(u) }
          canSubmit={ canSubmit }/>
      );
    }
  }

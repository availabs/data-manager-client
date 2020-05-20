import React, { Component } from 'react';
import { connect } from 'react-redux'
import { reduxFalcor } from 'utils/redux-falcor'
import { Redirect } from 'react-router-dom'

import get from 'lodash.get'

import Alert from 'layouts/components/Alerts/Alert'

import Footer from 'components/util/Footer'
import KYCNav from 'components/util/KYCNav'

import { signup } from 'store/modules/user';

import 'styles/tailwind.css';



class Signup extends Component {
  state = {
      email: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
      office: '',
      redirectToReferrer: false,
      isLoading: false,
      options: []
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.email === this.state.email_verify;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSearch = (text) => {
    if(text.length >=3){
      this.setState({isLoading: true});
      return this.props.falcor.get(['office', 2020, 'search', text])
        .then(response =>{
          let offices = get(response, `json.office[2020].search[${text}].value`, [])  
          this.setState({
              isLoading: false,
              options: offices
          }) 
      })
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({
      isLoading: true,
      message: false
    })
    if(this.state.password !== this.state.passwordConfirm){ 
      return this.setState({
        message: {message: 'Password confirmation does not match.'}
      })
    }
    this.props.signup(this.state.email, this.state.password);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.setState({ redirectToReferrer: true });
    } else {
      let message = nextProps.messages.filter(d => d.type === 'SIGNUP ERROR')
      this.setState({ 
        isLoading: false,
        message: message[message.length - 1]
      });
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/candidate/dashboard" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div style={{backgroundColor: '#f0f7f9'}}>
        <div className='min-h-screen '>
        <KYCNav style={{position: 'fixed'}}/>
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{height: 'calc(100vh - 100px)'}}>
          <div className="max-w-md w-full">
            <div>
              <h1 style={{fontSize: '4em'}}>
                Create Your Account
              </h1>
              <p className="mt-2 text-lg text-center text-sm leading-5 text-gray-600">
                Let the voters know what you stand for.
              </p>
              
            </div>
            <div className='mt-6'>
                {this.state.message ? <Alert title={this.state.message.message} /> : ''}
              </div>
            <form className="mt-8" onSubmit={this.handleSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-lg ">
                <div>
                  <input 
                    aria-label="Email address" 
                    name="email" 
                    type="email" 
                    id="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required 
                    className={`
                      text-md appearance-none rounded-none relative 
                      block w-full px-3 py-4 border border-gray-300 
                      placeholder-gray-500 text-gray-900 rounded-t-md 
                      focus:outline-none focus:shadow-outline-blue 
                      focus:border-blue-300 focus:z-10 sm:leading-5`
                    }
                    placeholder="Email address" 
                  />
                </div>
                <div>
                  <input 
                    aria-label="Full Name" 
                    name="name" 
                    type="text"
                    id="fullName"
                    value={this.state.fullName}
                    onChange={this.handleChange}
                    required 
                    className={`
                      text-md appearance-none rounded-none relative 
                      block w-full px-3 py-4 border border-gray-300 
                      placeholder-gray-500 text-gray-900 
                      focus:outline-none focus:shadow-outline-blue 
                      focus:border-blue-300 focus:z-10 sm:leading-5`
                    }
                    placeholder="Full Name" />
                </div>
                <div className="-mt-px">
                  <input 
                    aria-label="Password" 
                    name="password" 
                    type="password"
                    id="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required 
                    className={`
                        text-md appearance-none rounded-none relative
                        block w-full px-3 py-4 border border-gray-300 
                        placeholder-gray-500 text-gray-900 
                        focus:outline-none focus:shadow-outline-blue 
                        focus:border-blue-300 focus:z-10 sm:leading-5`
                    } 
                    placeholder="Password" />
                </div>
                <div className="-mt-px">
                  <input 
                    aria-label="Confirm Password" 
                    name="passwordConfirm"
                    id="passwordConfirm"
                    value={this.state.passwordConfirm}
                    onChange={this.handleChange}
                    type="password" 
                    required 
                    className={`
                      text-md appearance-none rounded-none relative
                      block w-full px-3 py-4 border border-gray-300 
                      placeholder-gray-500 text-gray-900 rounded-b-md 
                      focus:outline-none focus:shadow-outline-blue 
                      focus:border-blue-300 focus:z-10 sm:leading-5
                    `}
                    placeholder="Confirm Password" 
                  />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                 
                </div>
                <div className="text-sm leading-5">
                  <button className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                   
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <button 
                  type="submit" 
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Create Account
                </button>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                 
                </div>
                <div className="text-sm leading-5">
                  <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                   Login
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }
}

const mapDispatchToProps = { signup };

const mapStateToProps = state => {
  return {
    user: state.user,
    isAuthenticated: !!state.user.authed,
    messages: state.messages,
    attempts: state.user.attempts // so componentWillReceiveProps will get called.
  };
};

export default
{
    path: '/candidate/create',
    mainNav: false,
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Signup)),

}



// WEBPACK FOOTER //
// ./src/containers/CandidateSignUp.js
import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

import Loading from 'components/loading/LoadingPage'
import Alert from 'layouts/components/Alerts/Alert'

import Footer from 'components/util/Footer'
import KYCNav from 'components/util/KYCNav'
import 'styles/tailwind.css';



import { login } from 'store/modules/user';

class Login extends React.Component {
  constructor(props) {
    super(props);
    var currentDate = new Date();
    this.state = {
      isLoading: false,
      email: '',
      password: '',
      redirectToReferrer: props.user.token ? true : false 
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log('handle submit')
    this.setState({ 
      isLoading: true,
      message: false 
    });
    this.props.login(this.state);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.setState({ redirectToReferrer: true });
    } else {
      console.log('new props no auth',nextProps.messages )
      let message = nextProps.messages.filter(d => d.type === 'LOGIN ERROR')[0]
      this.setState({ 
        isLoading: false,
        message
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
              <h1 style={{fontSize: '4em', lineHeight: '.79em'}}>
                <span style={{color: '#3b75e3'}}> KNOW YOUR CANDIDATE</span> Login
                
              </h1>
              <p className="mt-2 text-lg text-center text-sm leading-5 text-gray-600">
                Let the voters know what you stand for.
              </p>
              
            </div>

            <form className="mt-8" onSubmit={this.handleSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className='mt-6'>
                {this.state.message ? <Alert title={this.state.message.message} /> : ''}
                {
                  this.state.isloading ? (
                    <div className="h-5 w-5">
                      LOADING
                      <Loading width={'100%'} height={'100%'} />
                    </div>
                  ) : ''
                }
              </div>
              <div className="mt-6 rounded-md shadow-lg ">
                <div>
                  <input 
                    aria-label="Email address" 
                    name="email" 
                    type="email"
                    id="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required 
                    className="text-md appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:leading-5" 
                    placeholder="Email address" 
                  />

                </div>
                <div className="-mt-px">
                  <input 
                    aria-label="Password" 
                    name="password"
                    type="password"
                    id="password"
                    value={this.state.office}
                    onChange={this.handleChange} 
                    required 
                    className="text-md appearance-none rounded-none relative block w-full px-3 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:leading-5" 
                    placeholder="Password" 
                  />
                </div>
              </div>
              <div className="mt-6">
                <button 
                  disabled={this.state.isLoading}
                  type="submit"  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {this.state.isloading ? (
                      <div className="h-5 w-5">
                        <Loading width={'100%'} height={'100%'} />
                      </div>
                    ) :

                    (<svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>)
                    }
                  </span>
                  Login
                </button>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm leading-5">
                  <a href="/candidate/create" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                   Create Account
                  </a>
                </div>
                </div>
                <div className="text-sm leading-5">
                  <a href="/candidate/forgot" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                   Forgot Password?
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

const mapDispatchToProps = { login };

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
    path: '/login',
    mainNav: false,
    component: connect(mapStateToProps, mapDispatchToProps)(Login)
}



// WEBPACK FOOTER //
// ./src/containers/CandidateSignUp.js
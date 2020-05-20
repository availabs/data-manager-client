import React from "react";
import Footer from 'components/util/Footer'
import KYCNav from 'components/util/KYCNav'
import 'styles/tailwind.css';

class LandingView extends React.Component {
  constructor(props) {
    super(props);
    var currentDate = new Date();
    this.state = {
      address: "",
      date: currentDate,
      year: currentDate.getFullYear()
    };
  }

  render() {
    return (
      <div style={{backgroundColor: '#f0f7f9'}}>
        <div className='min-h-screen '>
        <KYCNav style={{position: 'fixed'}}/>
        <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" style={{height: 'calc(100vh - 100px)'}}>
          <div className="max-w-md w-full">
            <div>
              <h1 style={{fontSize: '4em'}}>
                Forgot Password
              </h1>
              <p className="mt-2 text-lg text-center text-sm leading-5 text-gray-600">
                Enter your email to reset your password.
              </p>
              
            </div>

            <form className="mt-8" action="#" method="POST">
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-lg ">
                <div>
                  <input aria-label="Email address" name="email" type="email" required className="text-md appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:leading-5" placeholder="Email address" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                 
                </div>
                <div className="text-sm leading-5">
                  <a href="/candidate/login" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150">
                    Login
                  </a>
                </div>
              </div>
              
              <div className="mt-6">
                <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Login
                </button>
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

export default
{
    path: '/candidate/forgot',
    mainNav: false,
    component: LandingView

}



// WEBPACK FOOTER //
// ./src/containers/CandidateSignUp.js
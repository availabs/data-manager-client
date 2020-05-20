import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import store from 'store';
import { FalcorProvider } from 'utils/redux-falcor'
import { falcorGraph } from 'store/falcorGraph'

import 'styles/tailwind.css';

ReactDOM.render(
  <React.StrictMode>
   	<Provider store={store}>
  		<FalcorProvider store={store} falcor={falcorGraph}>
	    	<App /> 
		</FalcorProvider>
  	</Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

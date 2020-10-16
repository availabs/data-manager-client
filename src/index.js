import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import * as THEMES from 'components/avl-components/components/Themes'
import { ThemeContext } from "components/avl-components/wrappers/with-theme"
import { PROJECT_THEME } from 'config'

import get from "lodash.get"

import { Provider } from 'react-redux';
import store from 'store';
// import { FalcorProvider } from 'utils/redux-falcor'
import { FalcorProvider } from 'utils/redux-falcor-new'
import { falcorGraph } from 'store/falcorGraphNew'

import 'styles/tailwind.css';

ReactDOM.render(
  <React.StrictMode>
   	<Provider store={ store }>
  		<FalcorProvider falcor={ falcorGraph }>
        <ThemeContext.Provider value={ get(THEMES, PROJECT_THEME, THEMES["light"]) }>
  	    	<App />
        </ThemeContext.Provider>
      </FalcorProvider>
  	</Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

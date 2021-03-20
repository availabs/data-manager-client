import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { API_HOST, PROJECT_THEME } from 'config'

import get from "lodash.get"

import { Provider } from 'react-redux';
import store from 'store';

import DmsComponents from "components/dms"
import DmsWrappers from "components/dms/wrappers"

import {
  Components as AmsComponents,
  Wrappers as AmsWrappers
} from "components/ams/src"

import {
  Themes,
  FalcorProvider,
  ThemeContext,
  falcorGraph,
  addComponents,
  addWrappers
} from "@availabs/avl-components"

import 'styles/tailwind.css';

addComponents(DmsComponents);
addWrappers(DmsWrappers);

addComponents(AmsComponents);
addWrappers(AmsWrappers);

ReactDOM.render(
  <React.StrictMode>
   	<Provider store={ store }>
  		<FalcorProvider falcor={ falcorGraph(API_HOST) }>
        <ThemeContext.Provider value={ get(Themes, PROJECT_THEME, Themes["light"]) }>
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

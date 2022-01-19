import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { API_HOST } from "config";
import Theme from "./theme";

import { Provider } from "react-redux";
import store from "store";

import {
  FalcorProvider,
  ThemeContext,
  falcorGraph,
} from "@availabs/avl-components";

import "styles/tailwind.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <FalcorProvider falcor={falcorGraph(API_HOST)}>
        <ThemeContext.Provider value={Theme}>
          <App />
        </ThemeContext.Provider>
      </FalcorProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

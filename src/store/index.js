import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import { messages } from "@availabs/avl-components";

const reducer = combineReducers({
  messages,
});

export default createStore(reducer, applyMiddleware(thunk));

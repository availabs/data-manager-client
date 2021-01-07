import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// import { reducer as graph } from 'utils/redux-falcor';

import { messages } from "@availabs/avl-components"

// import user from './user';

import { Reducers } from "components/ams/src"

const reducer = combineReducers({
  ...Reducers,
  messages
});

export default createStore(reducer, applyMiddleware(thunk))

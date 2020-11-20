import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// import { reducer as graph } from 'utils/redux-falcor';

import { falcorCache, messages } from "@availabs/avl-components"

// import user from './user';
import options from 'components/CensusCharts/options.store.js'

import { Reducers } from "components/ams/src"

const reducer = combineReducers({
  ...Reducers,
  options,
  messages,
  // graph
  falcorCache
});

export default createStore(reducer, applyMiddleware(thunk))

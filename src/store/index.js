import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { reducer as graph } from 'utils/redux-falcor';

import user from './user';
import options from 'components/CensusCharts/options.store.js'
import messages from './messages';

const reducer = combineReducers({
  user,
  options,
  messages,
  graph
});

export default createStore(reducer, applyMiddleware(thunk))
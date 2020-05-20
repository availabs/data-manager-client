import { sendSystemMessage } from './messages';

import { AUTH_HOST, AUTH_PROJECT_NAME } from 'config';
// ------------------------------------
// Constants
// ------------------------------------
const USER_LOGIN = 'USER::USER_LOGIN';
const USER_LOGOUT = 'USER::USER_LOGOUT';
const AUTH_FAILURE = 'USER::AUTH_FAILURE';
// const RESET_PASSWORD = 'USER::RESET_PASSWORD';

// ------------------------------------
// Actions
// ------------------------------------
function receiveAuthResponse(user) {
  return {
    type: USER_LOGIN,
    user
  };
}

// function TODO_AuthServerVerifiesToken(user) {
// return {
// type: USER_LOGIN,
// res: user // temp hack till auth server takes tokens
// };
// }

export function logout() {
  return {
    type: USER_LOGOUT
  };
}

const setUserToken = user => {
  if (localStorage) {
    localStorage.setItem('userToken', user.token);
  }
};
const getUserToken = user => {
  if (localStorage) {
    return localStorage.getItem('userToken');
  }
  return null;
};
const removeUserToken = () => {
  if (localStorage) {
    localStorage.removeItem('userToken');
  }
};

export const login = ({ email, password }) => dispatch =>
  fetch(`${AUTH_HOST}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, project: AUTH_PROJECT_NAME })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        console.log('LOGIN Error',res.error)
        dispatch({ type: AUTH_FAILURE });
        dispatch(sendSystemMessage(res.error, {type: 'LOGIN ERROR'}));
      } else {
        console.log('login response', res.user)
        dispatch(receiveAuthResponse(res.user));
      }
    });

export const auth = () => dispatch => {
  const token = getUserToken();
  console.log('auth attempt', token, `${AUTH_HOST}/auth`)
  if (token) {
    return fetch(`${AUTH_HOST}/auth`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, project: AUTH_PROJECT_NAME })
    })
      .then(res => res.json())
      .then(res => {
        console.log('auth happened', res)
        if (res.error) {
          dispatch({ type: AUTH_FAILURE });
          dispatch(sendSystemMessage(res.error));
        } else {
          console.log('receiveAuthResponse', res.user)

          dispatch(receiveAuthResponse(res.user));
        }
      });
  } else {
    // return Promise.resolve();
    console.log('no auth')
    return dispatch({ type: AUTH_FAILURE });
  }
};

export const authWithToken = token => dispatch =>
  token ?
    fetch(`${AUTH_HOST}/auth`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, project: AUTH_PROJECT_NAME })
    })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch({ type: AUTH_FAILURE });
        dispatch(sendSystemMessage(res.error));
      } else {
        dispatch(receiveAuthResponse(res.user));
      }
    })
  : Promise.resolve(dispatch({ type: AUTH_FAILURE }))

export const passwordSet = password =>
  (dispatch, getState) => {
    const { token } = getState().user;
    if (token) {
      return fetch(`${ AUTH_HOST }/password/set`, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })
      .then(res => res.json())
      // return postJson("/password/set", { token, password })
      .then(res => {
        if (res.error) {
          dispatch(sendSystemMessage(res.error));
        }
        else {
          if (res.message) {
            dispatch(sendSystemMessage(res.message));
          }
          return dispatch(authWithToken(res.token));
        }
      });
    }
    else {
      return Promise.resolve();
    }
  }

const NEW_USER_GROUP = "candidate";

export const signup = (email, password, office) => dispatch => {
  console.log('project', AUTH_PROJECT_NAME)
  return fetch(`${AUTH_HOST}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, office, project: AUTH_PROJECT_NAME, addToGroup: NEW_USER_GROUP })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        console.log('error',res.error)
        return dispatch(sendSystemMessage(res.error, {type: 'SIGNUP ERROR'}));
      } else {
        console.log('signup response', res)
        dispatch(sendSystemMessage(res.message));
        return dispatch(receiveAuthResponse(res.user));
      }
    })
    .catch(err => console.log('err', err));
};

export const resetPassword = email => dispatch => {
  return fetch(`${AUTH_HOST}/password/reset`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, project_name: AUTH_PROJECT_NAME })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch(sendSystemMessage(res.error));
      } else {
        dispatch(sendSystemMessage(res.message));
      }
    });
};

export const actions = {
  login,
  logout
};

// -------------------------------------
// Initial State
// -------------------------------------
let initialState = {
  token: null,
  groups: [],
  authLevel: -1,
  authed: false,
  attempts: 0,
  meta: []
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USER_LOGIN]: (state = initialState, action) => {
    const newState = { ...state, ...action.user, authed: true };
    ++newState.attempts;
    setUserToken(action.user);
    return newState;
  },
  [AUTH_FAILURE]: (state = initialState, action) => {
    removeUserToken();
    const newState = { ...initialState };
    ++newState.attempts;
    return newState;
  },
  [USER_LOGOUT]: (state = initialState, action) => {
    removeUserToken();
    return { ...initialState };
  }
};

export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
}

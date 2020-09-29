import { sendSystemMessage } from 'store/messages';

import { AUTH_HOST, PROJECT_NAME } from 'config';

export const USER_LOGIN = 'USER::USER_LOGIN';
export const USER_LOGOUT = 'USER::USER_LOGOUT';
export const AUTH_FAILURE = 'USER::AUTH_FAILURE';

const receiveAuthResponse = user => ({
  type: USER_LOGIN,
  user
});

export const setUserToken = user => {
  if (localStorage) {
    localStorage.setItem('userToken', user.token);
  }
};
export const getUserToken = user => {
  if (localStorage) {
    return localStorage.getItem('userToken');
  }
  return null;
};
export const removeUserToken = () => {
  if (localStorage) {
    localStorage.removeItem('userToken');
  }
};

export const logout = () => dispatch =>
  Promise.resolve(dispatch({ type: USER_LOGOUT }));

export const login = (email, password, project) => dispatch =>
  fetch(`${AUTH_HOST}/login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, project: PROJECT_NAME })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        dispatch({ type: AUTH_FAILURE });
        dispatch(sendSystemMessage(res.error, {type: 'LOGIN ERROR'}));
      } else {
        dispatch(receiveAuthResponse(res.user));
      }
    })
    .catch(error => dispatch(sendSystemMessage('Cannot contact authentication server.' , {type: 'LOGIN ERROR'})) );

export const auth = (token = null) => dispatch => {
  token = token || getUserToken();
console.log("AUTHING????????????", AUTH_HOST, token)
  if (token) {
    return fetch(`${AUTH_HOST}/auth`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, project: PROJECT_NAME })
    })
      .then(res => res.json())
      .then(res => {
console.log("RES:", res)
        if (res.error) {
          dispatch({ type: AUTH_FAILURE });
          dispatch(sendSystemMessage(res.error));
        }
        else {
          dispatch(receiveAuthResponse(res.user));
        }
      })
      .catch(error => dispatch(sendSystemMessage('Cannot contact authentication server.' , { type: 'LOGIN ERROR' })));
  }
console.log("????????")
  return dispatch({ type: AUTH_FAILURE });
};

export const setPassword = password =>
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
      .then(res => {
        if (res.error) {
          dispatch(sendSystemMessage(res.error));
        }
        else {
          if (res.message) {
            dispatch(sendSystemMessage(res.message));
          }
          return dispatch(auth(res.token));
        }
      });
    }
    return Promise.resolve();
  }

export const signup = (email, password, project, addToGroup = null) => dispatch => {
  return fetch(`${AUTH_HOST}/signup/request`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, project: PROJECT_NAME, addToGroup })
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        return dispatch(sendSystemMessage(res.error, {type: 'SIGNUP ERROR'}));
      } else {
        dispatch(sendSystemMessage(res.message));
        return dispatch(receiveAuthResponse(res.user));
      }
    })
    .catch(err => console.log('err', err));
};

export const resetPassword = (email, project_name) => dispatch => {
  return fetch(`${AUTH_HOST}/password/reset`, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, project_name })
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

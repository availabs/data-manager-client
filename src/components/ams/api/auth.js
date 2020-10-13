import { sendSystemMessage } from 'components/avl-components/messages/reducer';

import { AUTH_HOST, PROJECT_NAME } from 'config';

import { postJson } from "./utils"

export const USER_LOGIN = 'AMS::USER_LOGIN';
export const USER_LOGOUT = 'AMS::USER_LOGOUT';
export const AUTH_FAILURE = 'AMS::AUTH_FAILURE';
export const UPDATE_USER = 'AMS::UPDATE_USER';

export const receiveAuthResponse = user => ({
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

export const login = (email, password) => dispatch =>
  postJson(`${ AUTH_HOST }/login`, { email, password, project: PROJECT_NAME })
    .then(res => {
      if (res.error) {
        dispatch({ type: AUTH_FAILURE });
        dispatch(sendSystemMessage(res.error, { type: 'Danger' }));
      }
      else {
        dispatch(receiveAuthResponse(res.user));
      }
    })
    .catch(error => dispatch(sendSystemMessage('Cannot contact authentication server.' , { type: 'Danger' })) );

export const auth = (token = getUserToken()) => dispatch => {
  if (token) {
    return postJson(`${ AUTH_HOST }/auth`, { token, project: PROJECT_NAME })
      .then(res => {
        if (res.error) {
          dispatch({ type: AUTH_FAILURE });
          dispatch(sendSystemMessage(res.error));
        }
        else {
          dispatch(receiveAuthResponse(res.user));
        }
      })
      .catch(error => dispatch(sendSystemMessage('Cannot contact authentication server.' , { type: 'Danger' })));
  }
  return dispatch({ type: AUTH_FAILURE });
};

export const updatePassword = (current, password) =>
  (dispatch, getState) => {
    const { token } = getState().user;
    if (token) {
      return postJson(`${ AUTH_HOST }/password/update`, { token, current, password })
        .then(res => {
          if (res.error) {
            return dispatch(sendSystemMessage(res.error, { type: 'Danger' }));
          } else {
            setUserToken(res);
            dispatch(sendSystemMessage(res.message));
            return dispatch({
              type: UPDATE_USER,
              update: { token: res.token }
            });
          }
        })
        .catch(err => console.log('err', err));
    }
    return Promise.resolve();
  }

export const setPassword = password =>
  (dispatch, getState) => {
    const { token } = getState().user;
    if (token) {
      return postJson(`${ AUTH_HOST }/password/set`, { token, password })
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

export const verifyRequest = (token, password) => dispatch =>
  postJson(`${ AUTH_HOST }/signup/request/verified`, { token, password })
    .then(res => {
      if (res.error) {
        return dispatch(sendSystemMessage(res.error, { type: 'Danger' }));
      } else {
        dispatch(sendSystemMessage(res.message));
        return dispatch(receiveAuthResponse(res.user));
      }
    })
    .catch(err => console.log('err', err));

export const resetPassword = email => dispatch =>
  postJson(`${ AUTH_HOST }/password/reset`, { email, project_name: PROJECT_NAME })
    .then(res => {
      if (res.error) {
        dispatch(sendSystemMessage(res.error));
      } else {
        dispatch(sendSystemMessage(res.message));
      }
    });
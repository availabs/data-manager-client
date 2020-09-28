import {
  USER_LOGIN,
  AUTH_FAILURE,
  USER_LOGOUT,
  setUserToken,
  removeUserToken
} from "../api/auth"

const getInitialState = () => ({
  token: null,
  groups: [],
  authLevel: -1,
  authed: false,
  attempts: 0,
  meta: [],
  id: null
});

export default (state = getInitialState(), action) => {
  switch (action.type) {
    case USER_LOGIN: {
      const newState = { ...state, ...action.user, authed: true };
      ++newState.attempts;
      setUserToken(action.user);
      return newState;
    }
    case AUTH_FAILURE: {
      removeUserToken();
      const newState = getInitialState();
      ++newState.attempts;
      return newState;
    }
    case USER_LOGOUT: {
      removeUserToken();
      return getInitialState();
    }
    default:
      return state;
  }
};

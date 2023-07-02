import { actions } from "../constants/constants";

export const setUserList = (users) => {
  return {
    type: actions.SET_USER_LIST,
    payload: users,
  };
};

export const setError = (msg) => {
  return {
    type: actions.SET_ERROR,
    payload: msg,
  };
};

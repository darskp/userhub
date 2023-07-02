import { actions } from "../constants/constants";

export const setCurrentUser = (email,token) => {
  return {
    type: actions.SET_CURRENT_USER,
    payload: {email,token},
  };
};

export const logoutUser = () => {
  return {
    type: actions.LOGOUT_USER,
  };
};
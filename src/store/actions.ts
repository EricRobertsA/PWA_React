import { Action, ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';

import Api, {
  setAuth,
  deleteAuth,
  POST_AUTH_PATH,
  GET_USER_PATH,
  POST_REMIND_PASSWORD_PATH,
  POST_NEW_PASSWORD_PATH,
  POST_VERIFY_EMAIL_PATH,
} from '../utils/api';

import {
  CredentialsType,
  NewPasswordType,
} from './types';

// Actions Types
////////////////////////////////////////////////////////////

// Auth

export const AUTH_REQUEST = 'AUTH_REQUEST';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';

export const REMIND_PASSWORD_REQUEST = 'REMIND_PASSWORD';
export const REMIND_PASSWORD_SUCCESS = 'REMIND_PASSWORD_SUCCESS';
export const REMIND_PASSWORD_ERROR = 'REMIND_PASSWORD_ERROR';

export const SET_NEW_PASSWORD = 'SET_NEW_PASSWORD';
export const SET_NEW_PASSWORD_SUCCESS = 'SET_NEW_PASSWORD_SUCCESS';
export const SET_NEW_PASSWORD_ERROR = 'SET_NEW_PASSWORD_ERROR';

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';

export const AUTH_LOGOUT = 'AUTH_LOGOUT';

// User

export const USER_REQUEST = 'USER_REQUEST';
export const USER_SUCCESS = 'USER_SUCCESS';
export const USER_ERROR = 'USER_ERROR';

export const SEND_VERIFY_EMAIL = 'SEND_VERIFY_EMAIL';
export const SEND_VERIFY_EMAIL_SUCCESS = 'SEND_VERIFY_EMAIL_SUCCESS';
export const SEND_VERIFY_EMAIL_ERROR = 'SEND_VERIFY_EMAIL_ERROR';

// Action Creators
////////////////////////////////////////////////////////////

// Auth

export const authRequest : ActionCreator<Action> = () => {
  return {
    type: AUTH_REQUEST,
  };
};

export const authSuccess : ActionCreator<Action> = () => {
  return {
    type: AUTH_SUCCESS,
  };
};

export const authError : ActionCreator<Action> = (error: string) => {
  return {
    type: AUTH_ERROR,
    error,
  };
};

export const postAuth: ActionCreator<ThunkAction<Promise<Action>, Action, void, any>>
  = (credentials: CredentialsType) => {
    return async (dispatch: Dispatch<Action>): Promise<Action> => {
      dispatch(authRequest());
      try {
        const response = await Api.post(POST_AUTH_PATH, { user: credentials });
        const token = response.data.user.token;
        setAuth(token);
        return dispatch(authSuccess());
      } catch (e) {
        console.log(e);
        return dispatch(authError(e));
      };
    };
};

export const remindPasswordRequest : ActionCreator<Action> = () => {
  return {
    type: REMIND_PASSWORD_REQUEST,
  };
};

export const remindPasswordSuccess : ActionCreator<Action> = (message: string) => {
  console.log(message);
  return {
    type: REMIND_PASSWORD_SUCCESS,
    message,
  };
};

export const remindPasswordError : ActionCreator<Action> = (error: string) => {
  return {
    type: REMIND_PASSWORD_ERROR,
    error,
  };
};

export const postRemindPassword: ActionCreator<ThunkAction<Promise<Action>, Action, void, any>>
  = (usermail: string) => {
    return async (dispatch: Dispatch<Action>): Promise<Action> => {
      dispatch(remindPasswordRequest());
      try {
        const response = await Api.post(POST_REMIND_PASSWORD_PATH, { usermail });
        return dispatch(remindPasswordSuccess(response.data.success.message));
      } catch (e) {
        return dispatch(remindPasswordError(e.response.data.error.message));
      };
    };
};

export const setNewPassword : ActionCreator<Action> = () => {
  return {
    type: SET_NEW_PASSWORD,
  };
};

export const setNewPasswordSuccess : ActionCreator<Action> = () => {
  return {
    type: SET_NEW_PASSWORD_SUCCESS,
  };
};

export const setNewPasswordError : ActionCreator<Action> = (error: string) => {
  return {
    type: SET_NEW_PASSWORD_ERROR,
    error,
  };
};

export const postNewPassword: ActionCreator<ThunkAction<Promise<Action>, Action, void, any>>
  = (credentials: NewPasswordType) => {
    return async (dispatch: Dispatch<Action>): Promise<Action> => {
      dispatch(setNewPassword());
      const user = { id: credentials.id, password: credentials.password }
      const token = credentials.token;
      console.log('postNewPassword 1 : ', user);
      try {
        const response = await Api.post(POST_NEW_PASSWORD_PATH, { user });
        console.log('postNewPassword 2 : ', response, token);
        setAuth(token);
        return dispatch(setNewPasswordSuccess());
      } catch (e) {
        console.log(e);
        return dispatch(setNewPasswordError(e));
      };
    };
};

export const clearMessages : ActionCreator<Action> = () => {
  deleteAuth();
  return {
    type: CLEAR_MESSAGES,
  };
};

export const authLogout : ActionCreator<Action> = () => {
  deleteAuth();
  return {
    type: AUTH_LOGOUT,
  };
};

// User

export const userRequest : ActionCreator<Action> = () => {
  return {
    type: USER_REQUEST,
  };
};

export const userSuccess : ActionCreator<Action> = (profile: string) => {
  return {
    type: USER_SUCCESS,
    profile,
  };
};

export const userError : ActionCreator<Action> = (error: string) => {
  return {
    type: USER_ERROR,
    error,
  };
};

export const getUser: ActionCreator<ThunkAction<Promise<Action>, Action, void, any>>
  = (credentials: CredentialsType) => {
    return async (dispatch: Dispatch<Action>): Promise<Action> => {
      dispatch(userRequest());
      try {
        const response = await Api.get(GET_USER_PATH);
        return dispatch(userSuccess(response.data.user));
      } catch (e) {
        console.log(e);
        return dispatch(userError(e));
      };
    };
};

export const sendVerifyEmail : ActionCreator<Action> = () => {
  return {
    type: SEND_VERIFY_EMAIL,
  };
};

export const sendVerifyEmailSuccess : ActionCreator<Action> = () => {
  return {
    type: SEND_VERIFY_EMAIL_SUCCESS,
  };
};

export const sendVerifyEmailError : ActionCreator<Action> = (error: string) => {
  return {
    type: SEND_VERIFY_EMAIL_ERROR,
    error,
  };
};

export const postVerifyEmail: ActionCreator<ThunkAction<Promise<Action>, Action, void, any>>
  = (usermail: string) => {
    return async (dispatch: Dispatch<Action>): Promise<Action> => {
      dispatch(sendVerifyEmail());
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await Api.post(POST_VERIFY_EMAIL_PATH, { usermail });
        return dispatch(sendVerifyEmailSuccess());
      } catch (e) {
        console.log(e);
        return dispatch(sendVerifyEmailError(e));
      };
    };
};


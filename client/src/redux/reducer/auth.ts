import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootInitialState } from '../../types/redux';
import { User } from '../../types/user';
import { AppDispatch } from '../store';

type AuthState = RootInitialState & {
  authenticated: boolean;
  user: User | null;
};

const initialState: AuthState = {
  loading: 'idle',
  authenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading: (state: AuthState) => {
      state.loading = 'loading';
    },

    getCurrentUserSuccess: (state: AuthState, action: PayloadAction<User>) => {
      state.loading = 'success';
      state.authenticated = true;
      state.user = action.payload;
    },

    getCurrentUserFailure: (state: AuthState) => {
      state.loading = 'error';
      state.authenticated = false;
      state.user = null;
    },
  },
});

export const GetCurrentUser = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.startLoading());

    const response = await axios.get('/api/auth/current');

    if (response.status != 200) {
      dispatch(authSlice.actions.getCurrentUserFailure());
    }

    if (!response.data) {
      dispatch(authSlice.actions.getCurrentUserFailure());
    }

    dispatch(authSlice.actions.getCurrentUserSuccess(response.data.payload));
  };
};

export const SignOutCurrentUser = () => {
  return async (dispatch: AppDispatch) => {
    const response = await axios.get('/api/auth/signout');

    dispatch(GetCurrentUser());
  };
};

export default authSlice.reducer;

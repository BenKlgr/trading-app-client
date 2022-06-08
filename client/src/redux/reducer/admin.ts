import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootInitialState } from '../../types/redux';
import { User } from '../../types/user';
import { AppDispatch } from '../store';

type AdminState = RootInitialState & {
  users: User[];
};

const initialState: AdminState = {
  loading: 'idle',
  users: [],
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    startLoading: (state: AdminState) => {
      state.loading = 'loading';
    },

    getUsersSuccess: (state: AdminState, action: PayloadAction<User[]>) => {
      state.loading = 'success';
      state.users = action.payload;
    },

    getUsersFailure: (state: AdminState) => {
      state.loading = 'error';
      state.users = [];
    },
  },
});

export const GetUsers = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(adminSlice.actions.startLoading());

    const response = await axios.get('/api/admin/users');

    if (response.status != 200) {
      dispatch(adminSlice.actions.getUsersFailure());
    }

    if (!response.data) {
      dispatch(adminSlice.actions.getUsersFailure());
    }

    dispatch(adminSlice.actions.getUsersSuccess(response.data.payload));
  };
};

export const DeleteUser = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    const response = await axios.post(`/api/admin/user/${userId}/delete`);

    dispatch(GetUsers());
  };
};

export const ToggleUserPremium = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    const response = await axios.post(`/api/admin/user/${userId}/premium`);

    dispatch(GetUsers());
  };
};

export const ToggleUserAdmin = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    const response = await axios.post(`/api/admin/user/${userId}/admin`);

    dispatch(GetUsers());
  };
};

export default adminSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Notification } from '../../types/notification';
import { RootInitialState } from '../../types/redux';
import { User } from '../../types/user';
import { AppDispatch } from '../store';

type NotificationsState = RootInitialState & {
  notifications: Notification[];
};

const initialState: NotificationsState = {
  loading: 'idle',
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    startLoading: (state: NotificationsState) => {
      state.loading = 'loading';
    },

    getUserNotificationsSuccess: (
      state: NotificationsState,
      action: PayloadAction<Notification[]>
    ) => {
      state.loading = 'success';
      state.notifications = action.payload;
    },

    getUserNotificationsFailure: (state: NotificationsState) => {
      state.loading = 'error';
      state.notifications = [];
    },
  },
});

export const GetUserNotifications = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(notificationsSlice.actions.startLoading());

    const response = await axios.get('/api/user/notifications');

    if (response.status != 200) {
      dispatch(notificationsSlice.actions.getUserNotificationsFailure());
    }

    if (!response.data) {
      dispatch(notificationsSlice.actions.getUserNotificationsFailure());
    }

    dispatch(
      notificationsSlice.actions.getUserNotificationsSuccess(response.data.payload)
    );
  };
};

export const MarkNotificationsAsRead = () => {
  return async (dispatch: AppDispatch) => {
    const response = await axios.get('/api/user/notifications/read');
    dispatch(GetUserNotifications());
  };
};

export default notificationsSlice.reducer;

import { combineReducers } from '@reduxjs/toolkit';
import auth from './reducer/auth';
import notifications from './reducer/notifications';
import admin from './reducer/admin';
import placements from './reducer/placements';

export const rootReducer = combineReducers({
  auth,
  notifications,
  admin,
  placements,
});

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';
import axios from 'axios';
import { RootInitialState } from '../../types/redux';
import { Placement } from '../../types/placement';
import { User } from '../../types/user';

type PlacementsType = RootInitialState & {
  placements: Placement[];
  currentFilter: {
    search: string;
    item: string;
    unit: string;
  };
};
const initialState: PlacementsType = {
  loading: 'idle',
  placements: [],
  currentFilter: {
    search: '',
    item: '',
    unit: '',
  },
};

const placementsSlice = createSlice({
  name: 'placements',
  initialState,

  reducers: {
    startLoading: (state: PlacementsType) => {
      state.loading = 'loading';
    },

    failedFetchingAllPlacements: (state: PlacementsType) => {
      state.loading = 'error';
      state.placements = [];
    },

    successFetchingAllPlacements: (
      state: PlacementsType,
      action: PayloadAction<Placement[]>
    ) => {
      state.loading = 'success';
      state.placements = action.payload;
    },

    failedFetchingAllUsers: (state: PlacementsType) => {
      state.loading = 'error';
      state.placements = [];
    },

    setFilter: (state: PlacementsType, action: PayloadAction<any>) => {
      state.currentFilter = action.payload;
    },
  },
});

export function GetAllPlacements() {
  return async (dispatch: any) => {
    dispatch(placementsSlice.actions.startLoading());

    const response = await axios.get('/api/placements/all');

    if (response.status != 200) {
      return dispatch(placementsSlice.actions.failedFetchingAllPlacements());
    }

    return dispatch(
      placementsSlice.actions.successFetchingAllPlacements(response.data.payload)
    );
  };
}

export function SetPlacementFilter(filter: any) {
  return async (dispatch: any) => {
    dispatch(placementsSlice.actions.setFilter(filter));
  };
}

export default placementsSlice.reducer;

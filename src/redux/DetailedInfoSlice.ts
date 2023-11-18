import { createSlice } from '@reduxjs/toolkit';

export interface DetailedInfoSliceState {
  username?: string;
  repo?: string;
}

export interface DetailedInfoSliceSetDetailedInfoAction {
  payload: {
    username?: string;
    repo?: string;
  };
}

const detailedInfoSlice = createSlice({
  name: 'detailedInfo',
  initialState: {},
  reducers: {
    setDetailedInfo: (
      state: DetailedInfoSliceState,
      action: DetailedInfoSliceSetDetailedInfoAction
    ) => {
      state.username = action.payload.username;
      state.repo = action.payload.repo;
    },
  },
});

export const { setDetailedInfo } = detailedInfoSlice.actions;

export const detailedInfoSliceReducer = detailedInfoSlice.reducer;

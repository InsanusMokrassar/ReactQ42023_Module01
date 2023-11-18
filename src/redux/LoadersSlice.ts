import { createSlice } from '@reduxjs/toolkit';

export interface LoadersSliceState {
  itemsLoading: boolean;
  detailedItemLoading: boolean;
}

export interface LoadersSliceSetLoadersAction {
  payload: {
    itemsLoading?: boolean;
    detailedItemLoading?: boolean;
  };
}

const loadersSlice = createSlice({
  name: 'loaders',
  initialState: {
    itemsLoading: false,
    detailedItemLoading: false,
  },
  reducers: {
    setLoading: (
      state: LoadersSliceState,
      action: LoadersSliceSetLoadersAction
    ) => {
      state.itemsLoading =
        action.payload.itemsLoading !== undefined
          ? action.payload.itemsLoading
          : state.itemsLoading;
      state.detailedItemLoading =
        action.payload.detailedItemLoading !== undefined
          ? action.payload.detailedItemLoading
          : state.detailedItemLoading;
    },
  },
});

export const { setLoading } = loadersSlice.actions;

export const loadersSliceReducer = loadersSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import { searchSliceReducer, SearchSliceState } from './SearchSlice';

export interface SearchSliceStateSlice {
  search: SearchSliceState;
}

export const store = configureStore({
  reducer: {
    search: searchSliceReducer,
  },
});

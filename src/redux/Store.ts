import { configureStore } from '@reduxjs/toolkit';
import { searchSliceReducer, SearchSliceState } from './SearchSlice';
import {
  detailedInfoSliceReducer,
  DetailedInfoSliceState,
} from './DetailedInfoSlice';

export interface SearchSliceStateSlice {
  search: SearchSliceState;
}

export interface DetailedInfoSliceStateSlice {
  details: DetailedInfoSliceState;
}

export const store = configureStore({
  reducer: {
    search: searchSliceReducer,
    details: detailedInfoSliceReducer,
  },
});

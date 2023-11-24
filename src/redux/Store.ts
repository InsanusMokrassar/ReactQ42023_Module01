import { configureStore } from '@reduxjs/toolkit';
import { searchSliceReducer, SearchSliceState } from './SearchSlice';
import {
  detailedInfoSliceReducer,
  DetailedInfoSliceState,
} from './DetailedInfoSlice';
import { serverApi } from './ServerApi';
import { loadersSliceReducer, LoadersSliceState } from './LoadersSlice';

export interface SearchSliceStateSlice {
  search: SearchSliceState;
}

export interface DetailedInfoSliceStateSlice {
  details: DetailedInfoSliceState;
}

export interface LoadersSliceStateSlice {
  loaders: LoadersSliceState;
}

export const store = configureStore({
  reducer: {
    search: searchSliceReducer,
    details: detailedInfoSliceReducer,
    loaders: loadersSliceReducer,
    [serverApi.reducerPath]: serverApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serverApi.middleware),
});

import { configureStore } from '@reduxjs/toolkit';
import { searchSliceReducer, SearchSliceState } from './SearchSlice';
import {
  detailedInfoSliceReducer,
  DetailedInfoSliceState,
} from './DetailedInfoSlice';
import { githubApi } from './GithubApi';
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
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware),
});

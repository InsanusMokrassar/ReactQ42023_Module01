import { configureStore } from '@reduxjs/toolkit';
import { searchSliceReducer, SearchSliceState } from './SearchSlice';
import {
  detailedInfoSliceReducer,
  DetailedInfoSliceState,
} from './DetailedInfoSlice';
import { githubApi } from './GithubApi';

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
    [githubApi.reducerPath]: githubApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware),
});

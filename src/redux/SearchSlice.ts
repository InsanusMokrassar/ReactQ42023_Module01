import { createSlice } from '@reduxjs/toolkit';

export interface SearchSliceState {
  search: string;
}

export interface SearchSliceSetSearchAction {
  payload: {
    text: string;
  };
}

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    search: '',
  },
  reducers: {
    setSearch: (
      state: SearchSliceState,
      action: SearchSliceSetSearchAction
    ) => {
      state.search = action.payload.text;
    },
  },
});

export const { setSearch } = searchSlice.actions;

export const searchSliceReducer = searchSlice.reducer;

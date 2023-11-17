import { createSlice } from '@reduxjs/toolkit';

export interface SearchSliceState {
  search: string;
  itemsPerPage: number;
}

export interface SearchSliceSetSearchAction {
  payload: {
    text: string;
  };
}

export interface SearchSliceSetSearchAction {
  payload: {
    text: string;
  };
}

export interface ItemsPerPageSliceSetSearchAction {
  payload: {
    count: number;
  };
}

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    search: '',
    itemsPerPage: 10,
  },
  reducers: {
    setSearch: (
      state: SearchSliceState,
      action: SearchSliceSetSearchAction
    ) => {
      state.search = action.payload.text;
    },
    setItemsPerPage: (
      state: SearchSliceState,
      action: ItemsPerPageSliceSetSearchAction
    ) => {
      state.itemsPerPage = action.payload.count;
    },
  },
});

export const { setSearch, setItemsPerPage } = searchSlice.actions;

export const searchSliceReducer = searchSlice.reducer;

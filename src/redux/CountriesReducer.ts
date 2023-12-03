import { createSlice } from '@reduxjs/toolkit';
import { countries, Country } from '../Countries';

export type CountriesSliceState = Array<Country>;

const countriesSlice = createSlice({
  name: 'countries',
  initialState: countries,
  reducers: {},
});

export const countriesSliceReducer = countriesSlice.reducer;

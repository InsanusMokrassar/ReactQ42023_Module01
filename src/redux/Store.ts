import { configureStore } from '@reduxjs/toolkit';
import { formInfoSliceReducer, FormsSliceState } from './FormReducer';
import { countriesSliceReducer, CountriesSliceState } from './CountriesReducer';

export interface FormsSliceStateSlice {
  forms: Array<FormsSliceState>;
}

export interface CountriesSliceStateSlice {
  countries: CountriesSliceState;
}

export const store = configureStore({
  reducer: {
    forms: formInfoSliceReducer,
    countries: countriesSliceReducer,
  },
});

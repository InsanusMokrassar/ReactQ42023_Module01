import { configureStore } from '@reduxjs/toolkit';
import { formInfoSliceReducer, FormsSliceState } from './FormReducer';

export interface FormsSliceStateSlice {
  forms: FormsSliceState;
}

export const store = configureStore({
  reducer: {
    forms: formInfoSliceReducer,
  },
});

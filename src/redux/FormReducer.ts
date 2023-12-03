import { createSlice } from '@reduxjs/toolkit';

export enum Gender {
  MALE,
  FEMALE,
  OTHER,
}

export type FormsWithoutPictureSliceState = {
  firstName: string;
  age: number;
  email: string;
  password: string;
  passwordApprove: string;
  gender: Gender;
  accepted: boolean | true;
  country: string;
};

export type FormsSliceState = {
  picture?: string;
} & FormsWithoutPictureSliceState;

export type SetFormAction = {
  payload: FormsSliceState;
};

const formInfoSlice = createSlice({
  name: 'forms',
  initialState: {
    firstName: 'Unset',
    age: 0,
    email: 'unset@unset.unset',
    password: 'unset',
    passwordApprove: 'unset',
    gender: Gender.OTHER,
    accepted: false,
    picture: undefined,
    country: 'Unset',
  },
  reducers: {
    setForm: (state: FormsSliceState, action: SetFormAction) => {
      state.firstName = action.payload.firstName;
      state.age = action.payload.age;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.passwordApprove = action.payload.passwordApprove;
      state.gender = action.payload.gender;
      state.accepted = action.payload.accepted;
      state.picture = action.payload.picture;
      state.country = action.payload.country;
    },
  },
});

export const { setForm } = formInfoSlice.actions;

export const formInfoSliceReducer = formInfoSlice.reducer;

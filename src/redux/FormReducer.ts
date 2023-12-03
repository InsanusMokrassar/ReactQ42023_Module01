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

export type FormsSliceStates = Array<FormsSliceState>;

export type SetFormAction = {
  payload: FormsSliceState;
};

export const DefaultEmptyForm: FormsSliceState = {
  firstName: 'Unset',
  age: 0,
  email: 'unset@unset.unset',
  password: 'unset',
  passwordApprove: 'unset',
  gender: Gender.OTHER,
  accepted: false,
  picture: undefined,
  country: 'Unset',
};

const formInfoSlice = createSlice({
  name: 'forms',
  initialState: [],
  reducers: {
    appendForm: (state: Array<FormsSliceState>, action: SetFormAction) => {
      const newForm: FormsSliceState = {
        firstName: action.payload.firstName,
        age: action.payload.age,
        email: action.payload.email,
        password: action.payload.password,
        passwordApprove: action.payload.passwordApprove,
        gender: action.payload.gender,
        accepted: action.payload.accepted,
        picture: action.payload.picture,
        country: action.payload.country,
      };
      state.push(newForm);
    },
  },
});

export const { appendForm } = formInfoSlice.actions;

export const formInfoSliceReducer = formInfoSlice.reducer;

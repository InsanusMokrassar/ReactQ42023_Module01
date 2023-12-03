import { FormsSliceStateSlice } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { ReactNode, useState } from 'react';
import { FormsSliceState, Gender, setForm } from '../redux/FormReducer';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { boolean, number, object, string } from "yup";

const formSchema = object({
  firstName: string()
    .required()
    .test((value) => {
      const firstLetter = value.substring(0, 1);

      return firstLetter == firstLetter.toUpperCase();
    }),
  age: number().integer().min(0),
  email: string().email(),
  password: string().when('passwordApprove', {
    is: (values: FormsSliceState) => values.password,
  }),
  accepted: boolean().required()
});

export default function ControlledForm(): ReactNode {
  const formStateSlice: FormsSliceState = useSelector<
    FormsSliceStateSlice,
    FormsSliceState
  >((state) => state.forms);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormsSliceState>();

  const setFormCallback = setForm;
  const dispatcher = useDispatch();

  // const navigate = useNavigate();

  async function onSubmit(data: FormsSliceState) {
    const result = await formSchema.validate(data);

    dispatcher(setFormCallback(data));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Name
          <input
            type={'text'}
            defaultValue={formStateSlice.firstName}
            {...register('firstName')}
          />
        </label>
      </div>
      <div>
        <label>
          Age
          <input
            type={'number'}
            min={0}
            defaultValue={formStateSlice.age}
            {...register('age')}
          />
        </label>
      </div>
      <div>
        <label>
          Email
          <input
            type={'email'}
            defaultValue={formStateSlice.email}
            {...register('email')}
          />
        </label>
      </div>
      <div>
        <label>
          Password
          <input type={'text'} defaultValue={''} {...register('password')} />
          <input
            type={'text'}
            defaultValue={''}
            {...register('passwordApprove')}
          />
        </label>
      </div>
      <div>
        <label>
          Gender
          <select
            defaultValue={formStateSlice.gender}
            {...register('gender', {})}
          >
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.OTHER}>Other</option>
          </select>
        </label>
      </div>
      <label>
        Accept T&C
        <input type={'checkbox'} {...register('accepted')} />
      </label>
      <input type={'submit'} />
    </form>
  );
}

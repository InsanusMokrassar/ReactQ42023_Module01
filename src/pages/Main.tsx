import { FormsSliceStateSlice } from '../redux/Store';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { FormsSliceStates } from '../redux/FormReducer';
import { Outlet } from 'react-router-dom';
import { Form } from './Form';

export default function Main(): ReactNode {
  const formStateSlices: FormsSliceStates = useSelector<
    FormsSliceStateSlice,
    FormsSliceStates
  >((state) => state.forms);

  return (
    <div>
      <span>
        <a href={'/controlled'}>Controlled</a>
        <a href={'/uncontrolled'}>Uncontrolled</a>
      </span>
      {formStateSlices.map((form, i) => (
        <Form key={`form_${i}`} {...form} />
      ))}

      <Outlet></Outlet>
    </div>
  );
}

import { FormsSliceStateSlice } from '../redux/Store';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { FormsSliceStates } from '../redux/FormReducer';
import { Outlet, useNavigate } from 'react-router-dom';
import { Form } from './Form';

export default function Main(): ReactNode {
  const formStateSlices: FormsSliceStates = useSelector<
    FormsSliceStateSlice,
    FormsSliceStates
  >((state) => state.forms);

  const navigate = useNavigate();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div>
        <span>
          <button onClick={() => navigate('/controlled')}>Controlled</button>
          <button onClick={() => navigate('/uncontrolled')}>
            Uncontrolled
          </button>
        </span>
        {formStateSlices.map((form, i) => (
          <Form key={`form_${i}`} {...form} />
        ))}
      </div>

      <div>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

import { FormsSliceStateSlice } from '../redux/Store';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { FormsSliceState } from '../redux/FormReducer';
import { Outlet } from 'react-router-dom';

export default function Main(): ReactNode {
  const formStateSlice: FormsSliceState = useSelector<
    FormsSliceStateSlice,
    FormsSliceState
  >((state) => state.forms);
  // const [previousState, setNewState] = useState(formStateSlice);

  return (
    <div>
      <span>
        <a href={'/controlled'}>Controlled</a>
        <a href={'/uncontrolled'}>Uncontrolled</a>
      </span>
      <div>Name: {formStateSlice.firstName}</div>
      <div>Age: {formStateSlice.age}</div>
      <div>EMail: {formStateSlice.email}</div>
      <div>Gender: {formStateSlice.gender}</div>
      <div>Accepted T&C: {formStateSlice.accepted}</div>
      <div>
        Image:{' '}
        <img
          src={formStateSlice.picture}
          width={512}
          height={512}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div>Country: {formStateSlice.country}</div>

      <Outlet></Outlet>
    </div>
  );
}

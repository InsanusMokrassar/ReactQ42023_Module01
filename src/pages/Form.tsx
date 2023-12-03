import { FormsSliceState } from '../redux/FormReducer';

export function Form(form: FormsSliceState) {
  return (
    <div>
      <div>Name: {form.firstName}</div>
      <div>Age: {form.age}</div>
      <div>EMail: {form.email}</div>
      <div>Gender: {form.gender}</div>
      <div>Accepted T&C: {form.accepted}</div>
      <div>
        Image:{' '}
        <img
          src={form.picture}
          width={512}
          height={512}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <div>Country: {form.country}</div>
    </div>
  );
}

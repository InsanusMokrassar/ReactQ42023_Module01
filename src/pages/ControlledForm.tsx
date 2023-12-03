import { CountriesSliceStateSlice, FormsSliceStateSlice } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { ReactNode, useEffect, useState } from 'react';
import {
  appendForm,
  DefaultEmptyForm,
  FormsSliceStates,
  FormsWithoutPictureSliceState,
  Gender,
} from '../redux/FormReducer';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { formSchema } from './FormSchema';
import { CountriesSliceState } from '../redux/CountriesReducer';
import { Country } from '../Countries';
import { converterToBase64 } from '../utils/Base64Exporter';
import { useNavigate } from 'react-router-dom';

type PictureAsFile = {
  picture: FileList;
};

export default function ControlledForm(): ReactNode {
  const formStateSlices: FormsSliceStates = useSelector<
    FormsSliceStateSlice,
    FormsSliceStates
  >((state) => state.forms);
  const formStateSlice =
    formStateSlices.length > 0
      ? formStateSlices[formStateSlices.length - 1]
      : DefaultEmptyForm;
  const countries: CountriesSliceState = useSelector<
    CountriesSliceStateSlice,
    CountriesSliceState
  >((state) => state.countries);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormsWithoutPictureSliceState & PictureAsFile>({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });

  const setFormCallback = appendForm;
  const dispatcher = useDispatch();
  const navigate = useNavigate();

  async function onSubmit(data: FormsWithoutPictureSliceState & PictureAsFile) {
    dispatcher(
      setFormCallback({
        ...data,
        picture: await converterToBase64(data.picture[0]),
      })
    );
    navigate('/');
  }

  const [countriesToAutocomplete, setCountriesToAutocomplete] = useState<
    Array<Country>
  >([]);

  const country = watch('country');
  const inputtedCountryLowercase = (country || '').toLowerCase();
  useEffect(() => {
    const newCountriesToAutocomplete = countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(inputtedCountryLowercase) ||
        country.code.toLowerCase().includes(inputtedCountryLowercase)
      );
    });
    let requireUpdate =
      newCountriesToAutocomplete.length != countriesToAutocomplete.length;
    for (const country of countriesToAutocomplete) {
      requireUpdate =
        requireUpdate || !newCountriesToAutocomplete.includes(country);
      if (requireUpdate) {
        break;
      }
    }

    if (requireUpdate) {
      setCountriesToAutocomplete(newCountriesToAutocomplete);
    }
  }, [
    countriesToAutocomplete,
    setCountriesToAutocomplete,
    inputtedCountryLowercase,
    countries,
  ]);

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
          {errors.firstName ? (
            <div>{errors.firstName.message}</div>
          ) : (
            <div></div>
          )}
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
        {errors.age ? <div>{errors.age.message}</div> : <div></div>}
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
        {errors.email ? <div>{errors.email.message}</div> : <div></div>}
      </div>
      <div>
        <label>
          Password
          <input type={'text'} defaultValue={''} {...register('password')} />
          {errors.password ? <div>{errors.password.message}</div> : <div></div>}
          <input
            type={'text'}
            defaultValue={''}
            {...register('passwordApprove')}
          />
          {errors.passwordApprove ? (
            <div>{errors.passwordApprove.message}</div>
          ) : (
            <div></div>
          )}
        </label>
      </div>
      <div>
        <label>
          Picture
          <input
            type={'file'}
            accept={'image/jpeg,image/png'}
            multiple={false}
            {...register('picture')}
          />
          {errors.picture ? <div>{errors.picture.message}</div> : <div></div>}
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
        {errors.gender ? <div>{errors.gender.message}</div> : <div></div>}
      </div>
      <div>
        <label>
          Accept T&C
          <input
            type={'checkbox'}
            {...register('accepted')}
            defaultChecked={formStateSlice.accepted}
          />
          {errors.accepted ? <div>{errors.accepted.message}</div> : <div></div>}
        </label>
      </div>
      <div>
        <label>
          Country
          <input
            type={'text'}
            {...register('country')}
            defaultValue={formStateSlice.country}
          />
          {errors.country ? <div>{errors.country.message}</div> : <div></div>}
          {...countriesToAutocomplete.map((country) => (
            <div key={country.code}>
              <button
                onClick={() => {
                  setValue('country', country.name);
                }}
              >
                {country.name}
              </button>
            </div>
          ))}
        </label>
      </div>
      <input type={'submit'} />
    </form>
  );
}

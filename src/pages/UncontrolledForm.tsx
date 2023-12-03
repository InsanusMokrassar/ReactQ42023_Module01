import { CountriesSliceStateSlice, FormsSliceStateSlice } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { createRef, MouseEvent, ReactNode, RefObject, useState } from 'react';
import {
  appendForm,
  DefaultEmptyForm,
  FormsSliceStates,
  Gender,
} from '../redux/FormReducer';
import { formSchema } from './FormSchema';
import { CountriesSliceState } from '../redux/CountriesReducer';
import { Country } from '../Countries';
import { converterToBase64 } from '../utils/Base64Exporter';
import { ValidationError } from 'yup';
import { useNavigate } from 'react-router-dom';

export default function UncontrolledForm(): ReactNode {
  const formStateSlices: FormsSliceStates = useSelector<
    FormsSliceStateSlice,
    FormsSliceStates
  >((state) => state.forms);
  const countries: CountriesSliceState = useSelector<
    CountriesSliceStateSlice,
    CountriesSliceState
  >((state) => state.countries);
  const formStateSlice =
    formStateSlices.length > 0
      ? formStateSlices[formStateSlices.length - 1]
      : DefaultEmptyForm;

  const firstNameInputRef = createRef<HTMLInputElement>();
  const firstNameErrorRef = createRef<HTMLDivElement>();
  const ageInputRef = createRef<HTMLInputElement>();
  const ageErrorRef = createRef<HTMLDivElement>();
  const emailInputRef = createRef<HTMLInputElement>();
  const emailErrorRef = createRef<HTMLDivElement>();
  const passwordInputRef = createRef<HTMLInputElement>();
  const passwordErrorRef = createRef<HTMLDivElement>();
  const passwordApproveInputRef = createRef<HTMLInputElement>();
  const passwordApproveErrorRef = createRef<HTMLDivElement>();
  const genderInputRef = createRef<HTMLSelectElement>();
  const genderErrorRef = createRef<HTMLDivElement>();
  const acceptedInputRef = createRef<HTMLInputElement>();
  const acceptedErrorRef = createRef<HTMLDivElement>();
  const imageInputRef = createRef<HTMLInputElement>();
  const imageErrorRef = createRef<HTMLDivElement>();
  const countryInputRef = createRef<HTMLInputElement>();
  const countryErrorRef = createRef<HTMLDivElement>();

  const errorRefs: { [key: string]: RefObject<HTMLDivElement> } = {
    firstName: firstNameErrorRef,
    age: ageErrorRef,
    email: emailErrorRef,
    password: passwordErrorRef,
    passwordApprove: passwordApproveErrorRef,
    gender: genderErrorRef,
    accepted: acceptedErrorRef,
    picture: imageErrorRef,
    country: countryErrorRef,
  };

  const setFormCallback = appendForm;
  const dispatcher = useDispatch();
  const navigate = useNavigate();

  const [countriesToAutocomplete, setCountriesToAutocomplete] = useState<
    Array<Country>
  >([]);

  function fillCountriesToAutocomplete(currentInput: string) {
    const currentInputLowercased = currentInput.toLowerCase();
    const newCountriesToAutocomplete = countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(currentInputLowercased) ||
        country.code.toLowerCase().includes(currentInputLowercased)
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
  }

  async function checkInputAndSubmit() {
    for (const errorRefsKey in errorRefs) {
      const element = errorRefs[errorRefsKey].current;
      if (element != null) {
        element.innerHTML = '';
      }
    }
    let validationResult;
    try {
      validationResult = await formSchema.validate(
        {
          firstName: firstNameInputRef.current?.value || '',
          age: parseInt(ageInputRef.current?.value || '0'),
          email: emailInputRef.current?.value || '',
          password: passwordInputRef.current?.value || '',
          passwordApprove: passwordApproveInputRef.current?.value || '',
          gender: parseInt(genderInputRef.current?.value || ''),
          accepted: acceptedInputRef.current?.checked,
          picture: imageInputRef.current?.files || '',
          country: countryInputRef.current?.value || '',
        },
        {
          abortEarly: false,
          strict: true,
        }
      );
      dispatcher(
        setFormCallback({
          ...validationResult,
          picture: await converterToBase64(validationResult.picture[0]),
        })
      );
      navigate('/');
    } catch (e) {
      if (e instanceof ValidationError) {
        e.inner.forEach((error) => {
          const refObject: RefObject<HTMLDivElement> =
            errorRefs[error.path || ''];
          const element = refObject.current;
          if (element == null) {
            return;
          }

          const errorText = error.errors.join(', ');
          element.innerHTML = errorText;
        });
      } else {
        throw e;
      }
    }
  }
  function onSubmit(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    checkInputAndSubmit();
  }

  return (
    <form>
      <div>
        <label>
          Name
          <input
            type={'text'}
            ref={firstNameInputRef}
            defaultValue={formStateSlice.firstName}
          />
          <div ref={firstNameErrorRef}></div>
        </label>
      </div>
      <div>
        <label>
          Age
          <input
            type={'number'}
            min={0}
            ref={ageInputRef}
            defaultValue={formStateSlice.age}
          />
        </label>
        <div ref={ageErrorRef}></div>
      </div>
      <div>
        <label>
          Email
          <input
            type={'email'}
            ref={emailInputRef}
            defaultValue={formStateSlice.email}
          />
        </label>
        <div ref={emailErrorRef}></div>
      </div>
      <div>
        <label>
          Password
          <input type={'text'} ref={passwordInputRef} />
          <div ref={passwordErrorRef}></div>
          <input
            type={'text'}
            defaultValue={''}
            ref={passwordApproveInputRef}
          />
          <div ref={passwordApproveErrorRef}></div>
        </label>
      </div>
      <div>
        <label>
          Picture
          <input
            type={'file'}
            accept={'image/jpeg,image/png'}
            multiple={false}
            ref={imageInputRef}
          />
          <div ref={imageErrorRef}></div>
        </label>
      </div>
      <div>
        <label>
          Gender
          <select defaultValue={formStateSlice.gender} ref={genderInputRef}>
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.OTHER}>Other</option>
          </select>
        </label>
        <div ref={genderErrorRef}></div>
      </div>
      <div>
        <label>
          Accept T&C
          <input
            type={'checkbox'}
            ref={acceptedInputRef}
            defaultChecked={formStateSlice.accepted}
          />
          <div ref={acceptedErrorRef}></div>
        </label>
      </div>
      <div>
        <label>
          Country
          <input
            type={'text'}
            ref={countryInputRef}
            defaultValue={formStateSlice.country}
            onInput={(e) => fillCountriesToAutocomplete(e.currentTarget.value)}
          />
          <div ref={countryErrorRef}></div>
          {...countriesToAutocomplete.map((country) => (
            <div key={country.code}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const countryInput = countryInputRef.current;
                  if (countryInput != null) {
                    countryInput.value = country.name;
                  }
                }}
              >
                {country.name}
              </button>
            </div>
          ))}
        </label>
      </div>
      <input type={'submit'} onClick={onSubmit} />
    </form>
  );
}

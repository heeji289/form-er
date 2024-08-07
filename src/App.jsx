import React from 'react';

function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched(
      Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    const errors = validate(values);
    setErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    onSubmit(values);
  };

  const getFieldProps = (name, options = {}) => {
    const { type = 'text', value: radioValue } = options;

    const baseProps = {
      name,
      onBlur: handleBlur,
      onChange: handleChange,
    };

    switch (type) {
      case 'checkbox':
        return {
          ...baseProps,
          type: 'checkbox',
          checked: !!values[name],
        };
      case 'radio':
        return {
          ...baseProps,
          type: 'radio',
          value: radioValue,
          checked: values[name] === radioValue,
        };
      default:
        return {
          ...baseProps,
          type,
          value: values[name],
        };
    }
  };

  const runValidator = React.useCallback(() => validate(values), [values]);

  React.useEffect(() => {
    const errors = runValidator();
    setErrors(errors);
  }, [runValidator]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    getFieldProps,
  };
}

export function App() {
  const { values, errors, touched, handleSubmit, getFieldProps } = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
      gender: '',
    },
    validate: (values) => {
      const errors = {};

      if (!values.email) {
        errors.email = '이메일을 입력해주세요.';
      }
      if (!values.password) {
        errors.password = '비밀번호를 입력해주세요.';
      }
      if (!values.gender) {
        errors.gender = '성별을 선택해주세요.';
      }

      return errors;
    },
    onSubmit: (values) => {
      console.log('제출!', values);
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <input {...getFieldProps('email', { type: 'email' })} />
      {touched.email && errors.email && <span>{errors.email}</span>}

      <input {...getFieldProps('password', { type: 'password' })} />
      {touched.password && errors.password && <span>{errors.password}</span>}

      <label>
        <input {...getFieldProps('rememberMe', { type: 'checkbox' })} />
        Remember me
      </label>

      <div>
        <label>
          <input
            {...getFieldProps('gender', { type: 'radio', value: 'male' })}
          />
          남자
        </label>
        <label>
          <input
            {...getFieldProps('gender', { type: 'radio', value: 'female' })}
          />
          여자
        </label>
      </div>
      {touched.gender && errors.gender && <span>{errors.gender}</span>}

      <button type='submit'>Login</button>

      <pre>{JSON.stringify(values, null, 2)}</pre>
    </form>
  );
}

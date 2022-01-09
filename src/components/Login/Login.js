import React, { useEffect, useReducer, useContext } from 'react';

import AuthContext from '../../store/auth-context';

import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';

import classes from './Login.module.css';

const initialState = {
  email: '',
  password: '',
  emailIsValid: null,
  passwordIsValid: null,
  formIsValid: false,
};

const checkEmailValidity = email => email.includes('@');
const checkPasswordValidity = password => password.trim().length > 6;

const inputReducer = (state, action) => {
  if (action.type === 'EMAIL_INPUT') {
    return {
      ...state,
      email: action.val,
      emailIsValid: checkEmailValidity(action.val),
    };
  }

  if (action.type === 'PASSWORD_INPUT') {
    return {
      ...state,
      password: action.val,
      passwordIsValid: checkPasswordValidity(action.val),
    };
  }

  if (action.type === 'INPUT_BLUR') {
    return {
      ...state,
      emailIsValid: checkEmailValidity(state.email),
      passwordIsValid: checkPasswordValidity(state.password),
    };
  }

  if (action.type === 'CHECK_FORM') {
    return {
      ...state,
      formIsValid:
        action.payload.emailIsValid && action.payload.passwordIsValid,
    };
  }

  return initialState;
};

const Login = () => {
  const [inputState, dispatchInput] = useReducer(inputReducer, initialState);
  const { emailIsValid, passwordIsValid } = inputState;
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const identifier = setTimeout(() => {
      dispatchInput({
        type: 'CHECK_FORM',
        payload: { emailIsValid, passwordIsValid },
      });
    }, 500);
    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = event => {
    dispatchInput({ type: 'EMAIL_INPUT', val: event.target.value });
  };

  const passwordChangeHandler = event => {
    dispatchInput({ type: 'PASSWORD_INPUT', val: event.target.value });
  };

  const validateEmailHandler = () => {
    dispatchInput({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchInput({ type: 'INPUT_BLUR' });
  };

  const submitHandler = event => {
    event.preventDefault();
    authCtx.onLogin(inputState.email, inputState.password);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          label="E-mail"
          id="email"
          type="email"
          isValid={inputState.emailIsValid}
          value={inputState.email}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          label="Password"
          id="password"
          type="password"
          isValid={inputState.passwordIsValid}
          value={inputState.password}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />

        <div className={classes.actions}>
          <Button
            type="submit"
            className={classes.btn}
            disabled={!inputState.formIsValid}
          >
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;

// This file controls the behaviour for the Signup Form (Located at '/signup')

import * as yup from 'yup';

export const defaultValues = {
  email: '',
  password: '',
  avatar: '',
};

//This Schema Controls the validation for the form.
export const validation = yup.object({
  email: yup.string().required('An email is required.'),
  password: yup
    .string()
    .required('A password is required.')
    .min(6, 'Must be at least 6 characters long.'),
  passwordConf: yup
    .string()
    .required('A password is required.')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

/* 
This Schema controls the amount of fields and their parameters.

Available Parameters:
    type= String {default:'text'} 
    available:
      input:[text,number,email,password,file]
      select,
      switch,
      checkbox,
      radio,
      textarea

    name= String {default:null} **Required**

    label= String {default:{name}}

    options={options} Array {default: []} **Only required if using [type:select] ** | **This is set while mounting the form**

    isMulti= Boolean {default: false} **Only required if using [type:select] **

    placeholder= String {default: null}

    text= String {default: null} 

    prepend= String {default: null}

    append= String {default: null}

*/
export const fields = [
  {
    name: 'email',
    label: 'Email Address',
    placeholder: 'Email Address',
    text: 'Your University-provided email address',
    append: '@bangor.ac.uk',
    autoComplete: 'off',
  },
  {
    name: 'email',
    label: 'none',
    disabled: true,
    placeholder: 'Display Name',
    text: 'Display Name: same as the email address',
    autoComplete: 'off',
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    placeholder: 'Password',
  },
  {
    type: 'password',
    name: 'passwordConf',
    label: 'none',
    placeholder: 'Retype Password',
    text: "Make sure it's unique and secure.",
  },
  { type: 'file', name: 'thumbnail', label: 'Avatar (Max 500kb)' },
];

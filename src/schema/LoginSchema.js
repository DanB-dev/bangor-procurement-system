// This file controls the behaviour for the Signup Form (Located at '/signup')

import * as yup from 'yup';

export const defaultValues = {
  email: '',
  password: '',
};

//This Schema Controls the validation for the form.
export const validation = yup.object({
  email: yup.string().required('An email is required.'),
  password: yup.string().required('A password is required.'),
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
    label: 'none',
    placeholder: 'Email Address',
    text: 'Your University-provided email address',
    append: '@bangor.ac.uk',
    autoComplete: 'off',
  },
  {
    type: 'password',
    name: 'password',
    label: 'none',
    placeholder: 'Password',
  },
];

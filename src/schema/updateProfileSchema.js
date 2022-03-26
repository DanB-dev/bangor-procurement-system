// This file controls the behavior for the Signup Form (Located at '/signup')

import * as yup from 'yup';

//This Schema Controls the validation for the form.
export const validation = yup.object().shape(
  {
    role: yup.object().required('all users need at least one role.'),
    telNo: yup
      .string()
      .nullable()
      .notRequired()
      .when('telNo', {
        is: (value) => value?.length,
        then: (rule) =>
          rule
            .matches(/^[0-9]*$/, 'Only numbers are allowed.')
            .min(11, 'Must be at least 11 numbers.')
            .max(11, 'Must be at most 11 numbers.'),
      }),
  },
  [
    // Add Cyclic deps here because when require itself
    ['telNo', 'telNo'],
  ]
);

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
    name: 'telNo',
    label: 'none',
    placeholder: 'Tel No.',
    prepend: 'Telephone Number',
    autoComplete: 'off',
  },
  {
    name: 'roomNo',
    label: 'none',
    placeholder: 'Room No.',
    prepend: 'Room Number',
    autoComplete: 'off',
  },
];

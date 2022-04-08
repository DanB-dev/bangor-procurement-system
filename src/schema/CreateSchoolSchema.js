// This file controls the behaviour for the Create Budget Form (Located at '/budgets')

import * as yup from 'yup';

//This Schema Controls the initial Values for the form. this is required to ensure the components are controlled from mount.
export const defaultValues = {
  name: '',
  code: '',
  reqOfficer: '',
};

//This Schema Controls the validation for the form.
export const validation = yup.object({
  name: yup.string().required('A school name is required.'),
  code: yup.string().required('A code is required.'),
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
    name: 'name',
    label: 'School Name',
    placeholder: 'School Name',
    text: 'A human-readable name for the school.',
  },
  {
    name: 'code',
    label: 'School Code',
    placeholder: 'csee',
  },
];

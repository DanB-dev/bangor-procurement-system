// This file controls the behaviour for the Create Budget Form (Located at '/budgets')

import * as yup from 'yup';

//This Schema Controls the initial Values for the form. this is required to ensure the components are controlled from mount.
export const defaultValues = {
  name: '',
  code: '',
  holders: [],
};

//This Schema Controls the validation for the form.
export const validation = yup.object({
  name: yup.string().required('A budget name is required.'),
  code: yup
    .string()
    .required('A code is required.')
    .min(9, 'Min length is 9 characters.')
    .max(9, 'Max length is 9 characters.')
    .matches(
      /^[A-Z]{2}[-]\d{6}$/,
      'The format is wrong | example: "RT-596878"'
    ),
  holders: yup
    .array()
    .required()
    .min(1, 'You need at least one budget holder.'),
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
    label: 'Budget Name',
    placeholder: 'Budget Name',
    text: 'A human-readable name for the budget.',
  },
  {
    name: 'code',
    label: 'Budget Code',
    placeholder: 'BC-203958',
  },
  {
    type: 'select',
    name: 'holders',
    label: 'Budget Holder(s)',
    options: [],
    isMulti: true,
  },
];

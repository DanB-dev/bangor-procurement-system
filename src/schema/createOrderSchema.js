// This file controls the behavior for the Create Order Form (Located at '/createOrder')

import * as yup from 'yup';

//This Schema Controls the validation for the form.
export const validation = yup.object({
  item: yup.array().of(
    yup.object().shape(
      {
        name: yup.string().required('Add the item name.'),
        description: yup.string().required('Add a product description.'),
        quantity: yup.string().required('Add a quantity.'),
        cost: yup
          .string()
          .required('Must be at least 0 (free).')
          .when('cost', {
            is: (value) => value?.length,
            then: (rule) =>
              rule.matches(
                /^\d+(?:\.\d{1,2})?$/,
                'Too many decimal places; maximum is two (2).'
              ),
          }),
      },
      [
        // Add Cyclic deps here because when require itself
        ['cost', 'cost'],
      ]
    )
  ),
});

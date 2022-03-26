//Form Requirements
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//Custom Hooks
import { useTheme } from '../../hooks/useTheme';

//Components
import { Alert, Button, Form } from 'react-bootstrap';
import { FormGroup } from '../../components/form/FormGroup';

export const AuthenticationForm = ({
  onSubmit,
  validation,
  defaultValues,
  fields,
  isPending,
  error,
  type,
}) => {
  const { mode } = useTheme();

  // Import the form functions from the UseForm Hook.
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange', // Validate the file on each change to the input (default: onSubmit).
    resolver: yupResolver(validation), // This resolver is used to validate our form values.
  });

  return (
    <Form
      className={`auth-form ${mode} text-center`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="mb-3">{type === 'signup' ? 'Sign-up' : 'Login'}</h2>
      {error && <Alert variant={'danger'}>{error}</Alert>}

      {fields.map((f) => (
        <FormGroup
          {...f}
          key={f.name + '_' + f.placeholder + '_' + f.type} // This is to ensure the key is always unique.
          errors={errors}
          dirtyFields={dirtyFields}
          control={control}
          showValid="false"
        />
      ))}

      <hr />
      {!isPending && (
        <Button variant="outline-primary" className="w-100" type="submit">
          {type === 'signup' ? 'Sign Up' : 'Login'}
        </Button>
      )}
      {isPending && (
        <Button variant="outline-primary" className="w-100" disabled>
          {type === 'signup' ? 'signing up...' : 'logging in...'}
        </Button>
      )}
    </Form>
  );
};

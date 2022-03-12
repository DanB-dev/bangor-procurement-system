//General
import { AuthenticationForm } from './AuthenticationForm';

//Authentication
import { useSignup } from '../../hooks/useSignup';
import { defaultValues, validation, fields } from '../../schema/SignupSchema';

export const Signup = () => {
  const { signup, isPending, error } = useSignup();

  const onSubmit = ({ email, password, thumbnail }) => {
    signup(email, email + '@bangor.ac.uk', password, thumbnail);
  };

  return (
    <AuthenticationForm
      type="signup"
      onSubmit={onSubmit}
      validation={validation}
      defaultValues={defaultValues}
      fields={fields}
      isPending={isPending}
      error={error}
    />
  );
};

//General
import { AuthenticationForm } from './AuthenticationForm';

//Authentication
import { useSignup } from '../../hooks/useSignup';
import { defaultValues, validation, fields } from '../../schema/SignupSchema';

const Signup = () => {
  const { signup, isPending, error } = useSignup();

  const onSubmit = ({ email, password }, e) => {
    let thumbnail = e.target.thumbnail.files[0];
    signup(email, email + '@bangor.ac.uk', password, thumbnail);
    console.log(thumbnail);
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
export default Signup;

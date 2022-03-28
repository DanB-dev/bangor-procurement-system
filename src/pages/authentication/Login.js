//General Component
import { AuthenticationForm } from './AuthenticationForm';

//Specific to Login
import { useLogin } from '../../hooks/useLogin';
import { defaultValues, validation, fields } from '../../schema/LoginSchema';

const Login = () => {
  const { login, isPending, error } = useLogin();

  const onSubmit = ({ email, password }) => {
    login(email + '@bangor.ac.uk', password);
  };

  return (
    <AuthenticationForm
      type="login"
      onSubmit={onSubmit}
      validation={validation}
      defaultValues={defaultValues}
      fields={fields}
      isPending={isPending}
      error={error}
    />
  );
};
export default Login;

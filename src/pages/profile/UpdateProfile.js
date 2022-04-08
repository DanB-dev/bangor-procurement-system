//Form Requirements
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//Components
import { Button, Card, Form } from 'react-bootstrap';
import { FormGroup } from '../../components/form/FormGroup';
import { useAuthContext } from '../../hooks/useAuthContext';

const roles = {
  type: 'select',
  name: 'role',
  label: 'none',
  options: [
    { value: 'User', label: 'User' },
    { value: 'Budget Holder', label: 'Budget Holder' },
    { value: 'Finance Officer', label: 'Finance Officer' },
    {
      value: 'School Requisitions Officer',
      label: 'School Requisitions Officer',
    },
    { value: 'Admin', label: 'Admin' },
  ],
};

export const UpdateProfile = ({ mUser, validation, fields, onSubmit }) => {
  const { user } = useAuthContext();
  const defaultValues = {
    telNo: mUser.telNo || '',
    roomNo: mUser.roomNo || '',
    role: { value: mUser.role, label: mUser.role } || '',
  };

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
    <Card className="mb-3 h-100">
      <Card.Body>
        <Card.Title className="text-center mb-2">
          Update Account Details
        </Card.Title>

        <Form className="w-50 mx-auto" onSubmit={handleSubmit(onSubmit)}>
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
          {user.role === 'Admin' && user.uid !== mUser.uid && (
            <FormGroup
              {...roles}
              key={roles.name + '_' + roles.placeholder + '_' + roles.type} // This is to ensure the key is always unique.
              errors={errors}
              dirtyFields={dirtyFields}
              control={control}
              showValid="false"
            />
          )}
        </Form>
      </Card.Body>
      <Card.Footer className="text-center">
        <Button size="sm" type="submit" onClick={handleSubmit(onSubmit)}>
          Update
        </Button>
      </Card.Footer>
    </Card>
  );
};

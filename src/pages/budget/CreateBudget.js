//General
import { useEffect, useRef, useState } from 'react';

//Form Requirements
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  defaultValues,
  validation,
  fields,
} from '../../schema/CreateBudgetSchema';

//Custom Hooks
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';

//Components
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { FormGroup } from '../../components/form/FormGroup';
import { toast } from 'react-toastify';
import Select from 'react-select';

const CreateBudget = () => {
  const [users, usersError] = useCollection('users');
  const [schools, schoolError] = useCollection('schools');
  const [addBudget, , , budgetResponse] = useFirestore('budgets'); // Access the addDocument function in the firestore Hook.
  const [_addEvent, , ,] = useFirestore('events');
  const addEventReference = useRef(_addEvent);
  const addEvent = addEventReference.current;
  const [usersOptions, setUsersOptions] = useState(null);
  const [schoolOptions, setSchoolOptions] = useState(null);

  const {
    user: { displayName, photoURL, uid, role },
  } = useAuthContext();

  const [isPending, setIsPending] = useState(false);

  // Import the form function from the UseForm Hook.
  const {
    reset,
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'onChange', // Validate the file on each change to the input (default: onSubmit).
    resolver: yupResolver(validation), // This resolver is used to validate our form values.
  });
  // Get all the users that are eligible to be added to the budget.
  useEffect(() => {
    if (users) {
      const options = [];
      users.forEach((u) => {
        if (u.role === 'Budget Holder' || u.role === 'Admin')
          options.push({ value: u, label: u.displayName + ' - ' + u.role });
      });
      setUsersOptions(options);
    }
  }, [users]);

  // Get all the schools.
  useEffect(() => {
    if (schools) {
      const options = [];
      schools.forEach((s) => {
        options.push({ value: s, label: s.code + ' - ' + s.name });
      });
      setSchoolOptions(options);
    }
  }, [schools]);

  //Handling form submissions. All errors are handled by the Yup Resolver before this is triggered.
  const onSubmit = async ({ name, code, holders, school }) => {
    toast.promise(
      addBudget(
        {
          name,
          code,
          createdBy: {
            displayName,
            photoURL,
            uid,
          },
          school: {
            code: school.value.code,
            name: school.value.name,
            id: school.value.id,
          },
          holders: [
            ...holders.map(({ value: { displayName, id, photoURL } }) => {
              return {
                displayName,
                photoURL,
                id,
              };
            }),
          ],
        },
        ['code', '==', code]
      ),
      {
        pending: {
          render() {
            setIsPending(true);
            return 'Creating...';
          },
        },
        success: {
          render() {
            setIsPending(false);
            return (
              <div>
                Budget <span className="fw-bold">{name}</span> Created!
              </div>
            );
          },
        },
        error: {
          render({ data }) {
            setIsPending(false);
            return `${data}`;
          },
        },
      }
    );
    reset(defaultValues);
  };

  useEffect(() => {
    if (budgetResponse.success) {
      toast.promise(
        addEvent({
          type: 'budget',
          event: 'created',
          by: { displayName, uid, photoURL, role },
          budgetId: budgetResponse.id,
        }),
        {
          pending: {
            render() {
              return 'Logging...';
            },
          },
          success: {
            type: 'info',
            render() {
              return `Logged Creation `;
            },
          },
          error: {
            render() {
              return 'Error Logging Request!';
            },
          },
        }
      );
    }
  }, [
    displayName,
    uid,
    photoURL,
    role,
    budgetResponse.success,
    budgetResponse.id,
    addEvent,
    reset,
  ]);

  return (
    <Card>
      <Card.Header className="text-center bg-primary text-white" as="h5">
        Create a new Budget
      </Card.Header>
      <Card.Body>
        {usersError && <Alert variant={'danger'}>{usersError}</Alert>}
        {schoolError && <Alert variant={'danger'}>{schoolError}</Alert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((f) => (
            <FormGroup
              {...f}
              key={f.name}
              errors={errors}
              dirtyFields={dirtyFields}
              control={control}
            />
          ))}
          {/* Rendering this manually to allow us to dynamically update the options.  */}
          <Form.Group className="mb-3">
            <Form.Label>School</Form.Label>
            <Controller
              control={control}
              name="school"
              render={({ field }) => (
                <Select
                  {...field}
                  options={schoolOptions}
                  theme={(theme) => ({
                    ...theme,
                    borderColor:
                      errors.code || dirtyFields.code
                        ? !errors.code
                          ? '#198754'
                          : '#dc3545'
                        : control.borderColor,
                    colors: {
                      ...theme.colors,
                      primary25: '#e2d0d2',
                      primary50: '#f5f0f0',
                      primary: '#b82234',
                    },
                  })}
                />
              )}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Budget Holder(s)</Form.Label>
            <Controller
              control={control}
              name="holders"
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={usersOptions}
                  theme={(theme) => ({
                    ...theme,
                    borderColor:
                      errors.code || dirtyFields.code
                        ? !errors.code
                          ? '#198754'
                          : '#dc3545'
                        : control.borderColor,
                    colors: {
                      ...theme.colors,
                      primary25: '#e2d0d2',
                      primary50: '#f5f0f0',
                      primary: '#b82234',
                    },
                  })}
                />
              )}
            />
          </Form.Group>

          {!isPending && (
            <Button variant="outline-primary" className="w-100" type="submit">
              Create Budget
            </Button>
          )}
          {isPending && (
            <Button variant="outline-primary" className="w-100" disabled>
              Creating Budget...
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateBudget;

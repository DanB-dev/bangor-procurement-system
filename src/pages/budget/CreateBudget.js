//General
import { useEffect, useRef } from 'react';

//Form Requirements
import { useForm } from 'react-hook-form';
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

const CreateBudget = () => {
  const { documents, error } = useCollection('users');
  const [addBudget, , , _budgetResponse] = useFirestore('budgets'); // Access the addDocument function in the firestore Hook.
  const budgetResponse = useRef(_budgetResponse).current;
  const [addEvent, , , eventResponse] = useFirestore('events');
  const {
    user: { displayName, photoURL, uid, role },
  } = useAuthContext();

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
    if (documents) {
      const options = [];
      documents.forEach((u) => {
        options.push({ value: u, label: u.displayName });
      });
      fields.find((e) => e['type'] === 'select').options = options;
    }
  }, [documents]);

  // If the budget form is submitted, log the event.
  useEffect(() => {
    const submitter = () => {
      if (budgetResponse.success) {
        addEvent({
          type: 'budget',
          event: 'created',
          by: { displayName, uid, photoURL, role },
          budgetId: budgetResponse.id,
        });
        reset(defaultValues);
      }
    };
    submitter();
  }, [
    addEvent,
    budgetResponse.id,
    budgetResponse.success,
    displayName,
    photoURL,
    role,
    uid,
    reset,
  ]);
  //Handling form submissions. All errors are handled by the Yup Resolver before this is triggered.
  const onSubmit = async ({ name, code, holders, budget }) => {
    await addBudget(
      {
        name,
        code,
        status: 'active',
        createdBy: {
          displayName,
          photoURL,
          uid,
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
    );
  };

  return (
    <Card>
      <Card.Header className="text-center bg-primary text-white" as="h5">
        Create a new Budget
      </Card.Header>
      <Card.Body>
        {_budgetResponse.error && (
          <Alert variant={'danger'}>{_budgetResponse.error}</Alert>
        )}
        {eventResponse.error && (
          <Alert variant={'danger'}>{eventResponse.error}</Alert>
        )}
        {error && <Alert variant={'danger'}>{error}</Alert>}

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
          {!budgetResponse.isPending && (
            <Button variant="outline-primary" className="w-100" type="submit">
              Create Budget
            </Button>
          )}
          {budgetResponse.isPending && (
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

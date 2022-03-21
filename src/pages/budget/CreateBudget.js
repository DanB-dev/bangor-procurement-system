//General
import { useEffect, useRef, useState } from 'react';

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
import { toast } from 'react-toastify';

const CreateBudget = () => {
  const { documents, error } = useCollection('users');
  const [addBudget, , , budgetResponse] = useFirestore('budgets'); // Access the addDocument function in the firestore Hook.
  const [_addEvent, , ,] = useFirestore('events');
  const addEventReference = useRef(_addEvent);
  const addEvent = addEventReference.current;

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
    if (documents) {
      const options = [];
      documents.forEach((u) => {
        options.push({ value: u, label: u.displayName });
      });
      fields.find((e) => e['type'] === 'select').options = options;
    }
  }, [documents]);

  //Handling form submissions. All errors are handled by the Yup Resolver before this is triggered.
  const onSubmit = async ({ name, code, holders }) => {
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

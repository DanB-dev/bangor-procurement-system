import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FormGroup } from '../../components/form/FormGroup';
import {
  defaultValues,
  fields,
  validation,
} from '../../schema/CreateSchoolSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import Select from 'react-select';
import { useCollection } from '../../hooks/useCollection';
import { Alert } from 'bootstrap';

const CreateSchool = () => {
  const [documents, error] = useCollection('users');
  const [isPending, setIsPending] = useState(false);
  const [addSchool, , , schoolResponse] = useFirestore('schools'); // Access the addDocument function in the firestore Hook.
  const [, , updateUser] = useFirestore('users');
  const [_addEvent, , ,] = useFirestore('events');
  const addEventReference = useRef(_addEvent);
  const addEvent = addEventReference.current;
  const [options, setOptions] = useState(null);
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
        if (!u.assignedToSchool && u.role === 'School Requisitions Officer')
          options.push({ value: u, label: u.displayName + ' - ' + u.role });
      });
      setOptions(options);
    }
  }, [documents]);

  const onSubmit = async ({ name, code, reqOfficer }) => {
    toast.promise(
      addSchool(
        {
          name,
          code,
          email: code.toLowerCase(),
          telNo: '',
          createdBy: {
            displayName,
            photoURL,
            uid,
          },
          reqOfficer: {
            displayName: reqOfficer.value.displayName,
            photoURL: reqOfficer.value.photoURL,
            uid: reqOfficer.value.uid,
          },
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
            updateUser(reqOfficer.value.uid, { assignedToSchool: true });
            setIsPending(false);
            return (
              <div>
                School <span className="fw-bold">{name}</span> Created!
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
    if (schoolResponse.success) {
      toast.promise(
        addEvent({
          type: 'school',
          event: 'created',
          by: { displayName, uid, photoURL, role },
          budgetId: schoolResponse.id,
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
              return `Logged Creation`;
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
    schoolResponse.success,
    schoolResponse.id,
    addEvent,
    reset,
  ]);

  return (
    <Card>
      <Card.Header className="text-center bg-primary text-white" as="h5">
        Create a new School
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
          {/* Rendering this manually to allow us to dynamically update the options.  */}
          <Form.Group className="mb-3">
            <Form.Label>School Requisitions Officer</Form.Label>
            <Controller
              control={control}
              name="reqOfficer"
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
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
              Create School
            </Button>
          )}
          {isPending && (
            <Button variant="outline-primary" className="w-100" disabled>
              Creating School...
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateSchool;

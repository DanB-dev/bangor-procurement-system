// General Imports
import React, { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { yupResolver } from '@hookform/resolvers/yup';
import { validation } from '../../schema/createOrderSchema';

// Custom Hooks
import { useCollection } from '../../hooks/useCollection';
import { useDocument } from '../../hooks/useDocument';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';

// Components
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Select from 'react-select';
import { Link, useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';

//Creating the default form values. can also be used to reset the form. (Created outside of the component to prevent unnecessary re-renders.)
const defaultValues = {
  code: '',
  recurring: false,
  item: [{ name: '', description: '', quantity: '1', cost: '0' }],
  total: '0',
};

// Error height
const errorHeight = '70px';

const CreateOrder = () => {
  const {
    user: { uid, displayName, photoURL, role },
  } = useAuthContext();
  const history = useHistory();
  const { id } = useParams();
  const [documents, error] = useCollection('budgets'); // Fetches all documents
  const { document } = useDocument('savedOrders', id);

  const [addOrder, , ,] = useFirestore('orders'); // Access the addDocument function in the firestore Hook.
  const [addSavedOrder, , ,] = useFirestore('savedOrders'); // Access the addDocument function in the firestore Hook.
  const [_addEvent, , ,] = useFirestore('events');
  const addEventReference = useRef(_addEvent);
  const addEvent = addEventReference.current;
  const [codes, setCodes] = useState([]);

  //Fetching all the functions we'll need to control the form.
  const {
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors, dirtyFields },
    control,
    watch,
  } = useForm({
    defaultValues,
    mode: 'onChange', // This will trigger validation every time an input updates.
    resolver: yupResolver(validation),
  });

  useEffect(() => {
    if (document !== null) {
      reset({
        code: {
          value: {
            code: document.budget.budgetCode,
            id: document.budget.budgetId,
            name: document.budget.budgetName,
          },
          label:
            document.budget.budgetCode + ' - ' + document.budget.budgetName,
        },
        recurring: true,
        item: document.items,
      });
    }
  }, [document, reset]);

  //Specifying which fields to watch.
  const [item, code] = watch(['item', 'code']); // this is the name of the fields to watch.

  //Setting up dynamic fields for the items. Allows us to have as many fields as the user needs.
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'item',
    keyName: 'ikey',
  });

  //Fetch all the budgets available. Will re-run on every change to the document state.
  useEffect(() => {
    if (documents) {
      const options = [];
      documents.forEach((o) => {
        options.push({
          value: { id: o.id, code: o.code, name: o.name }, //The document object has all information about the budget, so we limit the data to what we need.
          label: o.code + ' - ' + o.name, // Give it a nice label.
        });
      });
      setCodes(options);
    }
  }, [documents]);

  //Creating Watchers to display helper info for the user.
  let budget = null;
  if (code) {
    budget = true;
  }

  // Getting the totals for each item and appending them to the order total.
  let total = null;
  if (item) {
    item.forEach((itemw) => {
      if (itemw.cost && itemw.quantity) {
        total += Number(itemw.cost) * Number(itemw.quantity);
      }
    });
    setValue('total', total);
  }

  //Submitting the form (Pre-validated by it's wrapper function.)
  const onSubmit = async ({
    code: {
      value: { code: budgetCode, id: budgetId, name: budgetName },
    },
    recurring,
    item,
    total,
  }) => {
    toast.promise(
      //Wrapping the addOrder in a promise. Let's us show the user the status of the request
      addOrder({
        status: 'orderPlaced',
        budget: {
          budgetId,
          budgetCode,
          budgetName,
        },
        items: [...item],
        total,
        createdBy: {
          displayName,
          photoURL,
          uid,
        },
      }),
      {
        pending: {
          render() {
            return 'Creating Order...';
          },
        },
        success: {
          //If successful, also generate an event log.
          render({ data }) {
            toast.promise(
              //Again wrapping in a promise to keep track of the status.
              addEvent({
                type: 'order',
                event: 'placed',
                by: { displayName, uid, photoURL, role },
                orderId: data.payload,
                budgetId: data.doc.budget.budgetId,
              }),
              {
                pending: {
                  render() {
                    return 'Logging Order...';
                  },
                },
                success: {
                  type: 'info',
                  render() {
                    history.push('/orders');
                    return 'Order Logged.';
                  },
                },
                error: {
                  render({ data }) {
                    return 'Logging:' + data;
                  },
                },
              }
            );
            return 'Order Created!';
          },
        },
        error: {
          render({ data }) {
            return 'Placing:' + data;
          },
        },
      }
    );

    // If the user wants to save the order, then we save it separately.
    if (recurring) {
      toast.promise(
        addSavedOrder({
          budget: {
            budgetId,
            budgetCode,
            budgetName,
          },
          items: [...item],
          total,
          createdBy: {
            displayName,
            photoURL,
            uid,
          },
        }),
        {
          pending: {
            render() {
              return 'Saving...';
            },
          },
          success: {
            render() {
              return 'Saved Order!';
            },
          },
          error: {
            render({ data }) {
              return 'Saving -' + data;
            },
          },
        }
      );
    }
  };

  return (
    <Container fluid>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Header className="text-center bg-primary text-white" as="h5">
          {document === null ? 'Create Order' : 'Edit Saved Order'}
        </Card.Header>

        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Budget Code</Form.Label>
                  <Controller
                    name="code"
                    control={control}
                    rules={{ required: true, min: 1 }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={codes}
                        styles={{
                          control: (control) => ({
                            ...control,
                            borderColor:
                              errors.code || dirtyFields.code
                                ? !errors.code
                                  ? '#198754'
                                  : '#dc3545'
                                : control.borderColor,
                          }),
                        }}
                        className="is-valid"
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col className="border-start">
                {document === null && (
                  <Form.Group className="mb-3">
                    <Controller
                      name="recurring"
                      control={control}
                      render={({ field }) => (
                        <Form.Switch
                          label="Save Order?"
                          {...field}
                          disabled={!budget}
                        />
                      )}
                    />
                    <small className="text-muted">
                      Saved orders will be available for re-order on the{' '}
                      <Link to="/savedOrders">Saved Orders Panel</Link>
                    </small>
                  </Form.Group>
                )}
              </Col>
            </Row>
            <hr />
            {!budget && (
              <Container className="w-50 text-center">
                <Alert variant="warning">
                  Please Select a budget above before adding items.
                </Alert>
              </Container>
            )}

            <Row
              className="text-muted py-3 border rounded"
              style={{ maxHeight: '400px', overflowY: 'scroll' }}
            >
              <Col lg={2}>
                <Form.Group
                  className="mb-3 d-flex h-100 pb-2"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Form.Label>Item Name</Form.Label>
                  <Form.Text className="text-muted">Name as sold.</Form.Text>

                  {fields.map((field, index) => (
                    <div
                      key={field.ikey}
                      className="mb-1"
                      style={{
                        height: errors?.item?.[index] ? errorHeight : 'initial',
                      }}
                    >
                      <Controller
                        name={`item.${index}.name`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            isInvalid={errors?.item?.[index]?.name}
                            placeholder="Item Name..."
                            autoComplete="off"
                            errors={errors}
                            disabled={!budget}
                          />
                        )}
                      />
                      {errors?.item?.[index]?.name && (
                        <Form.Text style={{ color: '#dc3545' }}>
                          {errors?.item?.[index]?.name.message}
                        </Form.Text>
                      )}
                    </div>
                  ))}
                </Form.Group>
              </Col>

              <Col lg={5}>
                <Form.Group
                  className="mb-3 d-flex h-100 pb-2"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Text className="text-muted">
                    A description of the item.
                  </Form.Text>

                  {fields.map((field, index) => (
                    <div
                      className="mb-1"
                      style={{
                        height: errors?.item?.[index] ? errorHeight : 'initial',
                      }}
                    >
                      <Controller
                        key={field.ikey}
                        name={`item[${index}].description`}
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            isInvalid={errors?.item?.[index]?.description}
                            placeholder="Item description..."
                            autoComplete="off"
                            errors={errors}
                            disabled={!budget}
                          />
                        )}
                      />
                      {errors?.item?.[index]?.description && (
                        <Form.Text style={{ color: '#dc3545' }}>
                          {errors?.item?.[index]?.description.message}
                        </Form.Text>
                      )}
                    </div>
                  ))}
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group
                  className="mb-3 d-flex h-100 pb-2"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Form.Label>Quantity</Form.Label>
                  <Form.Text className="text-muted">
                    Quantity to order.
                  </Form.Text>

                  {fields.map((field, index) => (
                    <div
                      className="mb-1"
                      style={{
                        height: errors?.item?.[index] ? errorHeight : 'initial',
                      }}
                    >
                      <Controller
                        key={field.ikey}
                        name={`item.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
                            isInvalid={errors?.item?.[index]?.quantity}
                            type="number"
                            placeholder="Quantity"
                            autoComplete="off"
                            min={1}
                            disabled={!budget}
                          />
                        )}
                      />
                      {errors?.item?.[index]?.quantity && (
                        <Form.Text style={{ color: '#dc3545' }}>
                          {errors?.item?.[index]?.quantity.message}
                        </Form.Text>
                      )}
                    </div>
                  ))}
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group
                  className="mb-3 d-flex h-100 pb-2"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Form.Label>Est. Cost</Form.Label>

                  <Form.Text className="text-muted">
                    The estimated cost per item.
                  </Form.Text>

                  {fields.map((field, index) => (
                    <div
                      className="mb-1"
                      style={{
                        height: errors?.item?.[index] ? errorHeight : 'initial',
                      }}
                    >
                      <InputGroup key={field.ikey}>
                        <InputGroup.Text>£</InputGroup.Text>
                        <Controller
                          name={`item.${index}.cost`}
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              {...field}
                              isInvalid={errors?.item?.[index]?.cost}
                              type="number"
                              disabled={!budget}
                            />
                          )}
                        />

                        <Button
                          disabled={index === 0 ? true : false}
                          variant="outline-primary"
                          onClick={() => (index === 0 ? null : remove(index))}
                        >
                          Delete Row
                        </Button>
                      </InputGroup>
                      {errors?.item?.[index]?.cost && (
                        <Form.Text style={{ color: '#dc3545' }}>
                          {errors?.item?.[index]?.cost.message}
                        </Form.Text>
                      )}
                    </div>
                  ))}
                </Form.Group>
              </Col>
            </Row>
            <Container className="w-25 m-0 mt-3 ms-auto d-flex flex-row align-items-center">
              <span className="me-2">Total:</span>
              <InputGroup>
                <InputGroup.Text>£</InputGroup.Text>
                <Form.Control
                  value={formatCurrency(getValues('total'))}
                  type="text"
                  disabled
                />
              </InputGroup>
            </Container>
            <Container className="text-center pt-2">
              {budget && (
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    append({
                      name: '',
                      description: '',
                      quantity: '1',
                      cost: '0',
                    });
                  }}
                >
                  Add order slot
                </Button>
              )}
              <br />
              <Button
                variant="primary"
                className="mt-4 w-25 m-auto"
                type="submit"
                disabled={!budget}
              >
                {document === null ? 'Submit Order' : 'Save Order'}
              </Button>
              <Button
                variant="secondary"
                className="mt-4 m-auto ms-1"
                disabled={!budget}
                onClick={() => reset(defaultValues)}
              >
                Clear Form
              </Button>
            </Container>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateOrder;

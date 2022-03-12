import React, { useEffect, useState } from 'react';
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

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Select from 'react-select';
import { useCollection } from '../../hooks/useCollection';
import { useHistory } from 'react-router-dom';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';

//Creating the default form values. can also be used to reset the form. (Created outside of the component to prevent unnecessary re-renders.)
const defaultValues = {
  code: '',
  recurring: false,
  buffer: false,
  item: [{ name: '', description: '', quantity: '', cost: '' }],
  total: '',
};

const CreateOrder = () => {
  const {
    user: { uid, displayName, photoURL, role },
  } = useAuthContext();

  const { documents, error } = useCollection('budgets'); // Fetches all documents
  const [addOrder, , , orderResponse] = useFirestore('orders'); // Access the addDocument function in the firestore Hook.
  const [addEvent, , , eventResponse] = useFirestore('events');
  const [codes, setCodes] = useState([]);
  const history = useHistory();

  //Fetching all the functions we'll need to control the form.
  const {
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, dirtyFields },
    control,
    watch,
  } = useForm({
    defaultValues,
    mode: 'onChange', // This will trigger validation every time an input updates.
  });

  //Specifying which fields to watch.
  const [item, code] = watch(['item', 'code']); // this is the name of the fields to watch.

  //Setting up dynamic fields for the items.
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
          value: { id: o.id, code: o.code, budget: o.budget }, //The document object has all information about the budget, so we limit the data to what we need.
          label: o.code + ' - ' + o.name, // Give it a nice label
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
  let total = null;
  if (item) {
    item.forEach((item) => {
      total = total + Number(item.cost) * Number(item.quantity);
    });

    setValue('total', total);
  }

  //Submitting the form (Pre-validated by it's wrapper function.)
  const onSubmit = async ({
    code: {
      value: { code: budgetCode, id: budgetId },
    },
    recurring,
    item,
    total,
  }) => {
    await addOrder({
      status: 'orderPlaced',
      budget: {
        budgetId,
        budgetCode,
      },
      recurring,
      items: [...item],
      total,
      createdBy: {
        displayName,
        photoURL,
        uid,
      },
    });
  };

  useEffect(() => {
    const submitter = async () => {
      if (orderResponse.success) {
        await addEvent({
          type: 'order',
          event: 'placed',
          by: { displayName, uid, photoURL, role },
          orderId: orderResponse.id,
        });
        history.push('/orders');
      }
    };
    submitter();
  }, [
    orderResponse.success,
    addEvent,
    displayName,
    history,
    orderResponse.id,
    photoURL,
    role,
    uid,
  ]);

  return (
    <Container fluid>
      {orderResponse.error && (
        <Alert variant="danger">{orderResponse.error}</Alert>
      )}
      {eventResponse.error && (
        <Alert variant="danger">{eventResponse.error}</Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Header className="text-center bg-primary text-white" as="h5">
          Create Order
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
                <Form.Group className="mb-3">
                  <Controller
                    name="recurring"
                    control={control}
                    render={({ field }) => (
                      <Form.Switch
                        label="Recurring Order?"
                        {...field}
                        disabled={!budget}
                      />
                    )}
                  />
                  <small className="text-muted">
                    Recurring orders will be available for re-order from the
                    budget panel or from your order history.
                  </small>
                </Form.Group>
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
                <Form.Group className="mb-3 d-flex h-100 pb-2">
                  <Form.Label>Item Name</Form.Label>
                  {errors.name ? (
                    <Form.Text style={{ color: '#dc3545' }}>
                      You need to enter something here.
                    </Form.Text>
                  ) : (
                    <Form.Text className="text-muted">Name as sold.</Form.Text>
                  )}

                  {fields.map((field, index) => (
                    <Controller
                      key={field.ikey}
                      name={`item.${index}.name`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          placeholder="Item Name..."
                          autoComplete="off"
                          disabled={!budget}
                        />
                      )}
                    />
                  ))}
                </Form.Group>
              </Col>
              <Col lg={5}>
                <Form.Group className="mb-3 d-flex h-100 pb-2">
                  <Form.Label>Description</Form.Label>

                  {errors.description ? (
                    <Form.Text style={{ color: '#dc3545' }}>
                      You need to enter something here.
                    </Form.Text>
                  ) : (
                    <Form.Text className="text-muted">
                      A description of the item.
                    </Form.Text>
                  )}
                  {fields.map((field, index) => (
                    <Controller
                      key={field.ikey}
                      name={`item[${index}].description`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          placeholder="Item description..."
                          autoComplete="off"
                          disabled={!budget}
                        />
                      )}
                    />
                  ))}
                </Form.Group>
              </Col>
              <Col lg={2}>
                <Form.Group className="mb-3 d-flex h-100 pb-2">
                  <Form.Label>Quantity</Form.Label>

                  {errors.item?.quantity ? (
                    <Form.Text style={{ color: '#dc3545' }}>
                      Must be at least 1
                    </Form.Text>
                  ) : (
                    <Form.Text className="text-muted">
                      Qauntity to order.
                    </Form.Text>
                  )}
                  {fields.map((field, index) => (
                    <Controller
                      key={field.ikey}
                      name={`item.${index}.quantity`}
                      control={control}
                      rules={{ required: true, min: 1 }}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Quantity"
                          autoComplete="off"
                          min={1}
                          disabled={!budget}
                        />
                      )}
                    />
                  ))}
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className="mb-3 d-flex h-100 pb-2">
                  <Form.Label>Est. Cost</Form.Label>

                  {errors.cost ? (
                    <Form.Text style={{ color: '#dc3545' }}>
                      {errors.cost?.type === 'required' && 'This is required.'}
                      {errors.cost?.type === 'max' &&
                        'The Est. Cost cannot be more than the remaining value of the budget'}
                      {errors.cost?.type === 'min' &&
                        'You have to set a minimum of £1 for a budget'}
                    </Form.Text>
                  ) : (
                    <Form.Text className="text-muted">
                      The estimated cost.
                    </Form.Text>
                  )}
                  {fields.map((field, index) => (
                    <InputGroup key={field.ikey}>
                      <InputGroup.Text>£</InputGroup.Text>
                      <Controller
                        name={`item.${index}.cost`}
                        control={control}
                        rules={{
                          required: true,
                          min: 1,
                        }}
                        render={({ field }) => (
                          <Form.Control
                            {...field}
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
                  ))}
                </Form.Group>
              </Col>
            </Row>
            <Container className="w-25 m-0 mt-3 ms-auto d-flex flex-row align-items-center">
              <span className="me-2">Total:</span>
              <InputGroup>
                <InputGroup.Text>£</InputGroup.Text>
                <Form.Control
                  value={getValues('total')}
                  type="number"
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
                      quantity: '',
                      cost: '',
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
                Submit Order
              </Button>
            </Container>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateOrder;

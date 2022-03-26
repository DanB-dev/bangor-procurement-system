import React, { useState } from 'react';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';

import OrderFilter from './OrderFilter';
import OrderTable from './OrderTable';

const Orders = () => {
  const { user } = useAuthContext();

  const { documents, error } = useCollection(
    'orders',
    user.role !== 'Admin' && ['createdBy.uid', '==', user.uid] //If the user is not an Admin, then only fetch orders that match their UID
  );
  const [currentFilter, setCurrentFilter] = useState('all');

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  //Filtering the orders using the current filter.
  const orders = documents
    ? documents.filter((document) => {
        switch (currentFilter) {
          case 'all':
            return true;
          case 'orderPlaced':
          case 'actionNeeded':
          case 'awaitingAuth':
          case 'ordered':
          case 'shipping':
          case 'complete':
            return document.status === currentFilter;
          default:
            return false;
        }
      })
    : null; //If there are no documents in that match set to null.

  const totalOrders = documents ? documents.length : 0;

  //Setting overview Numbers.
  const openOrders = documents
    ? documents.filter((document) => {
        return document.status !== 'complete';
      }).length
    : 0;

  const actionNeeded = documents
    ? documents.filter((document) => {
        return document.status === 'actionNeeded';
      }).length
    : 0;

  const awaitingAuth = documents
    ? documents.filter((document) => {
        return document.status === 'awaitingAuth';
      }).length
    : 0;

  return (
    <div>
      <h2 className="page-title">Orders</h2>
      {error && <Alert variant="danger">{error.message}</Alert>}
      <Row>
        <Col className="d-flex">
          <Card>
            <Card.Body>
              <Card.Title className="text-muted">Your Total Orders</Card.Title>
              <h3>{totalOrders}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex">
          <Card>
            <Card.Body>
              <Card.Title className="text-muted">Open Orders</Card.Title>
              <h3>{openOrders}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex">
          <Card>
            <Card.Body>
              <Card.Title className="text-muted">Action Needed</Card.Title>
              <h3>{actionNeeded}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col className="d-flex">
          <Card>
            <Card.Body>
              <Card.Title className="text-muted">
                Awaiting Finalization
              </Card.Title>
              <h3>{awaitingAuth}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Container>
        <OrderFilter
          currentFilter={currentFilter}
          changeFilter={changeFilter}
        />
        <OrderTable orders={orders} />
      </Container>
    </div>
  );
};

export default Orders;

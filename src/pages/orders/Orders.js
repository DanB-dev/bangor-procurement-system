// General Imports
import React, { useState } from 'react';

// Custom Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';

// Components
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import OrderFilter from './OrderFilter';
import OrderTable from './OrderTable';
import { useTranslation } from 'react-i18next';

const Orders = () => {
  const { user } = useAuthContext();
  const { t } = useTranslation('common');
  const [documents, error] = useCollection(
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
          case 'accepted':
          case 'actionNeeded':
          case 'authorised':
          case 'ordered':
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
        return document.status === 'accepted';
      }).length
    : 0;

  const awaitingAuth = documents
    ? documents.filter((document) => {
        return document.status === 'authorised';
      }).length
    : 0;

  // Defining an Array of our order cards. We can then map through a template for each rather than have each explicitly written.
  const orderCards = [
    { title: t('order.orderCard.total'), value: totalOrders },
    { title: t('order.orderCard.open'), value: openOrders },
    { title: t('order.orderCard.accepted'), value: actionNeeded },
    { title: t('order.orderCard.awaitingAuth'), value: awaitingAuth },
  ];
  return (
    <Container fluid>
      {user.role === 'Admin' && (
        <Alert variant="dark">
          <Alert.Heading>Admin View</Alert.Heading>
          <p>
            As an admin you are able to view all users' Orders. For a specific
            user's orders, head to their profile.
          </p>
        </Alert>
      )}
      <h2 className="page-title">{t('order.orders')}</h2>
      {error && <Alert variant="danger">{error.message}</Alert>}

      <Row>
        {/* Mapping through the array of order cards here. */}
        {orderCards.map(({ title, value }, i) => (
          <Col className="d-flex" key={i}>
            <Card>
              <Card.Body>
                <Card.Title className="text-muted">{title}</Card.Title>
                <h3>{value}</h3>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <OrderFilter currentFilter={currentFilter} changeFilter={changeFilter} />
      <OrderTable orders={orders} />
    </Container>
  );
};

export default Orders;

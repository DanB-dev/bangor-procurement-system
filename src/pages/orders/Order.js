// General Imports
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { formatCurrency, formatNumber } from '../../utils/formatters';

// Custom Hooks
import { useDocument } from '../../hooks/useDocument';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';

// Styling & Images
import ActivityTracker from '../../components/Activity/ActivityTracker';
import {
  Badge,
  Button,
  Col,
  Container,
  Row,
  Table,
  Alert,
} from 'react-bootstrap';

const Order = ({ orderId }) => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const { t } = useTranslation('common');
  const [items, setItems] = useState([]);
  const [activity, setActivity] = useState([]);

  const [documents] = useCollection('events', [
    'orderId',
    '==',
    orderId ? orderId : id,
  ]);

  const [document, error] = useDocument('orders', orderId ? orderId : id);

  useEffect(() => {
    if (documents) {
      const options = [];
      documents.forEach((document) => {
        options.push({
          uid: document.id,
          holder: document.holder,
          by: document.by,
          createdAt: document.createdAt,
          event: document.event,
          orderId: document.orderId,
        });
      });
      setActivity(options);
    }
  }, [setActivity, documents]);

  useEffect(() => {
    if (document) {
      const options = [];
      document.items.forEach(({ name, description, quantity, cost }) => {
        options.push({
          name,
          description,
          quantity,
          cost,
        });
      });
      setItems(options);
    }
  }, [document]);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  if (!document) {
    return <div className="loading">Loading...</div>;
  }

  const checkStatus = () => {
    switch (document.status) {
      case 'orderPlaced':
        return t('order.stat.orderPlaced');
      case 'approved':
        return t('order.stat.approved');
      default:
        return t('order.stat.unknown');
    }
  };

  return (
    <>
      <Container fluid>
        <h3>
          {t('order.header', {
            orderId: document.id,
            orderAmount: document.items.length,
          })}
          {(document.createdBy.uid === user.uid || user.role === 'Admin') && (
            <Button className="ms-3" size="sm">
              {t('order.cancel')}
            </Button>
          )}
        </h3>
        <Row className="mt-4">
          <Col md="9">
            <h4>
              <u>{t('order.requestHeader')}</u>
            </h4>
            <Table style={{ borderBottom: '1px solid black' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('order.table.name')}</th>
                  <th>{t('order.table.description')}</th>
                  <th>{t('order.table.cost')}</th>
                  <th>{t('order.table.quantity')}</th>
                  <th>{t('order.table.totalCost')}</th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ name, description, quantity, cost }, i) => (
                  <tr key={name + '_' + i}>
                    <td>{i + 1}</td>
                    <td>{name}</td>
                    <td>{description}</td>
                    <td>{formatCurrency(cost)}</td>
                    <td>{formatNumber(quantity)}</td>
                    <td>{formatCurrency(cost * quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <p className="text-end fw-bold me-3">
              {t('order.total')}: {formatCurrency(document.total)}
            </p>
          </Col>
          <Col md="3" style={{ borderLeft: '2px solid grey' }}>
            <Table className="w-100">
              <tbody>
                <tr>
                  <td>
                    <b>{t('order.created')}:</b>
                  </td>
                  <td>{format(document.createdAt.toDate(), 'MM/dd/yyyy')}</td>
                </tr>
                <tr>
                  <td>
                    <b>{t('order.requester')}:</b>
                  </td>
                  <td>{document.createdBy.displayName}</td>
                </tr>
                <tr>
                  <td>
                    <b>{t('order.status')}:</b>
                  </td>
                  <td>
                    <Badge bg="secondary">{checkStatus()}</Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <h6 className={`mt-3`}>Order Actions</h6>
        {(user.role === 'Admin' || user.role === 'Budget Holder') &&
          document.status === 'orderPlaced' && (
            <>
              <Button variant="success">Accept</Button>
              <Button variant="danger" className="mx-2">
                Deny
              </Button>
              <Button as={Link} to={`/createOrder/${document.id}`}>
                Edit
              </Button>
            </>
          )}
        <hr />
        <ActivityTracker activity={activity} />
      </Container>
    </>
  );
};

export default Order;

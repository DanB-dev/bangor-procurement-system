import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Row,
  Table,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';

const Order = ({ orderId }) => {
  const { id } = useParams();
  const { t } = useTranslation('common');
  const [data, setData] = useState([]);
  const { document, error } = useDocument('orders', orderId ? orderId : id);

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
      setData(options);
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
    <Container fluid>
      <h3>
        {t('order.header', {
          orderId: document.id,
          orderAmount: document.items.length,
        })}
        <Button className="ms-1" size="sm">
          {t('order.cancel')}?
        </Button>
      </h3>
      <hr />
      <Row>
        <Col md="9">
          <h4>{t('order.requestHeader')}</h4>
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
              {data.map(({ name, description, quantity, cost }, i) => (
                <tr key={i + name}>
                  <td>{i + 1}</td>
                  <td>{name}</td>
                  <td>{description}</td>
                  <td>
                    £
                    {parseFloat(cost).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>{parseInt(quantity).toLocaleString(undefined)}</td>
                  <td>
                    £
                    {parseFloat(cost * quantity).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <p className="text-end fw-bold me-3">
            {t('order.total')}: £
            {parseFloat(document.total).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
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
    </Container>
  );
};

export default Order;

import { useState } from 'react';
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Modal,
  Table,
} from 'react-bootstrap';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useCollection } from '../../../hooks/useCollection';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFirestore } from '../../../hooks/useFirestore';
import SavedOrder from '../../../assets/save_order.png';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

const SavedOrders = () => {
  const { user } = useAuthContext();
  const [show, setShow] = useState(false);
  const [, deleteOrder, ,] = useFirestore('savedOrders');
  const [orderId, setOrderId] = useState('');
  const { t } = useTranslation('common');
  const [documents, error] = useCollection(
    'savedOrders',
    user.role !== 'Admin' && ['createdBy.uid', '==', user.uid]
  );
  const [currentFilter] = useState('all');
  const orders = documents
    ? documents.filter(() => {
        switch (currentFilter) {
          case 'all':
            return true;
          default:
            return false;
        }
      })
    : null;

  const handleClose = () => {
    setShow(false);
  };

  const handleCancelOrder = (orderId) => {
    setShow(false);
    toast.promise(deleteOrder(orderId), {
      pending: {
        render() {
          return 'Deleting Saved Order...';
        },
      },
      success: {
        render() {
          return 'Saved Order Deleted!';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };

  return (
    <>
      <h2 className="page-title mb-2">Saved Orders</h2>
      {error && <Alert variant="danger">{error.message}</Alert>}
      {orders && orders.length > 0 ? (
        orders.map((order) => {
          return (
            <Card className="mb-3" key={order.id}>
              <Card.Body>
                <Card.Title>
                  <b>{order.budget.budgetCode}</b> - {order.id}
                </Card.Title>
                <Table>
                  <thead>
                    <tr>
                      <th className="col-md-1">#</th>
                      <th className="col-md-2">{t('order.table.name')}</th>
                      <th className="col-md-3">
                        {t('order.table.description')}
                      </th>
                      <th className="col-md-1">{t('order.table.cost')}</th>
                      <th className="col-md-1">{t('order.table.quantity')}</th>
                      <th className="col-md-1">{t('order.table.totalCost')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(
                      ({ name, description, quantity, cost }, i) => (
                        <tr key={i + name}>
                          <td>{i + 1}</td>
                          <td>{name}</td>
                          <td>{description}</td>
                          <td>{formatCurrency(cost)}</td>
                          <td>{formatNumber(quantity)}</td>
                          <td>{formatCurrency(cost * quantity)}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </Card.Body>
              <Card.Footer className="text-end">
                <ButtonGroup aria-label="Action Items" className="me-5">
                  <Button>Re-order</Button>
                  <Button as={Link} to={`createOrder/${order.id}`}>
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      setShow(true);
                      setOrderId(order.id);
                    }}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </Card.Footer>
            </Card>
          );
        })
      ) : (
        <Card className="w-50 m-auto text-center">
          <Card.Body>
            {t('savedOrders.header')}
            <br />
            <small className="text-muted">
              <em>{t('savedOrders.small')}</em>
            </small>
            <img
              src={SavedOrder}
              alt="save order example"
              style={{
                border: '2px solid lightgrey',
                borderRadius: '4px',
                width: '65%',
              }}
            />
            <br />
            <small className="text-muted">{t('savedOrders.caption')}</small>
          </Card.Body>
        </Card>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Saved Order?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            If you delete this saved order you will have to recreate the order
            to use again.
          </Alert>
          <Alert variant="info">
            This will <b>not</b> cancel any orders made using this template. To
            cancel active orders, go to your <Link to="/orders">Orders</Link>.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleCancelOrder(orderId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default SavedOrders;

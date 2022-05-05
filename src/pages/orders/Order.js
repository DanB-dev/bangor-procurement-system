// General Imports
import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useHistory } from 'react-router-dom';
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
  Modal,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFirestore } from '../../hooks/useFirestore';

const Order = ({ orderId }) => {
  const {
    user: { uid, displayName, photoURL, role },
  } = useAuthContext();
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation('common');
  const [items, setItems] = useState([]);
  const [activity, setActivity] = useState([]);
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(null);
  const [, deleteOrder, updateOrder] = useFirestore('orders');
  const [addUserNotification, , ,] = useFirestore('userNotifications');
  const [addDepartmentNotification, deleteDepartmentNotification, ,] =
    useFirestore('departmentNotifications');
  const [_addEvent, , ,] = useFirestore('events');
  const addEventReference = useRef(_addEvent);
  const addEvent = addEventReference.current;
  const [documents] = useCollection('events', [
    'orderId',
    '==',
    orderId ? orderId : id,
  ]);

  const [document, error] = useDocument('orders', orderId ? orderId : id);

  const [budgets] = useCollection('budgets');
  const [budget, setBudget] = useState('');

  const [schools] = useCollection('schools');
  const [school, setSchool] = useState('');

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
    if (document && budgets) {
      setBudget(
        budgets.find((budget) => budget.id === document.budget.budgetId)
      );
    }
  }, [document, budgets, setBudget]);

  useEffect(() => {
    if (budgets && schools) {
      setSchool(schools.find((school) => school.id === budget.school.id));
    }
  }, [budget, budgets, schools, setSchool]);

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
      case 'accepted':
        return t('order.stat.accepted');
      case 'authorised':
        return t('order.stat.authorised');
      case 'ordered':
        return t('order.stat.ordered');
      case 'delivered':
        return t('order.stat.delivered');
      default:
        return t('order.stat.unknown');
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleAcceptOrder = () => {
    setShow(false);
    toast.promise(updateOrder(id, { status: 'accepted' }), {
      pending: {
        render() {
          return 'Accepting Order...';
        },
      },
      success: {
        render({ data }) {
          addDepartmentNotification({
            event: 'accepted',
            by: { displayName, uid, photoURL, role },
            budgetId: document.budget.budgetId,
            orderId: id,
            for: 'Finance Officer',
            readBy: [],
          });
          toast.promise(
            //Again wrapping in a promise to keep track of the status.
            addEvent({
              type: 'order',
              event: 'accepted',
              by: { displayName, uid, photoURL, role },
              orderId: data.payload,
              budgetId: document.budget.budgetId,
            }),
            {
              pending: {
                render() {
                  return 'Logging Status...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Status Logged.';
                },
              },
              error: {
                render({ data }) {
                  return 'Logging:' + data;
                },
              },
            }
          );
          return 'Order Accepted!';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };
  const handleAuthoriseOrder = () => {
    setShow(false);
    toast.promise(updateOrder(id, { status: 'authorised' }), {
      pending: {
        render() {
          return 'Authorising Order';
        },
      },
      success: {
        render({ data }) {
          addUserNotification({
            event: 'authorised',
            by: { displayName, uid, photoURL, role },
            budgetId: document.budget.budgetId,
            orderId: id,
            forUser: school.reqOfficer.displayName,
          });
          deleteDepartmentNotification(null, ['orderId', '==', id]);
          toast.promise(
            //Again wrapping in a promise to keep track of the status.
            addEvent({
              type: 'order',
              event: 'authorised',
              by: { displayName, uid, photoURL, role },
              orderId: data.payload,
              budgetId: document.budget.budgetId,
            }),
            {
              pending: {
                render() {
                  return 'Logging Status...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Status Logged.';
                },
              },
              error: {
                render({ data }) {
                  return 'Logging:' + data;
                },
              },
            }
          );
          return 'Order Authorised!';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };

  const handleDenyOrder = () => {
    setShow(false);
    toast.promise(deleteOrder(id, { status: 'accepted' }), {
      pending: {
        render() {
          return 'Denying Order...';
        },
      },
      success: {
        render({ data }) {
          addUserNotification({
            event: 'denied',
            by: { displayName, uid, photoURL, role },
            budgetId: document.budget.budgetId,
            orderId: id,
            forUser: document.createdBy.uid,
          });
          history.push('/orders');
          toast.promise(
            //Again wrapping in a promise to keep track of the status.
            addEvent({
              type: 'order',
              event: 'denied',
              by: { displayName, uid, photoURL, role },
              orderId: data,
              budgetId: document.budget.budgetId,
            }),
            {
              pending: {
                render() {
                  return 'Logging Status...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Status Logged.';
                },
              },
              error: {
                render({ data }) {
                  return 'Logging:' + data;
                },
              },
            }
          );
          return 'Order Denied!';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };

  const handleOrderedOrder = () => {
    setShow(false);
    toast.promise(updateOrder(id, { status: 'ordered' }), {
      pending: {
        render() {
          return 'Marking Order';
        },
      },
      success: {
        render({ data }) {
          addUserNotification({
            event: 'ordered',
            by: { displayName, uid, photoURL, role },
            budgetId: document.budget.budgetId,
            orderId: id,
            forUser: document.createdBy.uid,
          });
          toast.promise(
            //Again wrapping in a promise to keep track of the status.
            addEvent({
              type: 'order',
              event: 'ordered',
              by: { displayName, uid, photoURL, role },
              orderId: data.payload,
              budgetId: document.budget.budgetId,
            }),
            {
              pending: {
                render() {
                  return 'Logging Status...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Status Logged.';
                },
              },
              error: {
                render({ data }) {
                  return 'Logging:' + data;
                },
              },
            }
          );
          return 'Order Marked!';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };

  const handleDeliveredOrder = () => {
    setShow(false);
    toast.promise(updateOrder(id, { status: 'delivered' }), {
      pending: {
        render() {
          return 'Marking Order';
        },
      },
      success: {
        render({ data }) {
          addUserNotification({
            event: 'delivered',
            by: { displayName, uid, photoURL, role },
            budgetId: document.budget.budgetId,
            orderId: id,
            forUser: document.createdBy.uid,
          });
          toast.promise(
            //Again wrapping in a promise to keep track of the status.
            addEvent({
              type: 'order',
              event: 'delivered',
              by: { displayName, uid, photoURL, role },
              orderId: data.payload,
              budgetId: document.budget.budgetId,
            }),
            {
              pending: {
                render() {
                  return 'Logging Status...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Status Logged.';
                },
              },
              error: {
                render({ data }) {
                  return 'Logging:' + data;
                },
              },
            }
          );
          return 'Order Marked!';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };

  const handleCompleteOrder = () => {
    setShow(false);
    toast.promise(deleteOrder(id, { status: 'accepted' }), {
      pending: {
        render() {
          return 'Completing Order...';
        },
      },
      success: {
        render({ data }) {
          addUserNotification({
            event: 'completed',
            by: { displayName, uid, photoURL, role },
            budgetId: document.budget.budgetId,
            orderId: id,
            forUser: document.createdBy.uid,
          });
          history.push('/orders');
          toast.promise(
            //Again wrapping in a promise to keep track of the status.
            addEvent({
              type: 'order',
              event: 'completed',
              by: { displayName, uid, photoURL, role },
              orderId: data,
              budgetId: document.budget.budgetId,
            }),
            {
              pending: {
                render() {
                  return 'Logging Status...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Status Logged.';
                },
              },
              error: {
                render({ data }) {
                  return 'Logging:' + data;
                },
              },
            }
          );
          return 'Order Complete!';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };

  const handleSubmit = () => {
    switch (modal) {
      case 'accept':
        handleAcceptOrder();
        break;
      case 'deny':
        handleDenyOrder();
        break;
      case 'authorise':
        handleAuthoriseOrder();
        break;
      case 'order':
        handleOrderedOrder();
        break;
      case 'delivered':
        handleDeliveredOrder();
        break;
      case 'complete':
        handleCompleteOrder();
        break;
      default:
        break;
    }
  };

  const HandleShowWarning = () => {
    switch (modal) {
      case 'accept':
        return 'Accepting this order will disable the ability for the requester to edit anything';
      case 'deny':
        return 'Denying this order will also delete it, and the requester will have to fill in all the details to order again.';

      case 'authorise':
        return 'Authorising this order will notify the procurement officer to begin purchasing the items.';
      case 'order':
        return 'Marking the items as ordered will notify the Finance Department to Pay any invoices for the items.';
      case 'delivered':
        return 'This will notify the requester that their items have been delivered.';
      case 'complete':
        return 'This will remove the order from the system. The Activity log for this order will saved.';
      default:
        break;
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
          {(document.createdBy.uid === uid || role === 'Admin') && (
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
        {document.status === 'accepted' && role !== 'Admin' && (
          <div className="mt-2">
            <small>
              This order has been accepted by a budget holder, and cannot be
              edited by you any longer. If you need to make a change, please
              contact an Admin.{' '}
              <em>Editing an order will reset it's status.</em>
            </small>
          </div>
        )}
        {(role === 'Admin' || role === 'Budget Holder') &&
          document.status === 'orderPlaced' && (
            <>
              <Button
                variant="success"
                onClick={() => {
                  setShow(true);
                  setModal('accept');
                }}
              >
                Accept
              </Button>
              <Button
                variant="danger"
                className="mx-2"
                onClick={() => {
                  setShow(true);
                  setModal('deny');
                }}
              >
                Deny
              </Button>
            </>
          )}

        {(role === 'Admin' || role === 'Finance Officer') &&
          document.status === 'accepted' && (
            <>
              <Button
                variant="success"
                onClick={() => {
                  setShow(true);
                  setModal('authorise');
                }}
              >
                Authorise Order
              </Button>
              <Button
                variant="danger"
                className="mx-2"
                onClick={() => {
                  setShow(true);
                  setModal('deny');
                }}
              >
                Deny Order
              </Button>
            </>
          )}

        {(role === 'Admin' || role === 'School Requisitions Officer') &&
          document.status === 'authorised' && (
            <>
              <Button
                variant="success"
                className="me-2"
                onClick={() => {
                  setShow(true);
                  setModal('order');
                }}
              >
                Confirm All Items Ordered
              </Button>
            </>
          )}

        {(role === 'Admin' || role === 'School Requisitions Officer') &&
          document.status === 'delivered' && (
            <>
              <Button
                variant="success"
                className="me-2"
                onClick={() => {
                  setShow(true);
                  setModal('complete');
                }}
              >
                Complete Order
              </Button>
            </>
          )}

        {(role === 'Admin' || role === 'School Requisitions Officer') &&
          document.status === 'ordered' && (
            <>
              <Button
                variant="success"
                className="me-2"
                onClick={() => {
                  setShow(true);
                  setModal('delivered');
                }}
              >
                Mark as delivered
              </Button>
            </>
          )}

        {(role === 'Admin' ||
          (document.createdBy.uid === uid &&
            document.status === 'orderPlaced' &&
            document.status !== 'ordered')) && (
          <Button as={Link} to={`/createOrder/${document.id}`}>
            Edit
          </Button>
        )}

        <hr />
        <ActivityTracker activity={activity} />
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-capitalize">{modal} Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">{<HandleShowWarning modal={modal} />}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            className="text-capitalize"
            onClick={handleSubmit}
          >
            {modal}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Order;

// General Imports
import React, { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { formatCurrency, formatNumber } from '../../utils/formatters';

// Custom Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';

//Components
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TableTemplate } from '../../components/table/TableTemplate';

const OrderTable = ({ orders }) => {
  const {
    user: { displayName, uid, photoURL, role },
  } = useAuthContext();
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [addEvent, , ,] = useFirestore('events');
  const [, deleteOrder, ,] = useFirestore('orders');
  const [orderDetails, setOrderDetails] = useState('');

  const handleClose = () => {
    setShow(false);
  };

  const handleCancelOrder = ({ orderId, budgetId }) => {
    setShow(false);
    toast.promise(deleteOrder(orderId), {
      pending: {
        render() {
          return 'Cancelling Order...';
        },
      },
      success: {
        render() {
          toast.promise(
            //Again wrapping in a promise to keep track of the status.
            addEvent({
              type: 'order',
              event: 'cancelled',
              by: { displayName, uid, photoURL, role },
              orderId: orderId,
              budgetId: budgetId,
            }),
            {
              pending: {
                render() {
                  return 'Logging Cancellation...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Cancellation Logged.';
                },
              },
              error: {
                render({ data }) {
                  return 'Logging:' + data;
                },
              },
            }
          );
          return 'Order Cancelled!';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };

  useEffect(() => {
    if (orders) {
      const options = [];
      orders.forEach(
        ({
          budget: { budgetId, budgetCode },
          total,
          id,
          createdAt,
          recurring,
          items,
        }) => {
          options.push({
            budgetId,
            budgetCode,
            total: formatCurrency(total),
            id,
            action: id,
            createdAt: format(
              createdAt.toDate(),
              "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            ),
            recurring,
            items: formatNumber(items.length),
          });
        }
      );
      setData(options);
    }
  }, [orders]);

  //Setting up the columns, using React memo to avoid recalculating the columns on rerendering.
  const columns = React.useMemo(
    () => [
      {
        Header: 'Order Id',
        accessor: 'id',
      },
      {
        Header: 'Budget Code',
        accessor: 'budgetCode',
      },
      { Header: 'No. Items', accessor: 'items' },
      {
        Header: 'Total',
        accessor: 'total', // accessor is the "key" in the data
      },
      {
        Header: 'Created',
        accessor: 'createdAt',
        Cell: ({ row: { allCells } }) => {
          return formatDistanceToNow(new Date(allCells[4].value), {
            addSuffix: true,
          });
        },
      },
      {
        Header: '',
        accessor: 'action',
        disableSortBy: true,
        //Creating a custom cell that will display a view button
        Cell: ({ row: { allCells } }) => {
          return (
            <>
              <Button
                size="sm"
                variant="primary"
                as={Link}
                to={`/orders/${allCells[5].value}`}
              >
                View
              </Button>
              <Button
                size="sm"
                className="ms-1"
                variant="outline-primary"
                onClick={(e) => {
                  setShow(true);
                  setOrderDetails({
                    orderId: allCells[5].value,
                    budgetId: allCells[6].value,
                  });
                }}
              >
                Cancel
              </Button>
            </>
          );
        },
      },
      {
        Header: '',
        accessor: 'budgetId',
        show: false,
      },
    ],
    []
  );

  return (
    <>
      <TableTemplate
        data={data}
        columns={columns}
        noDataText="No Orders Found"
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          If you didn't set your order to recurring, cancelling this order will
          delete all copies, and you will have to re-enter all details to make
          the order again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleCancelOrder(orderDetails)}
          >
            Cancel Order
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderTable;

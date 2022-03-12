import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TableTemplate } from '../../components/table/TableTemplate';

const OrderTable = ({ orders }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (orders) {
      const options = [];
      orders.forEach(
        ({
          budget: { budgetId, budgetCode },
          total,
          id,
          createdAt,
          updatedAt,
          recurring,
          createdBy,
        }) => {
          options.push({
            budgetId,
            budgetCode,
            total,
            id,
            action: id,
            createdAt: createdAt
              ? formatDistanceToNow(createdAt.toDate(), {
                  addSuffix: true,
                })
              : new Date(),
            recurring,
            createdBy: (
              <div>
                <span>{createdBy ? createdBy.displayName : 'Unknown'} - </span>{' '}
                <span className="text-muted">
                  {formatDistanceToNow(
                    updatedAt ? updatedAt.toDate() : createdAt.toDate(),
                    {
                      addSuffix: true,
                    }
                  )}
                </span>
              </div>
            ),
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
      {
        Header: 'Total (£)',
        accessor: 'total', // accessor is the "key" in the data
      },
      {
        Header: 'Created',
        accessor: 'createdAt',
      },
      {
        Header: 'Last Edited By',
        accessor: 'createdBy',
      },

      {
        Header: '',
        accessor: 'action',
        disableSortBy: true,
        //Creating a cust Cell that will display a view button
        Cell: ({ row: { allCells } }) => {
          return (
            <Button
              size="sm"
              variant="primary"
              as={Link}
              to={`/orders/${allCells[5].value}`}
            >
              View
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <TableTemplate data={data} columns={columns} noDataText="No Orders Found" />
  );
};

export default OrderTable;

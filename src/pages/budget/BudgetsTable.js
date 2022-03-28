import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TableTemplate } from '../../components/table/TableTemplate';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';

const BudgetsTable = () => {
  const {
    user: { role, uid },
  } = useAuthContext();

  const { documents } = useCollection('budgets');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (documents) {
      const options = [];
      documents.forEach(({ code, name, holders, createdBy, id }) => {
        if (
          createdBy.uid === uid ||
          role === 'Admin' ||
          role === 'Finance' ||
          role === 'Requisitions Officer'
        ) {
          options.push({
            code,
            name,
            holders: [
              ...holders.map(({ displayName }, i) =>
                holders.length > i + 1 ? displayName + ', ' : displayName
              ),
            ],
            createdBy: createdBy.displayName,
            id,
          });
        }
      });
      setData(options);
    }
  }, [documents]);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Budget Name',
        accessor: 'name',
      },
      {
        Header: 'Budget Code',
        accessor: 'code', // accessor is the "key" in the data
      },
      {
        Header: 'Budget Holders',
        accessor: 'holders',
      },
      {
        Header: 'Created By',
        accessor: 'createdBy',
      },
      {
        Header: '',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ row: { allCells } }) => {
          return (
            <div className="text-center">
              <Button
                size="sm"
                variant="primary"
                as={Link}
                to={`/budgets/${allCells[4].value}`}
              >
                View
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <TableTemplate
      data={data}
      columns={columns}
      noDataText="No Budgets Found"
    />
  );
};

export default BudgetsTable;

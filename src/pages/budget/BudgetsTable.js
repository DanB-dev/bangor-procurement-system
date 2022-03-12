import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { TableTemplate } from '../../components/table/TableTemplate';
import { useCollection } from '../../hooks/useCollection';

const BudgetsTable = () => {
  const { documents } = useCollection('budgets');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (documents) {
      const options = [];
      documents.forEach(({ code, name, holders, createdBy, id }) => {
        options.push({
          code,
          name,
          holders: [
            ...holders.map((holder) => {
              if (holders.length > 1) {
                return holder.displayName + ', ';
              }
              return holder.displayName;
            }),
          ],
          createdBy: createdBy.displayName,
          id,
        });
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

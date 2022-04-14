// General Imports
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Components
import { TableTemplate } from '../../components/table/TableTemplate';

const BudgetsTable = ({ data, hideSchool = false }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Budget Name',
        accessor: 'name',
      },
      {
        Header: 'School',
        accessor: 'school', // accessor is the "key" in the data
        show: !hideSchool,
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
                to={`/budgets/${allCells[5].value}`}
              >
                View
              </Button>
            </div>
          );
        },
      },
    ],
    [hideSchool]
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

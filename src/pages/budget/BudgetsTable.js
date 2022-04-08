// General Imports
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//Custom Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';

//Components
import { TableTemplate } from '../../components/table/TableTemplate';

const BudgetsTable = () => {
  const {
    user: { role, uid },
  } = useAuthContext();

  const [documents] = useCollection('budgets');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (documents) {
      const options = [];
      documents.forEach(({ code, name, holders, createdBy, id, school }) => {
        if (createdBy.uid === uid || role !== 'User') {
          options.push({
            code,
            name,
            school: school.code,
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
  }, [documents, role, uid]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Budget Name',
        accessor: 'name',
      },
      {
        Header: 'School',
        accessor: 'school', // accessor is the "key" in the data
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

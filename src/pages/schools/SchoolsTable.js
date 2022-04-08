// General Imports
import React, { useEffect, useState } from 'react';

//Custom Hooks
import { useCollection } from '../../hooks/useCollection';

//Components
import { TableTemplate } from '../../components/table/TableTemplate';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SchoolsTable = () => {
  const [documents] = useCollection('schools');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (documents) {
      const options = [];
      documents.forEach(({ code, name, reqOfficer, createdBy, id }) => {
        options.push({
          code,
          name,
          reqOfficer: reqOfficer.displayName,
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
        Header: 'School Name',
        accessor: 'name',
      },
      {
        Header: 'School Code',
        accessor: 'code', // accessor is the "key" in the data
      },
      {
        Header: 'School Req. Officer',
        accessor: 'reqOfficer',
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
                to={`/schools/${allCells[4].value}`}
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
      noDataText="No Schools Found"
    />
  );
};

export default SchoolsTable;

import { Col, Pagination, Row, Table } from 'react-bootstrap';
import { useTable, usePagination, useSortBy } from 'react-table';

export const TableTemplate = ({
  data,
  columns,
  noDataText,
  minHeight = '300px',
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: false,
      autoResetSortBy: false,
      initialState: {
        pageIndex: 0,
        hiddenColumns: columns.map(({ show, accessor, id }) => {
          if (show === false) return accessor;
          return id;
        }),
      },
    },
    useSortBy,
    usePagination
  );

  //setting the icon state for sorting the table
  const tableSortIcon = (column) => {
    return !column.disableSortBy
      ? column.isSorted
        ? column.isSortedDesc
          ? 'sorting_desc'
          : 'sorting_asc'
        : 'sorting'
      : '';
  };

  return (
    <div
      className="d-flex flex-column justify-content-between bg-white pb-2"
      style={{ minHeight: minHeight }}
    >
      <Table
        className={'text-left'}
        striped
        hover
        size="md"
        {...getTableProps()}
      >
        <thead className="bg-primary text-white">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  className={tableSortIcon(column)}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.length > 0 &&
            page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </Table>
      {page.length <= 0 && (
        <div style={{ marginTop: '-16px' }} className=" py-2">
          <h5 className={'text-center'}>{noDataText || 'No Data Found...'}</h5>
        </div>
      )}
      <Row className="ms-1">
        <Col md="auto" style={{ paddingLeft: '0px' }}>
          <Pagination>
            <Pagination.First
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            />
            <Pagination.Prev
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            />
            <Pagination.Item disabled={true}>
              {pageIndex + 1} of {pageOptions.length}
            </Pagination.Item>
            <Pagination.Next
              onClick={() => nextPage()}
              disabled={!canNextPage}
            />
            <Pagination.Last
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            />
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

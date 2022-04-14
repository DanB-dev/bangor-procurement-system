//General Imports
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//Components
import { Badge, Button, Container, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

//Custom Hooks
import { TableTemplate } from '../../components/table/TableTemplate';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import { usePasswordReset } from '../../hooks/usePasswordReset';
import UserFilter from './UserFilter';

const Users = () => {
  const { user } = useAuthContext();
  const [documents] = useCollection('users');
  const { resetPassword } = usePasswordReset();
  const [addEvent, , ,] = useFirestore('events');
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');

  const [currentFilter, setCurrentFilter] = useState('all');
  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  //Handles sending the email to the requester, as well as notifying the user if the request was successful.
  const handleResetPassword = (email, displayName) => {
    toast.promise(resetPassword(email, displayName), {
      pending: {
        render() {
          return 'Verifying...';
        },
      },
      success: {
        render() {
          toast.promise(
            addEvent({
              type: 'user',
              event: 'Reset Password',
              for: email,
              by: {
                displayName: user.displayName,
                uid: user.uid,
                photoURL: user.photoURL,
                role: user.role,
              },
            }),
            {
              pending: {
                render() {
                  return 'Logging...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Logged';
                },
              },
              error: {
                render() {
                  return 'Error Logging Request!';
                },
              },
            }
          );
          return 'Reset Email Sent!';
        },
      },
      error: {
        render() {
          return 'Error sending Email!';
        },
      },
    });
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  //Filtering the orders using the current filter.
  const orders = documents
    ? documents.filter((document) => {
        switch (currentFilter) {
          case 'all':
            return true;
          case 'User':
          case 'Budget Holder':
          case 'Finance Officer':
          case 'School Requisitions Officer':
          case 'Admin':
            return document.role === currentFilter;
          default:
            return false;
        }
      })
    : null; //If there are no documents in that match set to null.

  //formatting all users ready for display.
  useEffect(() => {
    if (orders) {
      const options = [];
      orders.forEach((document) => {
        options.push({
          displayName: document.displayName,
          photoURL: document.photoURL,
          role: document.role,
          roomNo: document.roomNo,
          telNo: document.telNo,
          uid: document.uid,
        });
      });
      setData(options);
    }
  }, [setData, orders]);

  //Configuring our column formatting. useMemo will stop this from being recalculated on each render, and only update when state inside changes.
  const columns = React.useMemo(
    () => [
      {
        Header: 'Display Name',
        accessor: 'displayName',
      },
      {
        Header: 'Role',
        accessor: 'role', // accessor is the "key" in the data
        Cell: ({ row: { cells } }) => {
          if (cells[1].value === null)
            return <div className="text-muted">No Role Applied</div>;
          return (
            <Badge
              className={`${cells[1].value.replace(/ /g, '')} ms-2`}
              bg="none"
            >
              <span className="text-capitalize">{cells[1].value}</span>
            </Badge>
          );
        },
      },
      {
        Header: 'Room No.',
        accessor: 'roomNo', // accessor is the "key" in the data
        Cell: ({ row: { cells } }) => {
          switch (cells[2].value) {
            case null:
            case undefined:
            case '':
              return <div className="text-muted">No Room Set</div>;
            default:
              return cells[2].value;
          }
        },
      },
      {
        Header: 'Tel No.',
        accessor: 'telNo', // accessor is the "key" in the data
        Cell: ({ row: { cells } }) => {
          switch (cells[3].value) {
            case null:
            case undefined:
            case '':
              return <div className="text-muted">No Number Set</div>;
            default:
              return ` ${
                cells[3].value.substring(0, 5) +
                '-' +
                cells[3].value.substring(5, 8) +
                '-' +
                cells[3].value.substring(8, cells[3].value.length)
              }`;
          }
        },
      },

      {
        Header: '',
        accessor: 'uid',
        disableSortBy: true,
        Cell: ({ row: { allCells } }) => {
          return (
            <div className="text-center">
              <Button
                size="sm"
                variant="primary"
                as={Link}
                to={`/profile/${allCells[4].value}`}
              >
                View
              </Button>
              <Button
                size="sm"
                className="ms-1"
                variant="primary"
                onClick={() => {
                  setShow(true);
                  setEmail(allCells[0].value);
                }}
              >
                Reset Password
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <Container fluid>
        <h2 className="page-title mb-2">Users</h2>
        <UserFilter currentFilter={currentFilter} changeFilter={changeFilter} />
        <TableTemplate
          data={data}
          columns={columns}
          noDataText="No Users Found"
        />
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will log the user out of all devices, and force the user to
          create a new password. A link will be sent to them via their
          registered email.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleResetPassword(email + '@bangor.ac.uk', email)}
          >
            Reset
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Users;

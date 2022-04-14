import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';
import { useDocument } from '../../hooks/useDocument';
import { useCollection } from '../../hooks/useCollection';
import OrderFilter from '../orders/OrderFilter';
import OrderTable from '../orders/OrderTable';

import { toast } from 'react-toastify';

import Room from '../../assets/room.svg';
import Phone from '../../assets/phone.svg';
import Email from '../../assets/email.svg';
import { UpdateProfile } from './UpdateProfile';
import { validation, fields } from '../../schema/updateProfileSchema';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { formatPhoneNumber } from '../../utils/formatters';

const Profile = () => {
  const { user } = useAuthContext();
  const { id } = useParams();
  const [document, userError] = useDocument('users', id);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [addEvent, , ,] = useFirestore('events');
  const [, deleteUser, updateUser] = useFirestore('users'); // Access the addDocument function in the firestore Hook.
  const [documents, orderError] = useCollection(
    'orders',
    ['createdBy.uid', '==', id] // Only fetch orders that match their UID
  );
  const history = useHistory();

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
  };

  const handleDelete = (uid) => {
    toast.promise(deleteUser(uid), {
      pending: {
        render() {
          return 'Deleting...';
        },
      },
      success: {
        render({ data }) {
          toast.promise(
            addEvent({
              type: 'user',
              event: 'Deleted User',
              id: data,
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
                  return 'Logging Deleted User...';
                },
              },
              success: {
                type: 'info',
                render() {
                  return 'Deleted User Logged';
                },
              },
              error: {
                render() {
                  return 'Error Logging!';
                },
              },
            }
          );
          history.push('/users');
          return 'User deleted';
        },
      },
      error: {
        render({ data }) {
          return '' + data;
        },
      },
    });
  };

  const onSubmit = async ({ telNo, roomNo, role }) => {
    toast.promise(
      updateUser(document.uid, {
        telNo,
        roomNo,
        role: role.value,
      }),
      {
        pending: {
          render() {
            return 'Updating...';
          },
        },
        success: {
          render() {
            if (document.role !== role.value) {
              toast.promise(
                addEvent({
                  type: 'user',
                  event: 'Changed Role',
                  for: document.displayName,
                  from: document.role,
                  to: role.value,
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
                      return 'Logging role change...';
                    },
                  },
                  success: {
                    type: 'info',
                    render() {
                      return 'Role Change Logged';
                    },
                  },
                  error: {
                    render() {
                      return 'Error Logging Role Change!';
                    },
                  },
                }
              );
            }
            return 'Details Updated!';
          },
        },
        error: {
          render({ data }) {
            return '' + data;
          },
        },
      }
    );
  };

  const orders = documents
    ? documents.filter((document) => {
        switch (currentFilter) {
          case 'all':
            return true;
          case 'orderPlaced':
          case 'actionNeeded':
          case 'awaitingAuth':
          case 'ordered':
          case 'shipping':
          case 'complete':
            return document.status === currentFilter;
          default:
            return false;
        }
      })
    : null; //If there are no documents in that match set to null.

  if (userError) {
    return <Alert variant="danger">{userError}</Alert>;
  }
  if (orderError) {
    return <Alert variant="danger">{orderError}</Alert>;
  }
  if (!document) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <Container className="pb-5">
      <Row>
        <Col sm={12} md={12} lg={12} xl={4} className="pb-1 mx-auto">
          <Card className="mb-3 h-100">
            <Card.Body className="text-center">
              <Avatar size={'60px'} src={document.photoURL} />
              <h4 className="fw-bold">
                <span className="ms-2">{document.displayName}</span> -{' '}
                <span className="text-muted fw-normal fs-5">
                  {document.online ? 'Online' : 'Offline'}
                </span>
              </h4>
              <Badge
                className={`${document.role.replace(/ /g, '')} ms-2`}
                bg="none"
              >
                <span className="text-capitalize">{document.role}</span>
              </Badge>

              <p className="text-muted text-left">
                <img src={Room} alt="room" className="me-2" />
                {document.roomNo ? ` Room ${document.roomNo}` : 'No Room'}
              </p>

              <p className="text-muted text-left">
                <img src={Phone} alt="room" className="me-2" />{' '}
                {document.telNo ? formatPhoneNumber(document.telNo) : 'No Tel'}
              </p>
              <p className="text-muted text-left">
                <img src={Email} alt="room" className="me-2" />{' '}
                {document.displayName}@bangor.ac.uk
              </p>
            </Card.Body>
            {user.role === 'Admin' && (
              <Card.Footer className="text-center">
                <Container>
                  <Button
                    size="sm"
                    className="mx-1"
                    variant="outline-secondary"
                    onClick={() => handleDelete(document.uid)}
                  >
                    Delete Account
                  </Button>
                </Container>
              </Card.Footer>
            )}
          </Card>
        </Col>
        {(user.role === 'Admin' || user.uid === document.uid) && (
          <Col sm={12} md={12} lg={12} xl={8} className="pb-1">
            <UpdateProfile
              mUser={document}
              onSubmit={onSubmit}
              validation={validation}
              fields={fields}
            />
          </Col>
        )}
      </Row>
      <OrderFilter currentFilter={currentFilter} changeFilter={changeFilter} />
      <OrderTable orders={orders} minHeight={'200px'} />
    </Container>
  );
};

export default Profile;

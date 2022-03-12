import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';
import { useDocument } from '../../hooks/useDocument';
import { useCollection } from '../../hooks/useCollection';
import Select from 'react-select';
import OrderFilter from '../orders/OrderFilter';
import OrderTable from '../orders/OrderTable';

import Room from '../../assets/room.svg';
import Phone from '../../assets/phone.svg';
import Email from '../../assets/email.svg';

const Profile = () => {
  const { id } = useParams();
  const { document, error: userError } = useDocument('users', id);
  const [currentFilter, setCurrentFilter] = useState('all');
  const { documents, error: orderError } = useCollection(
    'orders',
    ['createdBy.uid', '==', id] //If the user is not an admin, then only fetch orders that match their UID
  );

  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter);
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
        <Col sm={12} md={12} lg={12} xl={4} className="pb-1">
          <Card className="mb-3 h-100">
            <Card.Body className="text-center">
              <Avatar size={'60px'} src={document.photoURL} />
              <h4 className="fw-bold">
                <span className="ms-2">{document.displayName}</span> -{' '}
                <span className="text-muted fw-normal fs-5">
                  {document.online ? 'Online' : 'Offline'}
                </span>
              </h4>
              <Badge className={`${document.role} ms-2`} bg="none">
                {document.role}
              </Badge>

              <p className="text-muted text-left">
                <img src={Room} alt="room" className="me-2" />
                {document.roomNo ? ` Room ${document.roomNo}` : 'No Room'}
              </p>

              <p className="text-muted text-left">
                <img src={Phone} alt="room" className="me-2" />{' '}
                {document.telNo ? ` ${document.telNo}` : 'No Tel'}
              </p>
              <p className="text-muted text-left">
                <img src={Email} alt="room" className="me-2" />{' '}
                {document.displayName}@bangor.ac.uk
              </p>
            </Card.Body>
            <Card.Footer className="text-center">
              <Container>
                <Button size="sm" className="mx-1" variant="outline-primary">
                  Disable Account
                </Button>
                <Button size="sm" className="mx-1" variant="outline-secondary">
                  Delete Account
                </Button>
              </Container>
            </Card.Footer>
          </Card>
        </Col>
        <Col sm={12} md={12} lg={12} xl={8} className="pb-1">
          <Card className="mb-3 h-100">
            <Card.Body>
              <Card.Title className="text-center">
                Update Account Details
              </Card.Title>
              <InputGroup className="mb-3 w-50 mx-auto">
                <InputGroup.Text
                  id="basic-addon3"
                  style={{ minWidth: '170px' }}
                >
                  Telephone Number
                </InputGroup.Text>
                <Form.Control id="basic-url" aria-describedby="basic-addon3" />
              </InputGroup>
              <InputGroup className="mb-3 w-50 mx-auto">
                <InputGroup.Text
                  id="basic-addon3"
                  style={{ minWidth: '170px' }}
                >
                  Room Number
                </InputGroup.Text>
                <Form.Control id="basic-url" aria-describedby="basic-addon3" />
              </InputGroup>
              <InputGroup className="mb-3 w-50 mx-auto">
                <InputGroup.Text
                  id="basic-addon3"
                  style={{ minWidth: '170px' }}
                >
                  Role
                </InputGroup.Text>
                <Select
                  options={[{ value: 'admin', label: 'Admin' }]}
                  styles={{
                    container: (container) => ({
                      ...container,
                      flex: '1 1 auto',
                    }),
                    control: (control) => ({
                      ...control,
                      borderRadius: '0 4px 4px 0',
                    }),
                  }}
                />
              </InputGroup>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button size="sm" type="submit">
                Update
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <OrderFilter currentFilter={currentFilter} changeFilter={changeFilter} />
      <OrderTable orders={orders} minHeight={'200px'} />
    </Container>
  );
};

export default Profile;

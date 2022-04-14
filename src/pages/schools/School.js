import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Row, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Avatar } from '../../components/avatar/Avatar';
import { useCollection } from '../../hooks/useCollection';
import { useDocument } from '../../hooks/useDocument';
import BudgetsTable from '../budget/BudgetsTable';

import Room from '../../assets/room.svg';
import Phone from '../../assets/phone.svg';
import Email from '../../assets/email.svg';
import { formatPhoneNumber } from '../../utils/formatters';

const School = () => {
  const { id } = useParams();
  const [schoolBudgets, setSchoolBudgets] = useState(null);

  const [school] = useDocument('schools', id);
  const [budgets] = useCollection('budgets');
  const [document] = useDocument('users', school?.reqOfficer.uid);

  useEffect(() => {
    if (budgets) {
      const options = [];
      budgets.forEach(({ code, name, holders, createdBy, id: uid, school }) => {
        if (school.id === id) {
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
            id: uid,
          });
        }
      });
      setSchoolBudgets(options);
    }
  }, [budgets, id]);

  return (
    <div>
      {school && (
        <>
          <h3 className="mb-3">
            {school.name} - {school.code}
          </h3>

          {schoolBudgets && (
            <Container fluid>
              <h2 className="page-title">School's Budgets</h2>
              <BudgetsTable data={schoolBudgets} hideSchool={true} />
              <Row className="mt-4">
                <Col>
                  <Card>
                    <Card.Body className="text-center">
                      <Card.Title>School's Requisitions Officer</Card.Title>
                      {document ? (
                        <>
                          <Avatar size={'60px'} src={document.photoURL} />
                          <h4 className="fw-bold">
                            <span className="ms-2">{document.displayName}</span>{' '}
                            -{' '}
                            <span className="text-muted fw-normal fs-5">
                              {document.online ? 'Online' : 'Offline'}
                            </span>
                          </h4>
                          <Badge
                            className={`${document.role.replace(
                              / /g,
                              ''
                            )} ms-2`}
                            bg="none"
                          >
                            <span className="text-capitalize">
                              {document.role}
                            </span>
                          </Badge>

                          <p className="text-muted text-left">
                            <img src={Room} alt="room" className="me-2" />
                            {document.roomNo
                              ? ` Room ${document.roomNo}`
                              : 'No Room'}
                          </p>

                          <p className="text-muted text-left">
                            <img src={Phone} alt="room" className="me-2" />{' '}
                            {document.telNo
                              ? formatPhoneNumber(document.telNo)
                              : 'No Tel'}
                          </p>
                          <p className="text-muted text-left">
                            <img src={Email} alt="room" className="me-2" />{' '}
                            {document.displayName}@bangor.ac.uk
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="my-2">
                            No Requisitions could be found.
                          </p>
                          <Button variant="primary"> Add One</Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body className="text-center">
                      <Card.Title>School's Details</Card.Title>
                      <p className="text-muted text-left">
                        <img src={Email} alt="room" className="me-2" />
                        {school.email ? (
                          <>{school.email}@bangor.ac.uk</>
                        ) : (
                          'There is no email address.'
                        )}
                      </p>
                      <p className="text-muted text-left">
                        <img src={Phone} alt="room" className="me-2" />
                        {school.telNo
                          ? formatPhoneNumber(school.telNo)
                          : 'There is no Telephone Number.'}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          )}
        </>
      )}
    </div>
  );
};

export default School;

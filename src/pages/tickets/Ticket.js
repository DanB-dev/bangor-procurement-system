import React from 'react';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';

import { Col, Container, Row } from 'react-bootstrap';
import TicketSummary from './TicketSummary';
import TicketSide from './TicketSide';

const Ticket = () => {
  const { id } = useParams();

  const { document, error } = useDocument('projects', id);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!document) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Container>
      <Row style={{ height: '700px' }}>
        <Col md={8}>
          <TicketSummary ticket={document} />
        </Col>
        <Col md={4} style={{ borderLeft: '2px solid grey' }}>
          <TicketSide ticket={document} />
        </Col>
      </Row>
    </Container>
  );
};

export default Ticket;

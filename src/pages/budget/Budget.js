import React from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import BudgetMain from './BudgetMain';
import BudgetSide from './BudgetSide';

const Budget = () => {
  const { id } = useParams();

  const [document, error] = useDocument('budgets', id);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  if (!document) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <Container fluid>
      <Row>
        <Col md={8}>
          <BudgetMain budget={document} />
        </Col>
        <Col md={4} style={{ borderLeft: '2px solid grey' }}>
          <BudgetSide budget={document} />
        </Col>
      </Row>
    </Container>
  );
};

export default Budget;

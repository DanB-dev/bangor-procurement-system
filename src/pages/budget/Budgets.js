import { Col, Container, Row } from 'react-bootstrap';

import BudgetsTable from './BudgetsTable';
import CreateBudget from './CreateBudget';

const Budgets = () => {
  return (
    <Container fluid>
      <Row>
        <h2 className="page-title mb-2">Budgets</h2>
        <Col>
          <BudgetsTable />
        </Col>
        <Col sm={12} md={12} lg={4} xl={3}>
          <CreateBudget />
        </Col>
      </Row>
    </Container>
  );
};

export default Budgets;

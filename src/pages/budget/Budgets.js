import { Col, Container, Row } from 'react-bootstrap';
import { useAuthContext } from '../../hooks/useAuthContext';

import BudgetsTable from './BudgetsTable';
import CreateBudget from './CreateBudget';

const Budgets = () => {
  const {
    user: { role },
  } = useAuthContext();

  return (
    <Container fluid>
      <Row>
        <h2 className="page-title mb-2">Budgets</h2>
        <Col>
          <BudgetsTable />
        </Col>
        {role === 'Admin' && (
          <Col sm={12} md={12} lg={4} xl={3}>
            <CreateBudget />
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Budgets;

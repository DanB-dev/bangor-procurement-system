import { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';

import BudgetsTable from './BudgetsTable';
import CreateBudget from './CreateBudget';

const Budgets = () => {
  const {
    user: { uid, role },
  } = useAuthContext();

  const [documents] = useCollection('budgets');
  const [data, setData] = useState([]);

  useEffect(() => {
    if (documents) {
      const options = [];
      documents.forEach(({ code, name, holders, createdBy, id, school }) => {
        if (createdBy.uid === uid || role !== 'User') {
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
            id,
          });
        }
      });
      setData(options);
    }
  }, [documents, role, uid]);

  return (
    <Container fluid>
      <Row>
        <h2 className="page-title mb-2">Budgets</h2>
        <Col>
          <BudgetsTable data={data} />
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

import { useEffect, useState } from 'react';

import { Button, Container } from 'react-bootstrap';

import { useCollection } from '../../hooks/useCollection';

import ActivityTracker from '../../components/Activity/ActivityTracker';

const BudgetMain = ({ budget }) => {
  const [events] = useCollection('events', ['budgetId', '==', budget.id]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (events) {
      const options = [];
      events.forEach((document) => {
        options.push({
          uid: document.id,
          holder: document.holder,
          by: document.by,
          createdAt: document.createdAt,
          event: document.event,
          orderId: document.orderId,
        });
      });
      setData(options);
    }
  }, [setData, events]);

  return (
    <Container fluid>
      <h3>{budget.name}</h3>
      <h5>
        Created by {budget.createdBy.displayName} | Code: {budget.code}
      </h5>
      <Button variant="outline-secondary">Delete</Button>
      <hr />
      <ActivityTracker activity={data} budget={budget} />
    </Container>
  );
};

export default BudgetMain;

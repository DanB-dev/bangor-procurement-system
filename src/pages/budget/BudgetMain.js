import { formatDistanceToNow } from 'date-fns';

import {
  Badge,
  Button,
  Container,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { Avatar } from '../../components/avatar/Avatar';

const BudgetMain = ({ budget }) => {
  return (
    <Container fluid>
      <h3>{budget.name}</h3>
      <h5>
        Created by {budget.createdBy.displayName} | Code: {budget.code}
      </h5>
      <Button variant="secondary">Delete</Button>
      <hr />
      <div style={{ maxHeight: 650, overflowY: 'scroll' }}>
        <h5 className="mt-3">Details</h5>

        <hr />

        <h6 className="mt-3">Activity</h6>
        {budget.activity && budget.activity.length > 0 ? (
          <ListGroup className="mt-4">
            {budget.activity
              .map((act) => (
                <ListGroupItem key={act.timestamp} className="mb-1">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size={'40px'} src={act.photoURL} />
                    <p className="mx-2">{act.displayName}</p>

                    {act.type === 'created' && (
                      <p className="me-auto">
                        {act.by} - {act.type} budget:{' '}
                        <span className="fw-bold">{budget.code}</span>
                      </p>
                    )}
                    {(act.type === 'active' || act.type === 'inactive') && (
                      <p className="me-auto">
                        {act.by} - Set budget status to:{' '}
                        <span className="text-capitalize fw-bold">
                          {act.type}
                        </span>
                      </p>
                    )}
                    <small className="text-muted">
                      {formatDistanceToNow(act.timestamp.toDate(), {
                        addSuffix: true,
                      })}
                    </small>
                    <Badge className={`${act.role} ms-2`} bg="none">
                      {act.role}
                    </Badge>
                  </div>
                  <div></div>
                </ListGroupItem>
              ))
              .reverse()}
          </ListGroup>
        ) : (
          <small>No activity has been logged for this Budget.</small>
        )}
      </div>
    </Container>
  );
};

export default BudgetMain;

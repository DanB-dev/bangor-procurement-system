import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

import {
  Badge,
  Button,
  Container,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { Avatar } from '../../components/avatar/Avatar';
import { useCollection } from '../../hooks/useCollection';
import expandMore from '../../assets/expandMore.svg';
import expandLess from '../../assets/expandLess.svg';
import { Link } from 'react-router-dom';

const BudgetMain = ({ budget }) => {
  const { documents } = useCollection('events', ['budgetId', '==', budget.id]);
  const [data, setData] = useState([]);
  const [sortActivity, setSortActivity] = useState('desc');
  useEffect(() => {
    if (documents) {
      const options = [];
      documents.forEach((document) => {
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
  }, [setData, documents]);

  return (
    <Container fluid>
      <h3>{budget.name}</h3>
      <h5>
        Created by {budget.createdBy.displayName} | Code: {budget.code}
      </h5>
      <Button variant="outline-secondary">Delete</Button>
      <hr />
      <div>
        <div className="d-flex flex-row justify-content-between">
          <h6 className={`mt-3`}>Activity ({data.length})</h6>

          {sortActivity === 'desc' ? (
            <Button
              size="sm"
              variant="text"
              className="ps-3 hover"
              onClick={() => setSortActivity('asc')}
            >
              Descending
              <img
                className="text-center"
                src={expandMore}
                alt="sorting_desc"
              />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="text"
              className="ps-3 hover"
              onClick={() => setSortActivity('desc')}
            >
              Ascending
              <img className="text-center" src={expandLess} alt="sorting_asc" />
            </Button>
          )}
        </div>

        {data && data.length > 0 ? (
          <ListGroup
            className="mt-4"
            style={{ maxHeight: 400, overflowY: 'scroll' }}
          >
            {data
              .sort((a, b) =>
                sortActivity === 'desc'
                  ? a.createdAt.toDate() > b.createdAt.toDate()
                    ? 1
                    : -1
                  : a.createdAt.toDate() < b.createdAt.toDate()
                  ? 1
                  : -1
              )
              .map((act) => (
                <ListGroupItem
                  key={act.uid + act.by.displayName}
                  className="mb-1"
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size={'40px'} src={act.by.photoURL} />

                    {act.event === 'created' && (
                      <p className="ms-2 me-auto">
                        {act.by.displayName} - {act.event} budget:{' '}
                        <span className="fw-bold">{budget.code}</span>
                      </p>
                    )}
                    {(act.event === 'Added Holder' ||
                      act.event === 'Removed Holder') && (
                      <p className="ms-2 me-auto">
                        {act.by.displayName} -{' '}
                        <span className="text-capitalize">{act.event}</span>:
                        <span className="fw-bold"> {act.holder}</span>
                      </p>
                    )}
                    {(act.event === 'placed' || act.event === 'cancelled') && (
                      <p className="ms-2 me-auto">
                        {act.by.displayName} -{' '}
                        <span className="text-capitalize">
                          {act.event} Order
                        </span>
                        :{' '}
                        <Link
                          to={`/orders/${act.orderId}`}
                          className="fw-bold btn-link"
                        >
                          {act.orderId}
                        </Link>
                      </p>
                    )}
                    <small className="text-muted">
                      {formatDistanceToNow(act.createdAt.toDate(), {
                        addSuffix: true,
                      })}
                    </small>
                    <Badge
                      className={`${act.by.role.replace(/ /g, '')} ms-2`}
                      bg="none"
                    >
                      <span className="text-capitalize">{act.by.role}</span>
                    </Badge>
                  </div>
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

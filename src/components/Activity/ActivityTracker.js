// General Imports
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { sortDate } from '../../utils/sortDate';

// Components
import { Avatar } from '../avatar/Avatar';
import { Badge, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

// Styles & Images
import expandMore from '../../assets/expandMore.svg';
import expandLess from '../../assets/expandLess.svg';
import activityTypes from './ActivityTypes';

const ActivityTracker = ({ activity, budget }) => {
  const [sortActivity, setSortActivity] = useState('desc');

  return activity && activity.length > 0 ? (
    <>
      <div className="d-flex flex-row justify-content-between">
        <h6 className={`mt-3`}>Activity ({activity.length})</h6>

        {sortActivity === 'desc' ? (
          <Button
            size="sm"
            variant="text"
            className="ps-3 hover"
            onClick={() => setSortActivity('asc')}
          >
            Descending
            <img className="text-center" src={expandMore} alt="sorting_desc" />
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
      <ListGroup
        className="mt-4"
        style={{ maxHeight: 400, overflowY: 'scroll' }}
      >
        {activity
          .sort((a, b) => sortDate(a.createdAt, b.createdAt, sortActivity))
          .map((act) => {
            let body = activityTypes(act, budget);
            return (
              <ListGroupItem
                key={act.uid + act.by.displayName}
                className="mb-1"
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size={'40px'} src={act.by.photoURL} />
                  {body}
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
            );
          })
          .reverse()}
      </ListGroup>
    </>
  ) : (
    <small>No activity has been logged for this Budget.</small>
  );
};

export default ActivityTracker;

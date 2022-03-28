import React from 'react';
import { Link } from 'react-router-dom';

const activityTypes = (activity, budget) => {
  let body = null;
  switch (activity.event) {
    case 'created':
      body = (
        <p className="ms-2 me-auto">
          {activity.by.displayName} - {activity.event} budget:{' '}
          <span className="fw-bold">{budget.code}</span>
        </p>
      );
      break;
    case 'placed':
    case 'cancelled':
      body = (
        <p className="ms-2 me-auto">
          {activity.by.displayName} -{' '}
          <span className="text-capitalize">{activity.event} Order</span>:{' '}
          <Link to={`/orders/${activity.orderId}`} className="fw-bold btn-link">
            {activity.orderId}
          </Link>
        </p>
      );
      break;
    case 'Added Holder':
    case 'Removed Holder':
      body = (
        <p className="ms-2 me-auto">
          {activity.by.displayName} -{' '}
          <span className="text-capitalize">{activity.event}</span>:
          <span className="fw-bold"> {activity.holder}</span>
        </p>
      );
      break;
    default:
      body = <p>Unknown activity</p>;
      break;
  }
  return body;
};

export default activityTypes;

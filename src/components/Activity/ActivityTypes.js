import React from 'react';

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
    case 'edited':
    case 'accepted':
    case 'authorised':
    case 'cancelled':
    case 'completed':
      body = (
        <p className="ms-2 me-auto">
          {activity.by.displayName} -{' '}
          <span className="text-capitalize">{activity.event} Order</span>:{' '}
          <span className="fw-bold btn-link">{activity.orderId}</span>
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
    case 'ordered':
      body = (
        <p className="ms-2 me-auto">
          {activity.by.displayName} - Marked Items as{' '}
          <span className="text-capitalize">{activity.event}</span> for:{' '}
          <span to={`/orders/${activity.orderId}`} className="fw-bold btn-link">
            {activity.orderId}
          </span>
        </p>
      );
      break;
    case 'delivered':
      body = (
        <p className="ms-2 me-auto">
          Items have been delivered to the Requisitions Officer.
        </p>
      );
      break;
    default:
      body = (
        <p className="ms-2 me-auto">
          {activity.by.displayName} - Unknown Activity
        </p>
      );
      break;
  }
  return body;
};

export default activityTypes;

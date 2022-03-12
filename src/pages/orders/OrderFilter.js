import React from 'react';
import { Nav } from 'react-bootstrap';

const filterList = [
  { value: 'all', label: 'All' },
  { value: 'orderPlaced', label: 'Order Placed' },
  { value: 'actionNeeded', label: 'Action Needed' },
  { value: 'awaitingAuth', label: 'Awaiting Authorisation' },
  { value: 'ordered', label: 'Order Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'complete', label: 'Complete' },
];

const OrderFilter = ({ currentFilter, changeFilter }) => {
  //Change the current filter when the user clicks the button
  const handleClick = (newFilter) => {
    changeFilter(newFilter);
  };

  return (
    <div className={`project-filter`}>
      <Nav>
        {filterList.map((f) => (
          <button
            key={f.value}
            onClick={() => handleClick(f.value)}
            className={`btn ${f.value === currentFilter ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </Nav>
    </div>
  );
};

export default OrderFilter;

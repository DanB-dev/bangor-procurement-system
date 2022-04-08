import React from 'react';
import { Nav } from 'react-bootstrap';

const Filter = ({ currentFilter, changeFilter, filterList }) => {
  //Change the current filter when the user clicks the button
  const handleClick = (newFilter) => {
    changeFilter(newFilter);
  };
  return (
    <div className={`project-filter`}>
      <Nav>
        {filterList.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleClick(value)}
            className={`btn ${value === currentFilter ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </Nav>
    </div>
  );
};

export default Filter;

import React from 'react';
import Filter from '../../components/filter/Filter';

const filterList = [
  { value: 'all', label: 'All' },
  { value: 'User', label: 'User' },
  { value: 'Budget Holder', label: 'Budget Holder' },
  { value: 'Finance Officer', label: 'Finance Officer' },
  {
    value: 'School Requisitions Officer',
    label: 'School Requisitions Officer',
  },
  { value: 'Admin', label: 'Admin' },
];

const UserFilter = ({ currentFilter, changeFilter }) => {
  return (
    <Filter
      currentFilter={currentFilter}
      changeFilter={changeFilter}
      filterList={filterList}
    />
  );
};

export default UserFilter;

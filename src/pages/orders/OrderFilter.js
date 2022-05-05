import React from 'react';
import { useTranslation } from 'react-i18next';
import Filter from '../../components/filter/Filter';

const OrderFilter = ({ currentFilter, changeFilter }) => {
  const { t } = useTranslation('common');

  const filterList = [
    { value: 'all', label: t('order.filterList.all') },
    { value: 'orderPlaced', label: t('order.filterList.orderPlaced') },
    { value: 'accepted', label: t('order.filterList.accepted') },
    { value: 'authorised', label: t('order.filterList.awaitingAuth') },
    { value: 'ordered', label: t('order.stat.ordered') },
    { value: 'complete', label: t('order.filterList.complete') },
  ];

  return (
    <Filter
      currentFilter={currentFilter}
      changeFilter={changeFilter}
      filterList={filterList}
    />
  );
};

export default OrderFilter;

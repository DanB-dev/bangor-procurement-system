import React from 'react';
import { useTranslation } from 'react-i18next';
import Filter from '../../components/filter/Filter';

const OrderFilter = ({ currentFilter, changeFilter }) => {
  const { t } = useTranslation('common');

  const filterList = [
    { value: 'all', label: t('order.filterList.all') },
    { value: 'orderPlaced', label: t('order.filterList.orderPlaced') },
    { value: 'actionNeeded', label: t('order.filterList.actionNeeded') },
    { value: 'awaitingAuth', label: t('order.filterList.awaitingFinal') },
    { value: 'ordered', label: t('order.filterList.ordered') },
    { value: 'shipped', label: t('order.filterList.shipped') },
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

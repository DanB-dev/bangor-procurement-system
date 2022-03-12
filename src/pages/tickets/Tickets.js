import React from 'react';
import { useTheme } from '../../hooks/useTheme';

import './Tickets.css';

export const Tickets = () => {
  const { mode } = useTheme();

  return (
    <div>
      <h2 className={`page-title ${mode}`}>Tickets</h2>
    </div>
  );
};

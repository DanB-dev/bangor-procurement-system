import React from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory } from 'react-router-dom';

//Styles & Images
import './Sidebar.css';
import DashboardIcon from '../../assets/dashboard_icon.svg';
import AddIcon from '../../assets/add_icon.svg';
import Ticket from '../../assets/ticket.svg';
import Budget from '../../assets/budget.svg';
import User from '../../assets/user.svg';
import { Avatar } from '../avatar/Avatar';

export const Sidebar = () => {
  const { mode } = useTheme();
  const { user } = useAuthContext();
  const { t } = useTranslation('common');
  const history = useHistory();

  return (
    <div className={`sidebar ${mode}`}>
      <div className="sidebar-content mb-auto">
        <div
          className="user pointer"
          onClick={() => history.push(`/profile/${user.uid}`)}
        >
          {/* Stuff goes here */}
          <Avatar src={user.photoURL} />
          <p>{t('sidebar.title', { displayName: user.displayName })}</p>
        </div>

        <nav className="links">
          <ul>
            <li>
              <NavLink to="/" exact>
                <img src={DashboardIcon} alt="dashboard icon" />
                <span>{t('sidebar.links.dashboard')}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders">
                <img src={Ticket} alt="add project icon" />
                <span>{t('sidebar.links.orders')}</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/createOrder">
                <img src={AddIcon} alt="add project icon" />
                <span>{t('sidebar.links.newOrder')}</span>
              </NavLink>
            </li>
            {user.role === 'Admin' && (
              <>
                <li>
                  <NavLink to="/budgets">
                    <img src={Budget} alt="add project icon" />
                    <span>{t('sidebar.links.budgets')}</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/users">
                    <img src={User} alt="users icon" />
                    <span>{t('sidebar.links.users')}</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div style={{ position: 'fixed', bottom: 5, left: 20 }}>
        {t('sidebar.footer')}
      </div>
    </div>
  );
};

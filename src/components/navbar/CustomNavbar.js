//General Imports
import React from 'react';
import { Link } from 'react-router-dom';

//Custom Hookes
import { useLogout } from '../../hooks/useLogout';
import { useAuthContext } from '../../hooks/useAuthContext';

//Language Support
import { useTranslation } from 'react-i18next';

//Styles & Images
import './Navbar.css';
import Logo from '../../assets/logo.svg';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';

export const CustomNavbar = () => {
  const { user } = useAuthContext();
  const [t, i18n] = useTranslation('common');
  const { logout, isPending } = useLogout();

  return (
    <Navbar>
      <Container fluid>
        <Navbar.Brand>
          <img
            src={Logo}
            width="80"
            height="80"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />{' '}
          {t('customNavbar.brand')}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          />
          {i18n.language === 'cy' ? (
            <Button variant="link" onClick={() => i18n.changeLanguage('en')}>
              English
            </Button>
          ) : (
            <Button variant="link" onClick={() => i18n.changeLanguage('cy')}>
              Cymraeg
            </Button>
          )}

          {user && (
            <>
              {!isPending && (
                <Button variant="outline-primary" onClick={logout}>
                  {t('customNavbar.logout.logout')}
                </Button>
              )}
              {isPending && (
                <Button variant="outline-primary" disabled>
                  {t('customNavbar.logout.loggingOut')}
                </Button>
              )}
            </>
          )}
          {!user && (
            <>
              <Link to="/login">{t('customNavbar.login')}</Link>
              <Link to="/signup">{t('customNavbar.signup')}</Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

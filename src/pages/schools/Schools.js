import React from 'react';

import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import CreateSchool from './CreateSchool';
import SchoolsTable from './SchoolsTable';

const Schools = () => {
  const { t } = useTranslation('common');
  return (
    <Container fluid>
      <Row>
        <h2 className="page-title mb-2">{t('sidebar.links.schools')}</h2>
        <Col>
          <SchoolsTable />
        </Col>
        <Col sm={12} md={12} lg={4} xl={3}>
          <CreateSchool />
        </Col>
      </Row>
    </Container>
  );
};

export default Schools;

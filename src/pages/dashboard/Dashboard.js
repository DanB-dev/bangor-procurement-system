import { useAuthContext } from '../../hooks/useAuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { Container, Alert } from 'react-bootstrap';

export const Dashboard = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthContext();
  const error = '';
  return (
    <div className="dashboard">
      {error && (
        <Container>
          <Alert variant="danger">{error}</Alert>
        </Container>
      )}
      {(!user.telNo || !user.roomNo) && (
        <Container>
          <Alert variant="warning">
            <Alert.Heading>
              {t('alerts.dashboard.missingInfo.header')} &#40;
              <u>
                {!user.roomNo && !user.telNo
                  ? t('alerts.dashboard.missingInfo.both')
                  : (!user.roomNo && t('alerts.dashboard.missingInfo.room')) ||
                    (!user.telNo && t('alerts.dashboard.missingInfo.phone'))}
              </u>
              &#41;
            </Alert.Heading>
            {t('alerts.dashboard.missingInfo.prefix')}{' '}
            <Link to={`/profile/${user.uid}`}>
              {' '}
              {t('alerts.dashboard.missingInfo.link')}
            </Link>{' '}
            <b>{t('alerts.dashboard.missingInfo.before')}</b>{' '}
            {t('alerts.dashboard.missingInfo.suffix')}
          </Alert>
        </Container>
      )}
    </div>
  );
};

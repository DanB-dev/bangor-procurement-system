import { useAuthContext } from '../../hooks/useAuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { Container, Alert, Button, Badge } from 'react-bootstrap';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';

const Dashboard = () => {
  const { t } = useTranslation('common');
  const { user } = useAuthContext();
  const [userNotifications, error] = useCollection('userNotifications', [
    'forUser',
    '==',
    user.uid,
  ]);
  const [departmentNotifications] = useCollection(
    'departmentNotifications',
    user.role !== 'Admin' && ['for', '==', user.role]
  );
  const [, deleteUserNotification] = useFirestore('userNotifications');

  const handleDeleteNotification = (id) => {
    deleteUserNotification(id);
  };

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
      <Container>
        <h4 className="mb-2">
          Individual Notifications{' '}
          {userNotifications && <Badge>{userNotifications.length}</Badge>}
        </h4>
        {userNotifications && userNotifications.length > 0 ? (
          <>
            {userNotifications.map((n) => (
              <Alert key={n.id} variant="light" className="d-flex flex-row ">
                <div style={{ lineHeight: '210%' }}>
                  {n.event === 'ordered' ? (
                    <>
                      Items have been <b className="text-info">Ordered</b> for
                      Order <u>{n.orderId}</u>
                    </>
                  ) : (
                    <>
                      {' '}
                      Order <u>{n.orderId}</u> was{' '}
                      <b
                        className={
                          n.event === 'denied'
                            ? 'text-danger'
                            : n.event === 'completed'
                            ? 'text-success'
                            : 'text-info'
                        }
                      >
                        {n.event}
                      </b>{' '}
                      by {n.by.displayName}{' '}
                    </>
                  )}
                </div>
                <Button
                  className="ms-auto"
                  variant="outline-primary"
                  onClick={() => handleDeleteNotification(n.id)}
                >
                  Mark As Read
                </Button>
              </Alert>
            ))}
          </>
        ) : (
          <p>You don't have any notifications at the moment.</p>
        )}
        <br />
        <h4 className="mb-2">
          Department Notifications{' '}
          {departmentNotifications && (
            <Badge>{departmentNotifications.length}</Badge>
          )}
        </h4>
        {departmentNotifications && departmentNotifications.length > 0 ? (
          <>
            {departmentNotifications.map((d) => (
              <Alert key={d.id} variant="light" className="d-flex flex-row ">
                <div style={{ lineHeight: '210%' }}>
                  Order <u>{d.orderId}</u> was{' '}
                  <b className="text-success">{d.event}</b> by{' '}
                  {d.by.displayName} and is waiting to be authorized.
                </div>
                <Button
                  as={Link}
                  to={`/orders/${d.orderId}`}
                  className="ms-auto"
                  variant="outline-primary"
                >
                  View
                </Button>
              </Alert>
            ))}
          </>
        ) : (
          <p>There are no notifications for your department.</p>
        )}
      </Container>
    </div>
  );
};
export default Dashboard;

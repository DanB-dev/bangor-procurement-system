import { useAuthContext } from '../../hooks/useAuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { Container, Alert } from 'react-bootstrap';

export const Dashboard = () => {
  const { user } = useAuthContext();
  const { mode } = useTheme();
  const error = '';
  return (
    <div className="project-content">
      <h2 className={`page-title ${mode}`}>Dashboard</h2>
      {error && (
        <Container>
          <Alert variant="danger">{error}</Alert>
        </Container>
      )}
      {(!user.telNo || !user.roomNo) && (
        <Container>
          <Alert variant="warning">
            <Alert.Heading>
              Looks like your profile is missing some key information. &#40;
              <u>
                {!user.roomNo && !user.telNo
                  ? 'A Telephone Number, and a Room Number'
                  : (!user.roomNo && 'A Room Number') ||
                    (!user.telNo && 'A Telephone Number')}
              </u>
              &#41;
            </Alert.Heading>
            Please add this information to{' '}
            <Link to={`/profile/${user.uid}`}> Your Profile</Link> <b>before</b>{' '}
            creating any orders if required.
          </Alert>
        </Container>
      )}
    </div>
  );
};

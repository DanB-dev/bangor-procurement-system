import { Badge, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Avatar } from '../avatar/Avatar';
import './ProjectList.css';

export const ProjectList = ({ projects, mode, layout }) => {
  return (
    <Container className={`project-list ${layout} ${mode}`}>
      {projects.length === 0 && (
        <p style={{ margin: '0 auto' }}>
          No Tickets found. Want to{' '}
          <Link to="/create" className="link">
            add one?
          </Link>
        </p>
      )}
      {projects.map((project) => (
        <Link to={`/tickets/${project.id}`} key={project.id}>
          <div style={{ display: 'flex', direction: 'row' }}>
            <h4>{project.name}</h4>
            <Badge className={`${project.status}`} bg="none">
              {String(project.status).toUpperCase()}
            </Badge>
          </div>
          <p>{project.details.substring(0, 250)}...</p>
          <div className="assigned-to">
            <ul>
              {project.assignedUsersList.length > 0 ? (
                project.assignedUsersList.map(({ photoURL, displayName }) => (
                  <li key={photoURL} className="tooltip">
                    <Avatar src={photoURL} />

                    <span className="tooltiptext">{displayName}</span>
                  </li>
                ))
              ) : (
                <small>No one Assigned Yet</small>
              )}
            </ul>
          </div>
        </Link>
      ))}
    </Container>
  );
};

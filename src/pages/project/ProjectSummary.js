import React, { useEffect, useState } from 'react';
import { Avatar } from '../../components/avatar/Avatar';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useHistory } from 'react-router-dom';
import { useCollection } from '../../hooks/useCollection';
import Select from 'react-select';

export const ProjectSummary = ({ project }) => {
  const history = useHistory();
  const { documents } = useCollection('users');
  const { user } = useAuthContext();
  const [users, setUsers] = useState([]);
  const { updateDocument, deleteDocument } = useFirestore('projects');
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);

  const handleClick = (type) => {
    switch (type) {
      case 'complete':
        updateDocument(project.id, { status: 'completed' });
        history.push('/');
        break;
      case 'delete':
        deleteDocument(project.id);
        history.push('/');
        break;
      case 'update':
        updateDocument(project.id, {
          assignedUsersList: [
            ...project.assignedUsersList,
            ...assignedUsers.map(({ value: { displayName, photoURL, id } }) => {
              return {
                displayName,
                photoURL,
                id,
              };
            }),
          ],
        });
        setAssignedUsers('');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (user.tech) {
      setAssignedToMe(true);
    }
    if (documents) {
      const options = [];
      documents.forEach((u) => {
        if (
          u.tech &&
          !project.assignedUsersList.find(({ id }) => id === u.uid)
        ) {
          options.push({ value: u, label: u.displayName });
        }
      });
      setUsers(options);
    }
  }, [documents, project.assignedUsersList, user.tech]);

  return (
    <div>
      <div className="project-summary">
        <div style={{ display: 'flex' }}>
          <h2 className="page-title">{project.name}</h2>
          <span className={`badge ${project.status}`}>
            {String(project.status).toUpperCase()}
          </span>
        </div>
        <p>By {project.createdBy.displayName}</p>
        <p className="details">{project.details}</p>
        <h4>Ticket Assignees: </h4>
        <div className="assigned-users">
          {project.assignedUsersList.length > 0 ? (
            project.assignedUsersList.map((user) => (
              <div key={user.id} className="tooltip">
                <Avatar src={user.photoURL} />

                <span className="tooltiptext">{user.displayName}</span>
              </div>
            ))
          ) : (
            <small>No one Assigned Yet</small>
          )}
        </div>
      </div>
      {assignedToMe && (
        <>
          <div className="options">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleClick('update');
              }}
            >
              <span>Assign:</span>
              <label>
                <Select
                  options={users}
                  onChange={(option) => setAssignedUsers(option)}
                  isMulti
                  value={assignedUsers}
                  styles={{
                    control: (control) => ({
                      ...control,
                      borderRadius: '4px 0 0 4px',
                      borderWidth: 2,
                      height: 41,
                      borderRight: '0',
                    }),
                  }}
                />
              </label>
              <button className="btn">Add</button>
            </form>
          </div>
          <div className="btn-group">
            <button className="btn" onClick={() => handleClick('complete')}>
              Mark Complete
            </button>
            <button className="btn" onClick={() => handleClick('delete')}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Container, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { Avatar } from '../../components/avatar/Avatar';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import Close from '../../assets/close.svg';

const TicketSide = ({ ticket }) => {
  const { user } = useAuthContext();
  const { documents } = useCollection('users');
  const { updateDocument } = useFirestore('projects');
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [assignedToMe, setAssignedToMe] = useState(false);

  useEffect(() => {
    if (user.tech) {
      setAssignedToMe(true);
    }
    if (documents) {
      const options = [];
      documents.forEach((u) => {
        if (
          u.tech &&
          !ticket.assignedUsersList.find(({ id }) => id === u.uid)
        ) {
          options.push({ value: u, label: u.displayName });
        }
      });
      setUsers(options);
    }
  }, [documents, ticket.assignedUsersList, user.tech]);

  const handleClick = () => {
    updateDocument(ticket.id, {
      assignedUsersList: [
        ...ticket.assignedUsersList,
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
  };

  const handleRemove = (id) => {
    updateDocument(ticket.id, {
      assignedUsersList: ticket.assignedUsersList.filter((u) => {
        return u.id !== id;
      }),
    });
  };

  return (
    <Container>
      <Badge className={`${ticket.status}`} bg="none">
        {String(ticket.status).toUpperCase()}
      </Badge>
      <br />
      Created{' '}
      {formatDistanceToNow(ticket.createdAt.toDate(), {
        addSuffix: true,
      })}
      <hr />
      <h6 className="mt-3">Assignees</h6>
      {ticket.assignedUsersList.length > 0 ? (
        ticket.assignedUsersList.map((user) => (
          <div key={user.id} style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar size={'40px'} src={user.photoURL} />{' '}
            <span className="ms-2">{user.displayName}</span>
            <img
              src={Close}
              className="close"
              onClick={() => handleRemove(user.id)}
            />
          </div>
        ))
      ) : (
        <small>No one Assigned Yet</small>
      )}
      {assignedToMe && (
        <InputGroup style={{ width: '100%' }}>
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
                width: '300px',
              }),
            }}
          />
          <Button onClick={handleClick}>Add</Button>
        </InputGroup>
      )}
      <hr />
    </Container>
  );
};

export default TicketSide;

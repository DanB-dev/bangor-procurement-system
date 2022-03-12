import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Button, Container, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { Avatar } from '../../components/avatar/Avatar';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import Close from '../../assets/close.svg';

const BudgetSide = ({ budget }) => {
  const { user } = useAuthContext();
  const { documents } = useCollection('users');
  const { updateDocument } = useFirestore('budgets');
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [assignedToMe, setAssignedToMe] = useState(false);

  useEffect(() => {
    if (user.role === 'admin') {
      setAssignedToMe(true);
    }
    if (documents) {
      const options = [];
      documents.forEach((u) => {
        if (u.tech && !budget.holders.find(({ id }) => id === u.uid)) {
          options.push({ value: u, label: u.displayName });
        }
      });
      setUsers(options);
    }
  }, [documents, budget.holders, user.role]);

  const handleClick = () => {
    updateDocument(budget.id, {
      holders: [
        ...budget.holders,
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
    updateDocument(budget.id, {
      assignedUsersList: budget.assignedUsersList.filter((u) => {
        return u.id !== id;
      }),
    });
  };

  return (
    <Container>
      Created{' '}
      {formatDistanceToNow(budget.createdAt.toDate(), {
        addSuffix: true,
      })}
      <hr />
      <h6 className="mt-3">Budget Holders</h6>
      {budget.holders.length > 0 ? (
        budget.holders.map((user) => (
          <div
            key={user.id}
            style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}
          >
            <Avatar size={'40px'} src={user.photoURL} />{' '}
            <span className="ms-2">{user.displayName}</span>
            <img
              src={Close}
              className="close"
              alt="Close"
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

export default BudgetSide;

import { formatDistanceToNow } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Container, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import { Avatar } from '../../components/avatar/Avatar';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import Close from '../../assets/close.svg';
import { useHistory } from 'react-router-dom';

const BudgetSide = ({ budget }) => {
  const { user } = useAuthContext();
  const { documents } = useCollection('users');
  const [, , updateDocumentRemoveHolder, responseRemoveHolder] =
    useFirestore('budgets');
  const [, , updateDocumentAddHolder, responseAddHolder] =
    useFirestore('budgets');
  const [_addEvent, , , eventResponse] = useFirestore('events');
  const addEventReference = useRef(_addEvent);
  const addEvent = addEventReference.current;
  const holder = useRef();

  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [assignedToMe, setAssignedToMe] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (user.role === 'Admin') {
      setAssignedToMe(true);
    }
    if (documents) {
      const options = [];
      documents.forEach((u) => {
        if (
          u.role === 'Admin' &&
          !budget.holders.find(({ id }) => id === u.uid)
        ) {
          options.push({ value: u, label: u.displayName });
        }
      });
      setUsers(options);
    }
  }, [documents, budget.holders, user.role]);

  const handleClick = () => {
    updateDocumentAddHolder(budget.id, {
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
    let users = [];
    holder.current = assignedUsers.forEach(({ value: { displayName } }, i) => {
      console.log(i + '/' + assignedUsers.length);
      users.push(
        assignedUsers.length > i + 1 ? displayName + ', ' : displayName
      );
    });
    holder.current = users;
    setAssignedUsers('');
  };

  useEffect(() => {
    if (responseAddHolder.success) {
      addEvent({
        type: 'budget',
        event: 'Added Holder',
        holder: holder.current,
        by: {
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          role: user.role,
        },
        budgetId: responseAddHolder.id,
      });
    }
  }, [
    addEvent,
    responseAddHolder.id,
    responseAddHolder.success,
    user.displayName,
    user.photoURL,
    user.role,
    user.uid,
  ]);
  useEffect(() => {
    if (responseRemoveHolder.success) {
      addEvent({
        type: 'budget',
        event: 'Removed Holder',
        holder: holder.current,
        by: {
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          role: user.role,
        },
        budgetId: responseRemoveHolder.id,
      });
    }
  }, [
    addEvent,
    responseRemoveHolder.id,
    responseRemoveHolder.success,
    user.displayName,
    user.photoURL,
    user.role,
    user.uid,
  ]);

  const handleRemove = (id, displayName) => {
    updateDocumentRemoveHolder(budget.id, {
      holders: budget.holders.filter((u) => {
        return u.id !== id;
      }),
    });
    holder.current = displayName;
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
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
              }}
              className="hover p-1 m-0"
            >
              <Avatar size={'40px'} src={user.photoURL} />{' '}
              <span
                className="mx-2"
                onClick={() => history.push(`/profile/${user.id}`)}
              >
                {user.displayName}
              </span>
              <img
                src={Close}
                className="close"
                alt="Close"
                onClick={() => handleRemove(user.id, user.displayName)}
              />
            </div>
          </div>
        ))
      ) : (
        <small>No one Assigned Yet</small>
      )}
      {assignedToMe && (
        <InputGroup style={{ width: '100%', marginTop: '10px' }}>
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
      {eventResponse.error && (
        <Alert variant="danger">{eventResponse.error}</Alert>
      )}
      {responseRemoveHolder.error && (
        <Alert variant="danger">{responseRemoveHolder.error}</Alert>
      )}
      {responseAddHolder.error && (
        <Alert variant="danger">{responseAddHolder.error}</Alert>
      )}
    </Container>
  );
};

export default BudgetSide;

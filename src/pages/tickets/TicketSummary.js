import { formatDistanceToNow } from 'date-fns';
import { timestamp } from '../../firebase/config';
import React, { useState } from 'react';
import {
  Badge,
  Button,
  Container,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import { Avatar } from '../../components/avatar/Avatar';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';

const TicketSummary = ({ ticket }) => {
  const [newComment, setNewComment] = useState('');
  const { updateDocument, response } = useFirestore('projects');
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const commentToAdd = {
      displayName: user.displayName,
      tech: user.tech,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random(),
    };
    await updateDocument(ticket.id, {
      comments: [...ticket.comments, commentToAdd],
      status: user.tech ? 'answered' : 'member-reply',
    });
    if (!response.error) {
      setNewComment('');
    }
  };

  return (
    <Container fluid>
      <h3>{ticket.name}</h3>
      <h5 className="text-capitalize">
        By {ticket.createdBy.displayName} | Category: {ticket.category}
      </h5>
      <Button variant="secondary">Mark Complete</Button>{' '}
      <Button variant="secondary">Upload</Button>{' '}
      <Button variant="secondary">Delete</Button>
      <hr />
      <div style={{ maxHeight: 650, overflowY: 'scroll' }}>
        <h5 className="mt-3">Details</h5>
        <p>{ticket.details}</p>
        <hr />
        {!ticket.completed && (
          <form className="add-comment" onSubmit={handleSubmit}>
            <textarea
              required
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
              placeholder="I'm a Response..."
            ></textarea>
            <Button type="submit" variant="primary" className="align-right">
              Add Response
            </Button>
          </form>
        )}
        <h6 className="mt-3">Responses</h6>
        {ticket.comments.length > 0 ? (
          <ListGroup className="mt-4">
            {ticket.comments
              .map((comment) => (
                <ListGroupItem key={comment.id} className="mb-1">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar size={'40px'} src={comment.photoURL} />
                    <p className="mx-2">{comment.displayName}</p>
                    <small className="text-muted me-auto">
                      {formatDistanceToNow(comment.createdAt.toDate(), {
                        addSuffix: true,
                      })}
                    </small>
                    <Badge
                      className={comment.tech ? 'tech' : 'member'}
                      bg="none"
                    >
                      {comment.tech ? 'Tech' : 'Member'}
                    </Badge>
                  </div>
                  <div>
                    <p>{comment.content}</p>
                  </div>
                </ListGroupItem>
              ))
              .reverse()}
          </ListGroup>
        ) : (
          <small>
            No responses yet. A member of Tech will get back to you ASAP.
          </small>
        )}
      </div>
    </Container>
  );
};

export default TicketSummary;

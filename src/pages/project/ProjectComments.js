import { useState } from 'react';
import { Avatar } from '../../components/avatar/Avatar';
import { timestamp } from '../../firebase/config';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export const ProjectComments = ({ project }) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthContext();
  const { updateDocument, response } = useFirestore('projects');

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
    await updateDocument(project.id, {
      comments: [...project.comments, commentToAdd],
      status: user.tech ? 'answered' : 'member-reply',
    });
    if (!response.error) {
      setNewComment('');
    }
  };
  return (
    <div className="project-comments">
      <h4>Ticket Responses</h4>
      {project.comments.length > 0 ? (
        <div className="comments">
          <ul>
            {project.comments
              .map((comment) => (
                <li key={comment.id}>
                  <div className="comment-author">
                    <Avatar src={comment.photoURL} />
                    <p style={{ marginRight: 'auto' }}>{comment.displayName}</p>
                    <span
                      className={`badge ${comment.tech ? 'tech' : 'member'}`}
                    >
                      {comment.tech ? 'Tech' : 'Member'}
                    </span>
                  </div>

                  <div className="comment-date">
                    <p>
                      {formatDistanceToNow(comment.createdAt.toDate(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="comment-content">
                    <p>{comment.content}</p>
                  </div>
                </li>
              ))
              .reverse()}
          </ul>
        </div>
      ) : (
        <small>
          No responses yet. A member of Tech will get back to you ASAP.
        </small>
      )}
      {!project.completed && (
        <form className="add-comment" onSubmit={handleSubmit}>
          <label>
            <span>Add Response:</span>
            <textarea
              required
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
              placeholder="I'm a Response..."
            ></textarea>
          </label>
          <button className="btn">Add Response</button>
        </form>
      )}
    </div>
  );
};

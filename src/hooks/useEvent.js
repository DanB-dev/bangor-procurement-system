import { useEffect, useReducer, useState } from 'react';
import { projectFirestore, timestamp } from '../firebase/config';
import { documentReducer, initialState } from '../utils/documentReducer';

export const useEvent = () => {
  const [response, dispatch] = useReducer(documentReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  const ref = projectFirestore.collection('events');

  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  const addEvent = async (event) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const createdAt = timestamp.fromDate(new Date());
      const payload = await ref.add({
        ...event,
        createdAt,
      });
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload });
    } catch (err) {
      dispatchIfNotCancelled({
        type: 'ERROR',
        payload: err.message,
      });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addEvent, response };
};

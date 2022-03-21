import { useReducer, useEffect, useState } from 'react';
import { projectFirestore, timestamp } from '../firebase/config';
import { documentReducer, initialState } from '../utils/documentReducer';

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(documentReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  let ref = projectFirestore.collection(collection);

  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  const addDocument = async (doc, query) => {
    dispatch({ type: 'IS_PENDING' });

    if (query) {
      let check = await ref.where(...query).get();
      if (!check.empty) {
        dispatchIfNotCancelled({
          type: 'ERROR',
          payload: 'A budget with this code already exists.',
        });
        throw new Error('A budget with this code already exists.');
      }
    }
    try {
      const payload = await ref.add({
        ...doc,
        createdAt: timestamp.fromDate(new Date()),
      });
      dispatchIfNotCancelled({
        type: 'ADDED_DOCUMENT',
        payload,
      });
    } catch (err) {
      dispatchIfNotCancelled({
        type: 'ERROR',
        payload: err.message,
      });
      throw new Error('There was an error!');
    }
  };

  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({
        type: 'DELETED_DOCUMENT',
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
      throw new Error(err.message);
    }
  };

  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING' });

    try {
      const updateDocument = await ref.doc(id).update(updates);
      dispatchIfNotCancelled({
        type: 'UPDATED_DOCUMENT',
        payload: { ...updateDocument, id },
      });
      return updateDocument;
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return [addDocument, deleteDocument, updateDocument, response];
};

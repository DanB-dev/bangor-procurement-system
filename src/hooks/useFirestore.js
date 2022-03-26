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

  const addDocument = async (doc, query) =>
    new Promise(async (resolve, reject) => {
      try {
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
          resolve({ doc, payload: payload.id }); // if the request was sent, mark as resolved.
        } catch (err) {
          dispatchIfNotCancelled({
            type: 'ERROR',
            payload: err.message,
          });
          reject(err.message);
        }
      } catch (err) {
        dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        reject(err.message); // if there was any error reject the promise, notifying the user the email could not be sent.
      }
    });
  const deleteDocument = async (id) =>
    new Promise(async (resolve, reject) => {
      dispatch({ type: 'IS_PENDING' });
      if (id === null) {
        throw new Error('The Id Was null');
      }
      try {
        await ref.doc(id).delete();
        dispatchIfNotCancelled({
          type: 'DELETED_DOCUMENT',
        });
        resolve(id);
      } catch (err) {
        dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        reject(err.message);
      }
    });

  const updateDocument = async (id, updates) =>
    new Promise(async (resolve, reject) => {
      dispatch({ type: 'IS_PENDING' });
      try {
        const updateDocument = await ref.doc(id).update(updates);
        dispatchIfNotCancelled({
          type: 'UPDATED_DOCUMENT',
          payload: { ...updateDocument, id },
        });
        resolve({ budget: updates.budget, payload: id });
        return updateDocument;
      } catch (err) {
        dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        reject(err.message);
      }
    });

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return [addDocument, deleteDocument, updateDocument, response];
};

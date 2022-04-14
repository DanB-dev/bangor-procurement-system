import { useEffect, useReducer, useState } from 'react';
import { projectAuth } from '../firebase/config';
import { documentReducer, initialState } from '../utils/documentReducer';
export const usePasswordReset = () => {
  const [response, dispatch] = useReducer(documentReducer, initialState);

  const [isCancelled, setIsCancelled] = useState(false);

  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // Using a promise to track the status of the request in order to keep the user informed
  const resetPassword = async (email, displayName) =>
    new Promise(async (resolve, reject) => {
      try {
        await projectAuth.sendPasswordResetEmail(email);
        dispatchIfNotCancelled({
          type: 'PASSWORD_RESET',
          payload: { email, displayName },
        }); // letting our event handler know that the user requested a password reset.
        resolve('Success!'); // if the request was sent, mark as resolved.
      } catch (err) {
        dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
        reject(err.message); // if there was any error reject the promise, notifying the user the email could not be sent.
      }
    });

  //Cleanup all async functions. If the function is unmounted, the function will not attempt to dispatch notifications.
  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { resetPassword, response };
};

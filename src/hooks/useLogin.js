import { useEffect, useState } from 'react';
import {
  projectAuth,
  projectFirestore,
  projectPersistence,
} from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      let response = await projectAuth
        .setPersistence(projectPersistence.Auth.Persistence.SESSION)
        .then(() => {
          return projectAuth.signInWithEmailAndPassword(email, password);
        });

      if (!response) {
        throw new Error('Could not fetch the user account');
      }

      const userdocs = projectFirestore
        .collection('users')
        .doc(response.user.uid);

      const info = await userdocs.get();
      await userdocs.update({ online: true });

      dispatch({
        type: 'LOGIN',
        payload: { ...response.user, ...info.data() },
      });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.error(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      setIsCancelled(true);
    };
  }, []);

  return { login, isPending, error };
};

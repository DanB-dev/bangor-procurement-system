import { useEffect, useState } from 'react';
import {
  projectAuth,
  projectStorage,
  projectFirestore,
  projectPersistence,
} from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (displayName, email, password, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      let response = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      if (!response) {
        throw new Error('Could not create user');
      }
      await projectAuth
        .setPersistence(projectPersistence.Auth.Persistence.SESSION)
        .then(() => {
          return projectAuth.signInWithEmailAndPassword(email, password);
        });

      const img = await projectStorage
        .ref(`thumbnails/${response.user.uid}/${thumbnail.name}`)
        .put(thumbnail);

      const photoURL = await img.ref.getDownloadURL();

      await response.user.updateProfile({ displayName, photoURL });

      await projectFirestore.collection('users').doc(response.user.uid).set({
        online: true,
        displayName,
        photoURL,
        uid: response.user.uid,
        roomNo: '',
        telNo: '',
        role: 'user',
      });

      dispatch({ type: 'LOGIN', payload: response.user });

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

  return { error, isPending, signup };
};

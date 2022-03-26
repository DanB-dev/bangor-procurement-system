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
      let photoURL;
      if (thumbnail !== undefined) {
        const img = await projectStorage
          .ref(`thumbnails/${response.user.uid}/${thumbnail.name}`)
          .put(thumbnail);
        photoURL = await img.ref.getDownloadURL();
      } else {
        photoURL =
          'https://firebasestorage.googleapis.com/v0/b/bangor-procurement-system.appspot.com/o/thumbnails%2Fuser-default.png?alt=media&token=83b10c3b-335e-44b2-931a-03c689fbc217';
      }

      await projectAuth
        .setPersistence(projectPersistence.Auth.Persistence.SESSION)
        .then(() => {
          return projectAuth.signInWithEmailAndPassword(email, password);
        });

      await response.user.updateProfile({ displayName, photoURL });

      await projectFirestore.collection('users').doc(response.user.uid).set({
        online: true,
        displayName,
        photoURL,
        uid: response.user.uid,
        roomNo: '',
        telNo: '',
        role: 'User',
      });

      dispatch({ type: 'LOGIN', payload: response.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
        return 'success!';
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

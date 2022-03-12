import { createContext, useEffect, useReducer } from 'react';
import { projectAuth, projectFirestore } from '../firebase/config';

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_IS_READY':
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const userdocs = await projectFirestore
          .collection('users')
          .doc(user.uid)
          .get();

        dispatch({
          type: 'AUTH_IS_READY',
          payload: { ...user, ...userdocs.data() },
        });
      } else {
        dispatch({ type: 'AUTH_IS_READY', payload: null });
      }

      unsub();
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

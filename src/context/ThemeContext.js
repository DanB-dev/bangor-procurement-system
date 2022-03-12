import { createContext, useReducer } from 'react';

export const ThemeContext = createContext();

const themeReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_BACKGROUND':
      return { ...state, background: action.payload };
    case 'CHANGE_MODE':
      return { ...state, mode: action.payload };
    default:
      return state;
  }
};

export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    background: '#2094bf',
    mode: 'light',
  });

  const changeBackground = (background) => {
    dispatch({ type: 'CHANGE_BACKGROUND', payload: background });
  };

  const changeMode = (mode) => {
    dispatch({ type: 'CHANGE_MODE', payload: mode });
  };

  return (
    <ThemeContext.Provider value={{ ...state, changeBackground, changeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

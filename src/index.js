//General Imports
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//Custom Context
import { AuthContextProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

//Language Support
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import common_en from './translations/en/common.json';
import common_cy from './translations/cy/common.json';

//Styling
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en', // language to use
  resources: {
    en: {
      common: common_en, // 'common' is our custom namespace
    },
    cy: {
      common: common_cy, // 'common' is our custom namespace
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </I18nextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

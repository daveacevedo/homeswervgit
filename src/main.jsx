import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { HomeownerProvider } from './contexts/HomeownerContext';
import { ProviderProvider } from './contexts/ProviderContext';
import { AppProvider } from './contexts/AppContext';

// Use createRoot API without StrictMode to reduce potential issues
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <HomeownerProvider>
      <ProviderProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ProviderProvider>
    </HomeownerProvider>
  </AuthProvider>
);

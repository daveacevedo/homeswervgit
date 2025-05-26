import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Use createRoot API without StrictMode to reduce potential issues
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

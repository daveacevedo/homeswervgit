import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupAdminUser } from './utils/setupAdminUser';

// Set up the admin user on application start
setupAdminUser().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

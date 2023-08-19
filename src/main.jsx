import React from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'; // Import components from react-router-dom
import { createRoot } from 'react-dom/client';

import Form from './Form.jsx';
import Login from '../components/Login.jsx';
import AdminView from '../components/AdminView.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Form" element={<Form />} />
        <Route path="/Admin" element={<AdminView />} />
        <Route path="/" element={<Navigate to="/Login" />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

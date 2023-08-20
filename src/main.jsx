import React from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'; // Import components from react-router-dom
import { createRoot } from 'react-dom/client';
import Login from '../components/pages/Login.jsx';
import AdminView from '../components/pages/AdminView.jsx';
import scheduleRefresh from '../components/refreshFunction.js';
import HomePage from '../components/pages/HomePage.jsx';


function App() {

  scheduleRefresh()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/HomePage" element={<HomePage />} userType="USER" />
        <Route path="/Admin" element={<AdminView />} userType="ADMIN" />
        <Route path="/" element={<Navigate to="/Login" />} />
      </Routes>
    </BrowserRouter>
  );
}

const root  = createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)




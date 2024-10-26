import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './components/AdminPage.js';
import Medicine from './components/Medicine.js';
import PendingMedicines from './components/PendingMeds.js';
import './App.css';
import User from './components/User';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/medicine" element={<Medicine />} />
        <Route path="/admin/pendingmeds" element={<PendingMedicines />} />
        <Route path="/Userpage" element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './components/AdminPage.js';
import Medicine from './components/Medicine.js';
import PendingMedicines from './components/PendingMeds.js';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">        
        {/* Define Routes */}
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/medicine" element={<Medicine />} />
          <Route path="/admin/pendingmeds" element={<PendingMedicines />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

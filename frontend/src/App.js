import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import User from './components/User'; // Import the User component

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Link to="/Userpage" className="App-link">
            Go to User Page
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/Userpage" element={<User />} /> {/* Route to User component */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

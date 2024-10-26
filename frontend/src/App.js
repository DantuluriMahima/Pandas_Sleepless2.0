import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { renderUI } from './components/User'; // Import renderUI from user.js


function App() {
  useEffect(() => {
    renderUI();
  }, []); // Empty dependency array to call renderUI only once on mount

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

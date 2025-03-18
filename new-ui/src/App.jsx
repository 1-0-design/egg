import React from 'react';
import { Content } from './components/Content';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Egg AI Assistant</h1>
      </header>
      <Content />
    </div>
  );
}

export default App;
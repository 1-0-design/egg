import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserWindow } from './components';
import './styles/egg/index.css';

// Create a container for our React app
const container = document.createElement('div');
container.id = 'react-root';
document.body.appendChild(container);

// Render the BrowserWindow component
ReactDOM.render(
  <React.StrictMode>
    <BrowserWindow />
  </React.StrictMode>,
  container
);
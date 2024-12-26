import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the new createRoot API
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './styles/App.css';

// Create the root element using ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

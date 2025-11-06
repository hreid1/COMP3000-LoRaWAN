// main.jsx -> mounts react app to DOM

/*

Application structure

Home page -> Login -> Dashboard

*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)

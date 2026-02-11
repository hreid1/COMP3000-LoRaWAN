// main.jsx -> mounts react app to DOM

/*

Application structure

Home page -> Login -> Dashboard

*/

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Devices from './pages/Devices/Devices';
import Dashboard from './pages/Dashboard/Dashboard';
import Logs from './pages/Logs/Logs'
import AIinfo from './pages/AI/AIinfo';
import Maps from './pages/Maps/Maps';

const router = createBrowserRouter([
    { path:"/", element:<App/>},
    { path:"/devices", element:<Devices/>},
    { path:"/dashboard", element:<Dashboard/>},
    { path:"/logs", element:<Logs/>},
    { path:"/aiinfo", element:<AIinfo/>},
    { path:"/map", element:<Maps/>},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

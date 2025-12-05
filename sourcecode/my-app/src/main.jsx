// main.jsx -> mounts react app to DOM

/*

Application structure

Home page -> Login -> Dashboard

*/

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import profile from './pages/profile/Profile'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Devices from './pages/devices/Devices';
import Dashboard from './pages/dashboard/Dashboard'
import Logs from './pages/logs/Logs'

const router = createBrowserRouter([
    { path:"/", element:<App/>},
    { path:"/profile", element:<Profile/>},
    { path:"/settings", element:<Settings/>},
    { path:"/devices", element:<Devices/>},
    { path:"/dashboard", element:<Dashboard/>},
    { path:"/logs", element:<Logs/>}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

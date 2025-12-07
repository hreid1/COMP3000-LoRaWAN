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

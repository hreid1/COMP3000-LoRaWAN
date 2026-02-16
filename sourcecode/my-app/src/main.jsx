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
import Anomaly from './pages/Anomaly/Anomaly';
import Admin from './pages/Admin/admin';
import MainLayout from './layouts/MainLayout';

const router = createBrowserRouter([
    { path: "/", element: <App /> },
    {
        element: <MainLayout />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/devices", element: <Devices /> },
            { path: "/logs", element: <Logs /> },
            { path: "/aiinfo", element: <AIinfo /> },
            { path: "/map", element: <Maps /> },
            { path: "/anomaly", element: <Anomaly /> },
            { path: "/admin", element: <Admin /> }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);

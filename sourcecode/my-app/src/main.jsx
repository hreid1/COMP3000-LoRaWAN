// main.jsx -> mounts react app to DOM

/*

Application structure

Home page -> Login -> Dashboard

*/

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Devices from './pages/Devices/Devices';
import Dashboard from './pages/Dashboard/Dashboard';
import Logs from './pages/Logs/Logs'
import AIinfo from './pages/AI/AIinfo';
import Anomaly from './pages/Anomaly/Anomaly';
import Admin from './pages/Admin/Admin';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login/Login';

import { AuthProvider } from '../context/AuthContext'

const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/login", element: <Login />},
    {
        element: <MainLayout />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/devices", element: <Devices /> },
            { path: "/logs", element: <Logs /> },
            { path: "/aiinfo", element: <AIinfo /> },
            { path: "/anomaly", element: <Anomaly /> },
            { path: "/admin", element: <Admin /> },
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>
);

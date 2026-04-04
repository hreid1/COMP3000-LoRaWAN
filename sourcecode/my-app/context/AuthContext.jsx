import React, { createContext, useState, useEffect} from 'react'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext()

export default AuthContext

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser]= useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')): null)
    const baseURL = import.meta.env.VITE_API_BASE_URL

    let loginUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${baseURL}token/`, {
                username: e.target.username.value,
                password: e.target.password.value
            }, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 200) {
                setAuthTokens(response.data);
                setUser(jwtDecode(response.data.access));
                localStorage.setItem("authTokens", JSON.stringify(response.data));
                return true;
            }
        } catch (error) {
            console.error(error.response?.data);
            alert("Invalid credentials");
            return false;
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )

}
import React, { createContext, useState, useEffect} from 'react'
import axios from 'axios'
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext()

export default AuthContext

export const Authorisation = ({children}) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL
    const [authToken, setAuthToken] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    )
    const [user, setUser] = useState(() =>
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    )

    const loginUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${baseURL}token/`, {
                username: e.target.username.value,
                password: e.target.password.value
            }, {
                headers: { "Content-Type": "application/json"}
            })
            // If a token is returned add that token to local storage
            if(response.status === 200){
                const tokens = response.data
                setAuthToken(tokens)
                localStorage.setItem("authTokens", JSON.stringify(tokens))

                // Fetch users details
                const userDetailsResponse = await axios.get(`${baseURL}lorawan/users/me/`, {
                    headers: { 'Authorization': `Bearer ${tokens.access}`}
                })

                // Add user's details to context window
                if (userDetailsResponse.status === 200){
                    setUser(userDetailsResponse.data)
                    localStorage.setItem("user", JSON.stringify(userDetailsResponse.data))
                    return true
                }
            }
        } catch(err){
            console.error(err)
            return false
        }
    }

    const logoutUser = async (e) => {
        setAuthToken(null)
        localStorage.removeItem("authTokens")
        setUser(null)
        localStorage.removeItem("user")

    }

    const contextData = {
        user: user,
        authToken: authToken,
        loginUser: loginUser,
        logoutUser: logoutUser,
    }

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

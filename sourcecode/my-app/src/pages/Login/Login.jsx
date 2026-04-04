import React, { useContext } from 'react'
import AuthContext from '../../../context/AuthContext'
import { useNavigate } from "react-router-dom"

const Login = () => {
    const { loginUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        // e.preventDefault() happens here
        const success = await loginUser(e)
        if (success) {
            navigate("/dashboard") // Use navigate here instead of in AuthContext
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div>
                    <input type="text" name="username" placeholder='Enter Username' required />
                </div>
                <div>
                    <input type="password" name="password" placeholder='Enter Password' required />
                </div>
                <input type="submit" value="Login" /> 
            </form>
        </div>
    )
}

export default Login
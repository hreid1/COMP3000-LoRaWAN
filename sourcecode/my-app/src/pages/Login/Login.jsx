import React, { useContext, useState } from 'react'
import AuthContext from '../../../context/AuthContext'
import { useNavigate } from "react-router-dom"
import { Box, Typography, Paper, TextField, Button, Container, Alert} from "@mui/material"

const Login = () => {
    const { loginUser } = useContext(AuthContext)
    const navigate = useNavigate()
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        const success = await loginUser(e)
        if (success) {
            navigate("/dashboard") 
        } else {
            setError("Invalid username or password")
        }
    }
    return (
        <Box 
            sx={{
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5' 
            }}
        >
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    {error && (
                        <Alert severity='error'>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ }}
                        >
                           Signup 
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default Login
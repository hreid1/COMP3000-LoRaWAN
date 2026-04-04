import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + 'lorawan/' 
})

api.interceptors.request.use((config) => {
    const tokens = JSON.parse(localStorage.getItem('authTokens'))
    if (tokens?.access){
        config.headers.Authorization = `Bearer ${tokens.access}`
    }
    return config
})

export default api
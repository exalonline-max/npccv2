import axios from 'axios'

// Frontend will use VITE_API_URL when provided (e.g. in Vercel env). Fallback
// to localhost for local development.
const baseURL = import.meta.env.VITE_API_URL || (process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5000')

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		config.headers = config.headers || {}
		config.headers['Authorization'] = 'Bearer ' + token
	}
	return config
})

export default api

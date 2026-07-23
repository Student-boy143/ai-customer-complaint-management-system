import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'

/**
 * Shared Axios instance for all API requests.
 * Configured with base URL, JSON headers, and request/response interceptors.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor — attach auth tokens or logging here in future milestones
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// Response interceptor — normalize error handling across the app
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ?? error.message ?? 'An unexpected error occurred'
    return Promise.reject(new Error(message))
  },
)

export default api

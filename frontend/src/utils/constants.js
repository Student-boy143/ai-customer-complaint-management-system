/**
 * Application-wide constants.
 * Centralizes configuration values used across the frontend.
 */

export const APP_NAME = 'AI Complaint Management System'

/** Base URL for the FastAPI backend */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

/** Application route paths */
export const ROUTES = {
  HOME: '/',
  COMPLAINTS: '/complaints',
  NEW_COMPLAINT: '/new-complaint',
}

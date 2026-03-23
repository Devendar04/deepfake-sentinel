// Centralized API config — set VITE_API_BASE in .env to override for production
export const API_BASE = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8000";
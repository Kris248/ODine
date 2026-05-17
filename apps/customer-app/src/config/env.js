const BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "http://192.168.1.6:5000";

export const API_URL = import.meta.env.VITE_API_URL || `${BASE_URL}/api`;
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

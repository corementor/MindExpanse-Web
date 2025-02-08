import axios from "axios";

const API_BASE_URL = "https://mind-expanse.onrender.com  /api/problems";

// Create an Axios instance with base URL and default headers
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

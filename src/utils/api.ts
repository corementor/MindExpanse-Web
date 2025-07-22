// import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api/v1";

// // Create an Axios instance with base URL and default headers
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

const API_BASE_URL = "http://localhost:8080/api/math/addition"; // Adjust this to your actual API URL

const API_ENDPOINTS = {
  GENERATE: `${API_BASE_URL}/generateArray`,
  VERIFY: `${API_BASE_URL}/verify-all-with-carries`,
};

export default API_ENDPOINTS;

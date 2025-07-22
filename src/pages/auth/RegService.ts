import axios, { AxiosError } from "axios";
import { environment } from "../../environment/environment";

const API_URL = `${environment.API}/auth`;

// Define the request payload type
interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Define the expected response type
interface RegisterUserResponse {
  message: string; // Assuming the backend returns a message field
}

class RegistrationService {
  async RegisterUser(
    userData: RegisterUserRequest
  ): Promise<RegisterUserResponse> {
    try {
      const response = await axios.post<RegisterUserResponse>(
        `${API_URL}/signup`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check for Axios error
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response) {
          // Throw error message from backend, if available
          throw new Error(
            axiosError.response.data?.message || "Registration failed."
          );
        }
      }
      // Re-throw non-Axios errors
      throw new Error("An unexpected error occurred.");
    }
  }
}

export default new RegistrationService();

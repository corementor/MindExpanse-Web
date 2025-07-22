import { httpClient } from "./httpClient";
import { environment } from "../environment/environment";
const API_MATH_URL = `${environment.API}/math/addition`;
interface GenerateArrayParams {
  rows: number;
  cols: number;
  min: number;
  max: number;
}

interface VerifyAnswer {
  number1: number;
  number2: number;
  answer: number;
  carries: {
    tens: number;
    hundreds: number;
    thousands: number;
  };
}

interface VerifyResponse {
  results: string[];
  score: number;
  percentage: number;
  maxScore: number;
  total: number;
  correctCarries: Array<{
    tens: number;
    hundreds: number;
    thousands: number;
  }>;
  carryValidation: Array<{
    tensCorrect: boolean;
    hundredsCorrect: boolean;
    thousandsCorrect: boolean;
  }>;
}

class MathService {
  public async generateArray(params: GenerateArrayParams): Promise<number[][]> {
    return httpClient.get<number[][]>(`${API_MATH_URL}/generateArray`, {
      params,
    });
  }

  public async verifyAnswers(answers: VerifyAnswer[]): Promise<VerifyResponse> {
    return httpClient.post<VerifyResponse>(
      `${API_MATH_URL}/verify-all-with-carries`,
      answers
    );
  }
}

export const mathService = new MathService();

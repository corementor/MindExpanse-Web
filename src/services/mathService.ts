// @ts-ignore
import { httpClient } from "@/services/httpClient";
import { environment } from "../environment/environment";
const API_MATH_URL = `${environment.API}/math`;
interface DivisionQuestion {
  number1: number;
  number2: number;
}
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

interface VerifySubtractionAnswer {
  number1: number;
  number2: number;
  answer: number;
  borrows: {
    // Changed from 'carries' to 'borrows'
    tens: number;
    hundreds: number;
    thousands: number;
  };
}

interface VerifySubtractionResponse {
  results: string[];
  score: number;
  percentage: number;
  maxScore: number;
  total: number;
  correctBorrows: Array<{
    // Changed from 'correctCarries'
    tens: number;
    hundreds: number;
    thousands: number;
  }>;
  borrowValidation: Array<{
    // Changed from 'carryValidation'
    tensCorrect: boolean;
    hundredsCorrect: boolean;
    thousandsCorrect: boolean;
  }>;
}

interface VerifyMultiplicationAnswer {
  number1: number;
  number2: number;
  answer: number;
  carries: {
    carryOnesToTens: number;
    carryTensToHundreds: number;
  };
  partialProducts: {
    partialProduct1: number;
    partialProduct2: number;
    partialProduct3: number;
  };
}

interface VerifyMultiplicationResponse {
  results: string[];
  score: number;
  percentage: number;
  maxScore: number;
  total: number;
  correctCarries: Array<{
    carryOnesToTens: number;
    carryTensToHundreds: number;
  }>;
  carryValidation: Array<{
    carryOnesToTensCorrect: boolean;
    carryTensToHundredsCorrect: boolean;
  }>;
  correctPartialProducts: Array<{
    partialProduct1: number;
    partialProduct2: number;
    partialProduct3: number;
  }>;
}
interface VerifyDivisionAnswer {
  number1: number;
  number2: number;
  answer: number;
  remainder: number;
  steps: {
    step1?: number;
    step2?: number;
    step3?: number;
  };
  intermediateRemainders: {
    remainder1?: number;
    remainder2?: number;
    remainder3?: number;
  };
}

interface VerifyDivisionResponse {
  results: string[];
  score: number;
  percentage: number;
  maxScore: number;
  total: number;
  correctSteps: Array<{
    step1?: number;
    step2?: number;
    step3?: number;
  }>;
  correctRemainders: Array<{
    remainder1?: number;
    remainder2?: number;
    remainder3?: number;
  }>;
  stepValidation: Array<{
    step1Correct?: boolean;
    step2Correct?: boolean;
    step3Correct?: boolean;
    remainder1Correct?: boolean;
    remainder2Correct?: boolean;
    remainder3Correct?: boolean;
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
  public async verifySubtractionAnswers(
    answers: VerifySubtractionAnswer[]
  ): Promise<VerifySubtractionResponse> {
    return httpClient.post<VerifySubtractionResponse>(
      `${API_MATH_URL}/verify-subtractions`,
      answers
    );
  }
  public async verifyMultiplicationAnswers(
    answers: VerifyMultiplicationAnswer[]
  ): Promise<VerifyMultiplicationResponse> {
    return httpClient.post<VerifyMultiplicationResponse>(
      `${API_MATH_URL}/verify-multiplication`,
      answers
    );
  }
  public async generateDivisionQuestions(
    count: number,
    min: number,
    max: number
  ): Promise<DivisionQuestion[]> {
    return httpClient.get<DivisionQuestion[]>(
      `${API_MATH_URL}/generate-division?count=${count}&min=${min}&max=${max}`
    );
  }
  public async verifyDivisionAnswers(
    answers: VerifyDivisionAnswer[]
  ): Promise<VerifyDivisionResponse> {
    return httpClient.post<VerifyDivisionResponse>(
      `${API_MATH_URL}/verify-division`,
      answers
    );
  }
}

export const mathService = new MathService();

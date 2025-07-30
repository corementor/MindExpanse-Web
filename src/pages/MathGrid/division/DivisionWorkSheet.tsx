import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Settings, ArrowLeft } from "lucide-react";

interface Question {
  number1: number; // Dividend
  number2: number; // Divisor
  userAnswer: string[]; // Array of digits for the answer
  remainderAnswer: string; // Remainder
  workingRows: Array<{
    digits: string[];
  }>;
  intermediateRemainders: string[];
  isCorrect?: boolean;
  stepsCorrect?: boolean;
  stepValidation?: {
    step1Correct?: boolean;
    step2Correct?: boolean;
    step3Correct?: boolean;
    remainder1Correct?: boolean;
    remainder2Correct?: boolean;
    remainder3Correct?: boolean;
  };
}

interface UserPreferences {
  complexity: "with-remainder" | "without-remainder";
  numberOfDigits: "1-digit" | "2-digit" | "mixed";
  numberOfQuestions: number;
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

// Mock math service
const mockMathService = {
  verifyDivisionAnswers: async (
    answers: VerifyDivisionAnswer[]
  ): Promise<VerifyDivisionResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const results = answers.map((answer) => {
      const correctAnswer = Math.floor(answer.number1 / answer.number2);
      const correctRemainder = answer.number1 % answer.number2;

      const answerCorrect = answer.answer === correctAnswer;
      const remainderCorrect = answer.remainder === correctRemainder;

      if (answerCorrect && remainderCorrect) {
        return "Perfect! Answer and remainder are correct.";
      } else if (answerCorrect) {
        return "Answer correct, but remainder is wrong.";
      } else {
        return "Answer is incorrect.";
      }
    });

    const correctCount = results.filter((r) => r.includes("Perfect")).length;
    const percentage = Math.round((correctCount / answers.length) * 100);

    return {
      results,
      score: correctCount,
      percentage,
      maxScore: answers.length,
      total: answers.length,
      correctSteps: answers.map(() => ({ step1: 0, step2: 0, step3: 0 })),
      correctRemainders: answers.map(() => ({
        remainder1: 0,
        remainder2: 0,
        remainder3: 0,
      })),
      stepValidation: answers.map(() => ({
        step1Correct: true,
        step2Correct: true,
        step3Correct: true,
        remainder1Correct: true,
        remainder2Correct: true,
        remainder3Correct: true,
      })),
    };
  },
};

// Mock question generator
const generateQuestion = (preferences: UserPreferences): Question => {
  let divisor: number;
  let dividend: number;

  if (preferences.numberOfDigits === "1-digit") {
    divisor = Math.floor(Math.random() * 8) + 2; // 2-9
  } else if (preferences.numberOfDigits === "2-digit") {
    divisor = Math.floor(Math.random() * 90) + 10; // 10-99
  } else {
    divisor =
      Math.random() < 0.5
        ? Math.floor(Math.random() * 8) + 2
        : Math.floor(Math.random() * 90) + 10;
  }

  if (preferences.complexity === "without-remainder") {
    const quotient = Math.floor(Math.random() * 900) + 100; // 100-999
    dividend = quotient * divisor;
  } else {
    dividend = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
  }

  return {
    number1: dividend,
    number2: divisor,
    userAnswer: Array(4).fill(""),
    remainderAnswer: "",
    workingRows: Array(3)
      .fill(null)
      .map(() => ({ digits: Array(4).fill("") })),
    intermediateRemainders: Array(3).fill(""),
    isCorrect: undefined,
    stepsCorrect: undefined,
    stepValidation: {},
  };
};

const PreferenceSelection: React.FC<{
  onPreferencesSelected: (preferences: UserPreferences) => void;
}> = ({ onPreferencesSelected }) => {
  const [complexity, setComplexity] = useState<
    "with-remainder" | "without-remainder"
  >("with-remainder");
  const [numberOfDigits, setNumberOfDigits] = useState<
    "1-digit" | "2-digit" | "mixed"
  >("1-digit");
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(4);

  const handleStartWorksheet = () => {
    onPreferencesSelected({ complexity, numberOfDigits, numberOfQuestions });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl my-8">
        <div className="text-center mb-6">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Division Worksheet Preferences
          </h1>
          <p className="text-gray-600">
            Customize your division practice experience
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              🎯 Division Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  complexity === "without-remainder"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => setComplexity("without-remainder")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800">Exact Division</h4>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      complexity === "without-remainder"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {complexity === "without-remainder" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Problems that divide evenly with no remainder
                </p>
                <div className="bg-gray-50 p-2 rounded-lg font-mono text-center">
                  <div> 24 ÷ 6 = 4</div>
                </div>
              </div>
              <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  complexity === "with-remainder"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setComplexity("with-remainder")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800">
                    Division with Remainder
                  </h4>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      complexity === "with-remainder"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {complexity === "with-remainder" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Problems that result in a remainder
                </p>
                <div className="bg-gray-50 p-2 rounded-lg font-mono text-center">
                  <div> 25 ÷ 6 = 4 R1</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              🔢 Divisor Difficulty
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(["1-digit", "2-digit", "mixed"] as const).map((digits) => (
                <div
                  key={digits}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md text-center ${
                    numberOfDigits === digits
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => setNumberOfDigits(digits)}
                >
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      numberOfDigits === digits
                        ? "text-purple-600"
                        : "text-gray-700"
                    }`}
                  >
                    {digits === "1-digit"
                      ? "1-digit"
                      : digits === "2-digit"
                      ? "2-digit"
                      : "Mixed"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {digits === "1-digit"
                      ? "Divisors 2-9"
                      : digits === "2-digit"
                      ? "Divisors 10-99"
                      : "Mix of 1 & 2-digit divisors"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              📄 Number of Questions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[4, 6, 8, 10].map((num) => (
                <div
                  key={num}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md text-center ${
                    numberOfQuestions === num
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setNumberOfQuestions(num)}
                >
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      numberOfQuestions === num
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {num}
                  </div>
                  <div className="text-xs text-gray-600">{num} problems</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📋 Your Selection Summary
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Type:</span>{" "}
                {complexity === "with-remainder"
                  ? "With Remainder"
                  : "Exact Division"}
              </p>
              <p>
                <span className="font-semibold">Divisor Difficulty:</span>{" "}
                {numberOfDigits === "1-digit"
                  ? "1-digit divisors"
                  : numberOfDigits === "2-digit"
                  ? "2-digit divisors"
                  : "Mixed difficulty"}
              </p>
              <p>
                <span className="font-semibold">Questions:</span>{" "}
                {numberOfQuestions} problems
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleStartWorksheet}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Start My Worksheet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DivisionWorkSheet: React.FC = () => {
  const [showPreferences, setShowPreferences] = useState(true);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handlePreferencesSelected = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setShowPreferences(false);
    fetchQuestions(preferences);
  };

  const fetchQuestions = async (preferences: UserPreferences) => {
    setLoading(true);
    setError(null);
    setIsSubmitted(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newQuestions = Array.from(
        { length: preferences.numberOfQuestions },
        () => generateQuestion(preferences)
      );

      setQuestions(newQuestions);
      setResults([]);
      setScore(null);
    } catch (err) {
      setError("Unable to generate questions. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerDigitChange = (
    questionIndex: number,
    digitIndex: number,
    value: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].userAnswer[digitIndex] = sanitizedValue;
    setQuestions(updatedQuestions);
  };

  const handleRemainderChange = (questionIndex: number, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].remainderAnswer = sanitizedValue;
    setQuestions(updatedQuestions);
  };

  const handleWorkingDigitChange = (
    questionIndex: number,
    rowIndex: number,
    digitIndex: number,
    value: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].workingRows[rowIndex].digits[digitIndex] =
      sanitizedValue;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const unanswered = questions.filter((q) =>
      q.userAnswer.every((digit) => digit === "")
    );
    if (unanswered.length > 0) {
      setError("Please provide final answers for all questions.");
      setLoading(false);
      return;
    }

    try {
      const answersToVerify: VerifyDivisionAnswer[] = questions.map((q) => ({
        number1: q.number1,
        number2: q.number2,
        answer: parseInt(
          q.userAnswer.filter((a) => a !== "").join("") || "0",
          10
        ),
        remainder: parseInt(q.remainderAnswer || "0", 10),
        steps: {
          step1: parseInt(
            q.workingRows[0]?.digits.filter((d) => d !== "").join("") || "0",
            10
          ),
          step2: parseInt(
            q.workingRows[1]?.digits.filter((d) => d !== "").join("") || "0",
            10
          ),
          step3: parseInt(
            q.workingRows[2]?.digits.filter((d) => d !== "").join("") || "0",
            10
          ),
        },
        intermediateRemainders: {
          remainder1: parseInt(q.intermediateRemainders[0] || "0", 10),
          remainder2: parseInt(q.intermediateRemainders[1] || "0", 10),
          remainder3: parseInt(q.intermediateRemainders[2] || "0", 10),
        },
      }));

      const data = await mockMathService.verifyDivisionAnswers(answersToVerify);

      const updated = questions.map((q, i) => ({
        ...q,
        isCorrect:
          data.results[i].includes("Perfect") ||
          data.results[i].includes("Correct"),
      }));

      setQuestions(updated);
      setResults(data.results);
      setScore(data.score);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error verifying answers:", err);
      setError("An error occurred while verifying answers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (
    question: Question,
    type: "answer" | "working" | "remainder"
  ) => {
    const baseClasses = {
      answer:
        "w-6 h-6 text-lg font-bold text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ",
      working:
        "w-6 h-6 text-sm text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ",
      remainder:
        "w-8 h-6 text-sm text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ",
    };

    if (!isSubmitted) {
      return baseClasses[type] + "border-gray-300";
    }

    return (
      baseClasses[type] +
      (question.isCorrect
        ? "border-green-500 bg-green-50 text-green-700"
        : "border-red-500 bg-red-50 text-red-700")
    );
  };

  if (showPreferences) {
    return (
      <PreferenceSelection onPreferencesSelected={handlePreferencesSelected} />
    );
  }

  return (
    <div className="min-w-[700px] border border-gray-200 rounded-md p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowPreferences(true)}
            className="gap-2 hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Preferences
          </Button>
          <h1 className="text-2xl font-bold">
            {userPreferences?.numberOfDigits === "1-digit"
              ? "Solve Single-Digit Division Questions"
              : userPreferences?.numberOfDigits === "2-digit"
              ? "Solve Two-Digit Division Questions"
              : "Solve Mixed Division Questions"}
          </h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => userPreferences && fetchQuestions(userPreferences)}
          title="Reshuffle Questions"
        >
          <RefreshCcw className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((q, index) => {
              const dividendDigits = String(q.number1).split("");

              return (
                <div
                  key={index}
                  className="relative bg-gray-50 rounded-md p-4 shadow-sm"
                >
                  <span className="absolute top-2 left-2 text-sm text-gray-500 font-semibold">
                    Q.{index + 1}
                  </span>

                  {/* Answer row with individual digit inputs */}
                  <div className="flex justify-start items-center ml-7 gap-1">
                    {[...Array(4)].map((_, digitIndex) => (
                      <input
                        key={digitIndex}
                        type="text"
                        maxLength={1}
                        className={getInputClassName(q, "answer")}
                        value={q.userAnswer[digitIndex]}
                        onChange={(e) =>
                          handleAnswerDigitChange(
                            index,
                            digitIndex,
                            e.target.value
                          )
                        }
                      />
                    ))}
                  </div>

                  <div className="flex items-start">
                    <div className="mr-2 flex flex-col items-center">
                      <span className="text-2xl font-bold">{q.number2}</span>
                    </div>

                    <div className="relative flex-1">
                      <div className="border-b-2 border-black mb-1" />
                      <div className="flex justify-start space-x-2 mb-2">
                        {dividendDigits.map((digit, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 border-b-2 border-gray-400 text-center text-lg font-bold"
                          >
                            {digit}
                          </div>
                        ))}
                      </div>
                      <div className="absolute top-0 left-0 h-full border-l-2 border-black" />
                    </div>
                  </div>

                  <div className="ml-6 mt-2 space-y-2">
                    {q.workingRows.map((_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="flex items-center space-x-1"
                      >
                        <span className="text-lg font-bold">-</span>
                        {[...Array(4)].map((__, digitIndex) => (
                          <input
                            key={digitIndex}
                            type="text"
                            maxLength={1}
                            className={getInputClassName(q, "working")}
                            value={q.workingRows[rowIndex].digits[digitIndex]}
                            onChange={(e) =>
                              handleWorkingDigitChange(
                                index,
                                rowIndex,
                                digitIndex,
                                e.target.value
                              )
                            }
                          />
                        ))}
                      </div>
                    ))}

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-600">
                        R:
                      </span>
                      <input
                        type="text"
                        className={getInputClassName(q, "remainder")}
                        value={q.remainderAnswer}
                        onChange={(e) =>
                          handleRemainderChange(index, e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={handleSubmit} disabled={loading || isSubmitted}>
              {loading ? "Submitting..." : "Submit All"}
            </Button>
          </div>

          {score !== null && (
            <div className="p-4 mt-4 rounded-md text-center text-white font-medium bg-blue-500">
              Your Score: {score}/{questions.length}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Results:</h3>
              <ul className="list-disc pl-6">
                {results.map((res, i) => (
                  <li
                    key={i}
                    className={
                      res.includes("Perfect") || res.includes("Correct")
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    Q{i + 1}: {res}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DivisionWorkSheet;

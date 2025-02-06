import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { RefreshCcw, X, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface Question {
  number1: number;
  number2: number;
  userAnswer: string[];
  carryNumbers: string[];
  partialProducts: string[][]; // 2D array for partial products
  isCorrect?: boolean;
}

const Multiplication: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const num_questions: number = 4;

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "singleDigit";
  const token = localStorage.getItem("token");

  const fetchQuestions = () => {
    setLoading(true);
    setError(null);
    setIsSubmitted(false);
    Promise.all(
      Array.from({ length: num_questions }, () =>
        fetch(`http://localhost:8080/api/math/multiply/generate?type=${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
      )
    )
      .then((data: Question[]) => {
        setQuestions(
          data.map((q) => ({
            ...q,
            userAnswer: Array(6).fill(""), // Array for final answer digits
            carryNumbers: Array(3).fill(""), // Reduced carry numbers
            partialProducts: Array(2)
              .fill(null)
              .map(() => Array(3).fill("")), // Reduced partial products
            isCorrect: undefined,
          }))
        );
        setResults([]);
        setScore(null);
      })
      .catch((error) => {
        setError("Unable to generate questions. Please try again.");
        console.log("Error fetching questions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, [type]);

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

  const handleCarryChange = (
    questionIndex: number,
    carryIndex: number,
    value: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].carryNumbers[carryIndex] = sanitizedValue;
    setQuestions(updatedQuestions);
  };

  const handlePartialProductDigitChange = (
    questionIndex: number,
    rowIndex: number,
    digitIndex: number,
    value: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].partialProducts[rowIndex][digitIndex] =
      sanitizedValue;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    setLoading(true);
    const unansweredQuestions = questions.filter((q) =>
      q.userAnswer.every((digit) => digit === "")
    );
    if (unansweredQuestions.length > 0) {
      setError("Please provide final answers for all questions.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/math/multiply/verify-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        questions.map((q) => ({
          number1: q.number1,
          number2: q.number2,
          answer: parseInt(q.userAnswer.join("") || "0", 10),
        }))
      ),
    })
      .then((response) => response.json())
      .then((data) => {
        const updatedQuestions = questions.map((q, index) => ({
          ...q,
          isCorrect: data.results[index] === "Correct",
        }));
        setQuestions(updatedQuestions);
        setResults(data.results);
        setScore(data.score);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error("Error verifying answers:", error);
        setError(
          "An error occurred while verifying answers. Please try again."
        );
      })
      .finally(() => setLoading(false));
  };

  const getInputClassName = (
    question: Question,
    type: "carry" | "partial" | "final"
  ) => {
    const baseClasses = {
      carry:
        "w-6 h-6 text-sm text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ",
      partial:
        "w-6 h-6 text-sm text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ",
      final:
        "w-6 h-6 text-lg font-bold text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ",
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

  const renderMultiplicationProblem = (question: Question, index: number) => {
    const num1Digits = String(question.number1).padStart(3, " ").split("");
    const num2Digits = String(question.number2).padStart(3, " ").split("");
    const num2Length = String(question.number2).length;

    return (
      <div className="flex flex-col items-end gap-1 min-w-[200px]">
        {/* Carry numbers row */}
        <div className="flex gap-1 h-6">
          {num1Digits.map((_, digitIndex) => (
            <input
              key={digitIndex}
              type="text"
              maxLength={1}
              className={getInputClassName(question, "carry")}
              value={question.carryNumbers[digitIndex]}
              onChange={(e) =>
                handleCarryChange(index, digitIndex, e.target.value)
              }
            />
          ))}
        </div>

        {/* First number */}
        <div className="flex gap-1">
          {num1Digits.map((digit, i) => (
            <span key={i} className="w-6 text-2xl font-bold text-center">
              {digit !== " " ? digit : ""}
            </span>
          ))}
        </div>

        {/* Multiplication operator and second number */}
        <div className="flex items-center gap-1 w-full justify-end">
          <X className="w-6 h-6" />
          <div className="flex gap-1">
            {num2Digits.map((digit, i) => (
              <span key={i} className="w-6 text-2xl font-bold text-center">
                {digit !== " " ? digit : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full border-b-2 border-gray-300 mt-1"></div>

        {/* Partial products with indentation */}
        {question.number2 > 9 && (
          <div className="flex flex-col gap-1 w-full items-end">
            {[...Array(num2Length)].map((_, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {/* Add indentation for second row */}
                {rowIndex === 1 && <div className="w-6" />}
                {[...Array(4)].map((_, digitIndex) => (
                  <input
                    key={digitIndex}
                    type="text"
                    maxLength={1}
                    className={getInputClassName(question, "partial")}
                    value={question.partialProducts[rowIndex][digitIndex]}
                    onChange={(e) =>
                      handlePartialProductDigitChange(
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
            {/* Plus sign and line before final answer */}
            <div className="flex items-center w-full justify-end gap-1">
              <Plus className="w-5 h-5 text-gray-600" />
              <div className="flex-grow border-b border-gray-300"></div>
            </div>
          </div>
        )}

        {/* Final answer as individual digit inputs */}
        <div className="flex gap-1">
          {[...Array(4)].map((_, digitIndex) => (
            <input
              key={digitIndex}
              type="text"
              maxLength={1}
              className={getInputClassName(question, "final")}
              value={question.userAnswer[digitIndex]}
              onChange={(e) =>
                handleAnswerDigitChange(index, digitIndex, e.target.value)
              }
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-w-[700px] border-[1px] border-gray-200 rounded-md p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">
          {type === "singleDigit" ? "Single-Digit" : "Multi-Digit"}{" "}
          Multiplication Practice
        </h1>
        <Button variant="ghost" onClick={fetchQuestions} title="New Questions">
          <RefreshCcw className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 bg-gray-100 p-4 rounded-md relative"
            >
              <span className="absolute top-2 left-2 text-sm text-gray-500 font-semibold">
                Q.{index + 1}
              </span>
              {renderMultiplicationProblem(q, index)}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={handleSubmit}>Submit All</Button>
      </div>

      {score !== null && (
        <div className="p-4 mt-4 rounded-md text-center text-white font-medium bg-blue-500">
          <span>
            Your Score: {score}/{num_questions}
          </span>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Results:</h3>
          <ul className="list-disc pl-6">
            {results.map((result, index) => (
              <li
                key={index}
                className={
                  result.startsWith("Correct")
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                Q{index + 1}: {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Multiplication;

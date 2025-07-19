import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { RefreshCcw, Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface Question {
  number1: number;
  number2: number;
  userAnswer: string;
  carryNumbers: string[];
  partialProducts: string[];
  isCorrect?: boolean;
}

const Addition: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const num_questions: number = 12;

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "singleDigit";
  const token = localStorage.getItem("token");

  const fetchQuestions = () => {
    setLoading(true);
    setError(null);
    setIsSubmitted(false);

    // Determine the parameters based on the question type
    let rows, cols, min, max;
    if (type === "singleDigit") {
      rows = 6; // Will generate 6x2 array (12 questions)
      cols = 2;
      min = 0;
      max = 9;
    } else if (type === "fourDigit") {
      rows = 6; // Will generate 6x2 array (12 questions)
      cols = 2;
      min = 1000;
      max = 9999;
    } else {
      // Default to two-digit numbers
      rows = 6;
      cols = 2;
      min = 10;
      max = 99;
    }

    fetch(
      `http://localhost:8080/api/math/addition/generateArray?rows=${rows}&cols=${cols}&min=${min}&max=${max}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: number[][]) => {
        // Convert the 2D array into questions
        const newQuestions: Question[] = [];
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j += 2) {
            if (j + 1 < data[i].length) {
              newQuestions.push({
                number1: data[i][j],
                number2: data[i][j + 1],
                userAnswer: "",
                carryNumbers: Array(5).fill(""),
                partialProducts: Array(3).fill(""),
                isCorrect: undefined,
              });
            }
          }
        }

        // If we didn't get enough questions, fill the rest with random pairs
        while (newQuestions.length < num_questions) {
          newQuestions.push({
            number1: Math.floor(Math.random() * (max - min + 1)) + min,
            number2: Math.floor(Math.random() * (max - min + 1)) + min,
            userAnswer: "",
            carryNumbers: Array(5).fill(""),
            partialProducts: Array(3).fill(""),
            isCorrect: undefined,
          });
        }

        // Trim to exactly num_questions
        setQuestions(newQuestions.slice(0, num_questions));
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

  const handleAnswerChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    const updatedQuestions = [...questions];
    updatedQuestions[index].userAnswer = sanitizedValue;
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

  const handleSubmit = () => {
    setLoading(true);
    const unansweredQuestions = questions.filter((q) => q.userAnswer === "");
    if (unansweredQuestions.length > 0) {
      setError("Please answer all questions before submitting.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/math/addition/verify-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        questions.map((q) => ({
          number1: q.number1,
          number2: q.number2,
          answer: parseInt(q.userAnswer, 10),
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

  const renderAdditionProblem = (question: Question, index: number) => {
    const num1Digits = String(question.number1).padStart(3, " ").split("");
    const num2Digits = String(question.number2).padStart(3, " ").split("");

    return (
      <div className="flex flex-col items-end gap-1 min-w-[200px]">
        {/* Carry numbers row - Modified to start from second digit */}
        <div className="flex gap-1 h-6">
          <div className="w-6" /> {/* Spacer for rightmost digit */}
          {num1Digits.slice(0, -1).map((_, digitIndex) => (
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

        {/* Addition operator and second number */}
        <div className="flex items-center gap-1 w-full justify-end">
          <Plus className="w-6 h-6" />
          <div className="flex gap-1">
            {num2Digits.map((digit, i) => (
              <span key={i} className="w-6 text-2xl font-bold text-center">
                {digit !== " " ? digit : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full border-b-2 border-gray-300 mt-1"></div>

        {/* Answer input */}
        <input
          type="number"
          className={getInputClassName(question, "final")}
          min="0"
          value={question.userAnswer}
          onChange={(e) => handleAnswerChange(index, e.target.value)}
          required
        />
      </div>
    );
  };

  const getInputClassName = (
    question: Question,
    type: "carry" | "partial" | "final"
  ) => {
    const baseClasses = {
      carry:
        "w-6 h-6 text-sm text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ",
      partial:
        "w-20 h-8 text-lg text-center border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ",
      final: "w-24 text-2xl font-bold text-center border-2 rounded-md px-1 ",
    };

    if (!isSubmitted || question.userAnswer === "") {
      return baseClasses[type] + "border-gray-300";
    }

    return (
      baseClasses[type] +
      (question.isCorrect
        ? "border-green-500 bg-green-50 text-green-700"
        : "border-red-500 bg-red-50 text-red-700")
    );
  };

  return (
    <div className="min-w-[700px] border-[1px] border-gray-200 rounded-md p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">
          {type === "singleDigit"
            ? "Solve Single-Digit Addition Questions"
            : "Solve Two-Digit Addition Questions"}
        </h1>

        <Button
          variant="ghost"
          onClick={fetchQuestions}
          title="Reshuffle Questions"
        >
          <RefreshCcw className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </Button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-whiteTheme-primaryColor border-r-transparent align-[center]"
          role="status"
        >
          <span className="sr-only">Loading...</span>
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
              {renderAdditionProblem(q, index)}
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
                className={`${
                  result.startsWith("Correct")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
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

export default Addition;

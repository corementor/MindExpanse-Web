import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { RefreshCcw, Divide } from "lucide-react";

import { useSearchParams } from "react-router-dom";

interface Question {
  number1: number;
  number2: number;
  userAnswer: string;
  isCorrect?: boolean;
}

const Division: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const num_questions: number = 12;

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "singleDigit";

  const fetchQuestions = () => {
    setLoading(true);
    setError(null);
    setIsSubmitted(false);
    Promise.all(
      Array.from({ length: num_questions }, () =>
        fetch(
          `https://mind-expanse.onrender.com/api/math/division/generate?type=${type}`
        ).then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
      )
    )

      .then((data: Question[]) => {
        setQuestions(
          data.map((q) => ({ ...q, userAnswer: "", isCorrect: undefined }))
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

  const handleAnswerChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    const updatedQuestions = [...questions];
    updatedQuestions[index].userAnswer = sanitizedValue;
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

    fetch(`https://mind-expanse.onrender.com/api/math/division/verify-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  const getInputClassName = (question: Question) => {
    const baseClasses =
      "w-16 text-2xl font-bold text-center border-2 rounded-md px-1 ";

    if (!isSubmitted || question.userAnswer === "") {
      return baseClasses + "border-gray-300";
    }

    return (
      baseClasses +
      (question.isCorrect
        ? "border-green-500 bg-green-50 text-green-700"
        : "border-red-500 bg-red-50 text-red-700")
    );
  };

  return (
    <div className="min-w-[700px] border-[1px] border-gray-200 rounded-md p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        {type === "singleDigit" ? (
          <h1 className="text-2xl font-bold text-center">
            Solve Single-Digit Division Questions
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-center">
            Solve Two-Digit Division Questions
          </h1>
        )}

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
        <div className="grid grid-cols-4 gap-4">
          {questions.map((q, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 bg-gray-100 p-4 rounded-md relative"
            >
              <span className="absolute top-2 left-2 text-sm text-gray-500 font-semibold">
                Q.{index + 1}
              </span>

              <div className="flex flex-col items-end gap-1">
                <span className="text-2xl font-bold">{q.number1}</span>
                <div className="flex items-end gap-1">
                  <Button variant="ghost" className="text-2xl font-bold">
                    <Divide />
                  </Button>
                  <span className="text-2xl font-bold">{q.number2}</span>
                </div>
                {/* to add another input for helping the operation for users */}
                <div className="w-full border-b-2 border-gray-300"></div>
                <input
                  type="number"
                  className={getInputClassName(q)}
                  min="0"
                  value={q.userAnswer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mb-4 mt-4">
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

export default Division;

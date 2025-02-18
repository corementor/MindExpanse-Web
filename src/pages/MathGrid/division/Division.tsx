import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface Question {
  number1: number; // Dividend
  number2: number; // Divisor
  userAnswer: string[]; // Array of digits for the answer
  remainderAnswer: string; // Remainder
  workingRows: Array<{
    digits: string[];
  }>;
  isCorrect?: boolean;
}

const Division: React.FC = () => {
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
        fetch(
          `https://mind-expanse.onrender.com/api/math/division/generate?type=${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
          data.map((q) => ({
            ...q,
            userAnswer: Array(4).fill(""), // Array for individual digits
            remainderAnswer: "",
            // workingRows: Array(3).fill({ digits: Array(4).fill("") }),
            workingRows: Array(3)
              .fill(null)
              .map(() => ({
                digits: Array(4).fill(""),
              })),
            isCorrect: undefined,
          }))
        );
        setResults([]);
        setScore(null);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setError("Unable to generate questions. Please try again.");
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

  const handleSubmit = () => {
    setLoading(true);
    const unanswered = questions.filter((q) =>
      q.userAnswer.every((digit) => digit === "")
    );
    if (unanswered.length > 0) {
      setError("Please provide final answers for all questions.");
      setLoading(false);
      return;
    }

    fetch(`https://mind-expanse.onrender.com/api/math/division/verify-all`, {
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
      .then((res) => res.json())
      .then((data) => {
        const updated = questions.map((q, i) => ({
          ...q,
          isCorrect: data.results[i] === "Correct",
        }));
        setQuestions(updated);
        setResults(data.results);
        setScore(data.score);
        setIsSubmitted(true);
      })
      .catch((err) => {
        console.error("Error verifying answers:", err);
        setError(
          "An error occurred while verifying answers. Please try again."
        );
      })
      .finally(() => setLoading(false));
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

  return (
    <div className="min-w-[700px] border border-gray-200 rounded-md p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {type === "singleDigit"
            ? "Solve Single-Digit Division Questions"
            : "Solve Two-Digit Division Questions"}
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
                  <span className="absolute top-2 left-2 text-sm text-gray-500 font-semibold ">
                    Q.{index + 1}
                  </span>

                  {/* Answer row with individual digit inputs */}
                  <div className="flex justify-start items-center   ml-7 gap-1">
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
                      <div className="border-b-2 border-black mb-1 " />
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
            <Button onClick={handleSubmit}>Submit All</Button>
          </div>

          {score !== null && (
            <div className="p-4 mt-4 rounded-md text-center text-white font-medium bg-blue-500">
              Your Score: {score}/{num_questions}
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
                      res.startsWith("Correct")
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

export default Division;

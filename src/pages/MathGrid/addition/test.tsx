import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileCheck, Plus, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  number1: number;
  number2: number;
  userAnswer: {
    tenThousands: string;
    thousands: string;
    hundreds: string;
    tens: string;
    ones: string;
  };
  carryNumbers: {
    thousands: string; // Carry from hundreds to thousands
    hundreds: string; // Carry from tens to hundreds
    tens: string; // Carry from ones to tens
  };
  isCorrect?: boolean;
  carriesCorrect?: boolean;
  carryValidation?: {
    thousands: boolean;
    hundreds: boolean;
    tens: boolean;
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

const NUM_QUESTIONS = 4;

const TestWorksheet = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  const fetchQuestions = async () => {
    setScore(null);
    setLoading(true);
    setError(null);
    try {
      // Request a 2x2 array since we need pairs of numbers (4 questions total)
      const response = await fetch(
        `http://localhost:8080/api/math/addition/generateArray?rows=4&cols=2&min=1000&max=9999`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data: number[][] = await response.json();

      // Convert the 2D array into question pairs
      const newQuestions: Question[] = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j += 2) {
          if (j + 1 < data[i].length) {
            newQuestions.push({
              number1: data[i][j],
              number2: data[i][j + 1],
              userAnswer: {
                tenThousands: "",
                thousands: "",
                hundreds: "",
                tens: "",
                ones: "",
              },
              carryNumbers: {
                thousands: "",
                hundreds: "",
                tens: "",
              },
              isCorrect: undefined,
              carryValidation: {
                thousands: true,
                hundreds: true,
                tens: true,
              },
            });
          }
        }
      }

      // If we didn't get enough questions, fill the rest with random pairs
      while (newQuestions.length < NUM_QUESTIONS) {
        newQuestions.push({
          number1: Math.floor(Math.random() * 9000) + 1000,
          number2: Math.floor(Math.random() * 9000) + 1000,
          userAnswer: {
            tenThousands: "",
            thousands: "",
            hundreds: "",
            tens: "",
            ones: "",
          },
          carryNumbers: {
            thousands: "",
            hundreds: "",
            tens: "",
          },
          isCorrect: undefined,
          carryValidation: {
            thousands: true,
            hundreds: true,
            tens: true,
          },
        });
      }

      setQuestions(newQuestions.slice(0, NUM_QUESTIONS));
      setShowResults(false);
    } catch (err) {
      setError("Failed to load questions. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerChange = (
    questionIndex: number,
    position: keyof Question["userAnswer"],
    value: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === questionIndex
          ? {
              ...q,
              userAnswer: { ...q.userAnswer, [position]: sanitizedValue },
            }
          : q
      )
    );
  };

  const handleCarryChange = (
    questionIndex: number,
    position: keyof Question["carryNumbers"],
    value: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === questionIndex
          ? {
              ...q,
              carryNumbers: { ...q.carryNumbers, [position]: sanitizedValue },
            }
          : q
      )
    );
  };

  // Calculate correct carries for a given addition
  const calculateCorrectCarries = (num1: number, num2: number) => {
    const digits1 = String(num1)
      .padStart(4, "0")
      .split("")
      .reverse()
      .map(Number);
    const digits2 = String(num2)
      .padStart(4, "0")
      .split("")
      .reverse()
      .map(Number);

    const carries = { tens: 0, hundreds: 0, thousands: 0 };

    // Ones place -> tens carry
    const onesSum = digits1[0] + digits2[0];
    carries.tens = Math.floor(onesSum / 10);

    // Tens place -> hundreds carry
    const tensSum = digits1[1] + digits2[1] + carries.tens;
    carries.hundreds = Math.floor(tensSum / 10);

    // Hundreds place -> thousands carry
    const hundredsSum = digits1[2] + digits2[2] + carries.hundreds;
    carries.thousands = Math.floor(hundredsSum / 10);

    return carries;
  };

  const checkAnswers = async () => {
    setLoading(true);
    setError(null);

    const answersToVerify = questions.map((q) => ({
      number1: q.number1,
      number2: q.number2,
      answer: parseInt(
        `${q.userAnswer.tenThousands || "0"}${q.userAnswer.thousands}${
          q.userAnswer.hundreds
        }${q.userAnswer.tens}${q.userAnswer.ones}` || "0"
      ),
      carries: {
        tens: parseInt(q.carryNumbers.tens || "0"),
        hundreds: parseInt(q.carryNumbers.hundreds || "0"),
        thousands: parseInt(q.carryNumbers.thousands || "0"),
      },
    }));

    try {
      const response = await fetch(
        "http://localhost:8080/api/math/addition/verify-all-with-carries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(answersToVerify),
        }
      );

      if (!response.ok) throw new Error("Failed to verify answers");

      const data: VerifyResponse = await response.json();

      setQuestions((prev) =>
        prev.map((q, idx) => ({
          ...q,
          isCorrect:
            data.results[idx].includes("Correct") ||
            data.results[idx].includes("Perfect"),
          carryValidation: {
            tens: data.carryValidation[idx].tensCorrect,
            hundreds: data.carryValidation[idx].hundredsCorrect,
            thousands: data.carryValidation[idx].thousandsCorrect,
          },
        }))
      );

      setScore(data.score);
      setShowResults(true);
    } catch (err) {
      setError("Failed to verify answers. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    const getDigits = (num: number) => {
      const paddedNum = String(num).padStart(4, "0");
      return {
        tenThousands: "",
        thousands: paddedNum[0],
        hundreds: paddedNum[1],
        tens: paddedNum[2],
        ones: paddedNum[3],
      };
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-sm font-semibold text-gray-500 mb-2">
          Qn {index + 1}
        </div>
        <div className="inline-block">
          {/* Carry numbers row */}
          <div className="grid grid-cols-5 h-12 mb-1 gap-1">
            {/* Empty space for ten-thousands position */}
            <div className="w-12 h-12"></div>

            {/* Carry inputs with validation */}
            {["thousands", "hundreds", "tens"].map((pos) => {
              const isCorrect =
                question.carryValidation?.[
                  pos as keyof typeof question.carryValidation
                ] ?? true;

              return (
                <motion.input
                  key={pos}
                  type="text"
                  maxLength={1}
                  className={`w-12 h-12 border text-2xl font-bold text-center rounded ${
                    showResults
                      ? isCorrect
                        ? "bg-green-100 border-green-500 text-green-800"
                        : "bg-red-100 border-red-500 text-red-800"
                      : "bg-blue-50 border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  }`}
                  value={
                    question.carryNumbers[
                      pos as keyof typeof question.carryNumbers
                    ]
                  }
                  onChange={(e) =>
                    handleCarryChange(
                      index,
                      pos as keyof Question["carryNumbers"],
                      e.target.value
                    )
                  }
                  animate={
                    showResults && !isCorrect
                      ? { scale: [1, 1.05, 1], transition: { duration: 0.4 } }
                      : {}
                  }
                  disabled={showResults}
                />
              );
            })}
            {/* Empty space for ones position */}
            <div className="w-12 h-12"></div>
          </div>

          {/* Numbers and answer grid */}
          <div className="grid grid-cols-5">
            {Object.values(getDigits(question.number1)).map((digit, i) => (
              <div
                key={i}
                className="w-12 h-12 border border-gray-400 flex items-center justify-center text-2xl font-bold bg-gray-50"
              >
                {digit}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 relative">
            <div className="absolute -left-7 top-1/2 transform -translate-y-1/2">
              <Plus className="w-6 h-6 text-gray-600" />
            </div>
            {Object.values(getDigits(question.number2)).map((digit, i) => (
              <div
                key={i}
                className="w-12 h-12 border border-gray-400 flex items-center justify-center text-2xl font-bold bg-gray-50"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Answer row with 5 digits */}
          <div className="grid grid-cols-5 mt-2 border-t-2 border-gray-600">
            {["tenThousands", "thousands", "hundreds", "tens", "ones"].map(
              (pos) => {
                const correctAnswer = question.number1 + question.number2;
                const correctAnswerStr = String(correctAnswer).padStart(5, "0");
                const digitPos = [
                  "tenThousands",
                  "thousands",
                  "hundreds",
                  "tens",
                  "ones",
                ].indexOf(pos);
                const correctDigit = correctAnswerStr[digitPos];
                const userDigit =
                  question.userAnswer[pos as keyof typeof question.userAnswer];
                const isDigitCorrect = userDigit === correctDigit;

                return (
                  <motion.input
                    key={pos}
                    type="text"
                    maxLength={1}
                    className={`w-12 h-12 border text-2xl font-bold text-center rounded ${
                      showResults
                        ? isDigitCorrect
                          ? "bg-green-100 border-green-500 text-green-800"
                          : "bg-red-100 border-red-500 text-red-800"
                        : "bg-blue-50 border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    }`}
                    value={userDigit}
                    onChange={(e) =>
                      handleAnswerChange(
                        index,
                        pos as keyof Question["userAnswer"],
                        e.target.value
                      )
                    }
                    animate={
                      showResults && !isDigitCorrect
                        ? {
                            scale: [1, 1.05, 1],
                            transition: { duration: 0.4 },
                          }
                        : {}
                    }
                    disabled={showResults}
                  />
                );
              }
            )}
          </div>
        </div>

        {/* Show correct answer when results are displayed */}
        {showResults && (
          <div className="mt-3 text-sm text-gray-600">
            <div>
              Correct answer:{" "}
              <span className="font-bold text-green-700">
                {question.number1 + question.number2}
              </span>
            </div>
            {(() => {
              const correctCarries = calculateCorrectCarries(
                question.number1,
                question.number2
              );
              return (
                <div className="flex gap-4 text-xs mt-1">
                  <span>Correct carries:</span>
                  <span className="font-mono">Tens: {correctCarries.tens}</span>
                  <span className="font-mono">
                    Hundreds: {correctCarries.hundreds}
                  </span>
                  <span className="font-mono">
                    Thousands: {correctCarries.thousands}
                  </span>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="min-w-[700px] border border-gray-200 rounded-md p-6 shadow-md min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Four-Digit Addition Practice
        </h1>

        <Button
          variant="outline"
          onClick={fetchQuestions}
          className="gap-2 hover:bg-blue-50"
          disabled={loading}
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          New Questions
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && questions.length > 0 ? (
        <div className="flex justify-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((question, index) =>
              renderQuestion(question, index)
            )}
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <Button
              onClick={checkAnswers}
              disabled={loading || showResults}
              className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                  Checking...
                </div>
              ) : (
                "Check All Answers"
              )}
            </Button>

            {showResults && (
              <Button
                onClick={() => {
                  setShowResults(false);
                  setScore(null);
                  // Clear all answers
                  setQuestions((prev) =>
                    prev.map((q) => ({
                      ...q,
                      userAnswer: {
                        tenThousands: "",
                        thousands: "",
                        hundreds: "",
                        tens: "",
                        ones: "",
                      },
                      carryNumbers: {
                        thousands: "",
                        hundreds: "",
                        tens: "",
                      },
                      isCorrect: undefined,
                    }))
                  );
                }}
                variant="outline"
                className="px-8 py-3 text-lg"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      )}

      {score !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 p-4 bg-white rounded-lg shadow-md"
        >
          <div className="text-2xl font-bold mb-2 text-gray-800">
            Score: {score}/{NUM_QUESTIONS * 3}
          </div>
          <div className="text-sm text-gray-600">
            Total possible points: {NUM_QUESTIONS * 3} (2 for correct answer + 1
            for correct carries per question)
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TestWorksheet;

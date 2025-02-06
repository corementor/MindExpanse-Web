import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  number1: number;
  number2: number;
  userAnswer: {
    tenThousands: string; // New field for 5th digit
    thousands: string;
    hundreds: string;
    tens: string;
    ones: string;
  };
  carryNumbers: {
    tenThousands: string; // New field for 5th digit carry
    thousands: string;
    hundreds: string;
    tens: string;
  };
  isCorrect?: boolean;
}

interface VerifyResponse {
  results: string[];
  score: number;
  total: number;
}

const NUM_QUESTIONS = 4; // Reduced number due to larger size of each question

const FourDigitAddition = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  const fetchQuestions = async () => {
    setScore(null);
    setLoading(true);
    setError(null);
    try {
      const questionPromises = Array(NUM_QUESTIONS)
        .fill(null)
        .map(() =>
          fetch(
            `http://localhost:8080/api/math/addition/generate?type=fourDigit`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ).then((res) => res.json())
        );

      const questionsData = await Promise.all(questionPromises);
      setQuestions(
        questionsData.map((q) => ({
          ...q,
          userAnswer: {
            tenThousands: "",
            thousands: "",
            hundreds: "",
            tens: "",
            ones: "",
          },
          carryNumbers: {
            tenThousands: "",
            thousands: "",
            hundreds: "",
            tens: "",
          },
          isCorrect: undefined,
        }))
      );
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
    }));

    try {
      const response = await fetch(
        "http://localhost:8080/api/math/addition/verify-all",
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
          isCorrect: data.results[idx] === "Correct",
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
        tenThousands: "", // Always 0 for input numbers
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
          {/* Header row */}
          <div className="grid grid-cols-5 border-t border-l border-r border-gray-400">
            <div className="text-center py-1 px-2 text-sm font-bold border-r border-gray-400">
              TTh
            </div>
            <div className="text-center py-1 px-2 text-sm font-bold border-r border-gray-400">
              Th
            </div>
            <div className="text-center py-1 px-2 text-sm font-bold border-r border-gray-400">
              H
            </div>
            <div className="text-center py-1 px-2 text-sm font-bold border-r border-gray-400">
              T
            </div>
            <div className="text-center py-1 px-2 text-sm font-bold">O</div>
          </div>

          {/* Carry numbers row */}

          <div className="grid grid-cols-5 h-12 mb-1">
            <input
              type="text"
              maxLength={1}
              className="w-12 h-12 border border-gray-400 text-2xl font-bold text-center bg-green-50"
              value={question.carryNumbers.tenThousands}
              onChange={(e) =>
                handleCarryChange(index, "tenThousands", e.target.value)
              }
            />
            <input
              type="text"
              maxLength={1}
              className="w-12 h-12 border border-gray-400 text-2xl font-bold text-center bg-green-50"
              value={question.carryNumbers.thousands}
              onChange={(e) =>
                handleCarryChange(index, "thousands", e.target.value)
              }
            />
            <input
              type="text"
              maxLength={1}
              className="w-12 h-12 border border-gray-400 text-2xl font-bold text-center bg-green-50"
              value={question.carryNumbers.hundreds}
              onChange={(e) =>
                handleCarryChange(index, "hundreds", e.target.value)
              }
            />
            <input
              type="text"
              maxLength={1}
              className="w-12 h-12 border border-gray-400 text-2xl font-bold text-center bg-green-50"
              value={question.carryNumbers.tens}
              onChange={(e) => handleCarryChange(index, "tens", e.target.value)}
            />
            <div></div>
          </div>

          {/* Numbers and answer grid now has 5 columns */}
          <div className="grid grid-cols-5">
            {Object.values(getDigits(question.number1)).map((digit, i) => (
              <div
                key={i}
                className="w-12 h-12 border border-gray-400 flex items-center justify-center text-2xl font-bold"
              >
                {digit}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 relative">
            <div className="absolute -left-7 top-1/2 transform -translate-y-1/2">
              <Plus className="w-6 h-6" />
            </div>
            {Object.values(getDigits(question.number2)).map((digit, i) => (
              <div
                key={i}
                className="w-12 h-12 border border-gray-400 flex items-center justify-center text-2xl font-bold"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Answer row with 5 digits */}
          <div className="grid grid-cols-5 mt-2 border-t-2 border-gray-600">
            {["tenThousands", "thousands", "hundreds", "tens", "ones"].map(
              (pos) => (
                <motion.input
                  key={pos}
                  type="text"
                  maxLength={1}
                  className={`w-12 h-12 border border-gray-400 text-2xl font-bold text-center
                    ${
                      question.isCorrect === true
                        ? "bg-green-100"
                        : question.isCorrect === false
                        ? "bg-red-100"
                        : "bg-green-50"
                    }`}
                  value={
                    question.userAnswer[pos as keyof typeof question.userAnswer]
                  }
                  onChange={(e) =>
                    handleAnswerChange(
                      index,
                      pos as keyof Question["userAnswer"],
                      e.target.value
                    )
                  }
                  animate={
                    showResults
                      ? {
                          scale: [1, 1.1, 1],
                          transition: { duration: 0.3 },
                        }
                      : {}
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-w-[700px] border-[1px] border-gray-200 rounded-md p-6 shadow-md min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">
          Solve Four-Digit Addition Questions
        </h1>

        <Button variant="outline" onClick={fetchQuestions} className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          New Questions
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((question, index) => renderQuestion(question, index))}
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <Button onClick={checkAnswers} disabled={loading} className="px-8">
          Check All Answers
        </Button>
      </div>

      {score !== null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <div className="text-xl font-bold mb-2">
            Score: {score}/{NUM_QUESTIONS}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FourDigitAddition;

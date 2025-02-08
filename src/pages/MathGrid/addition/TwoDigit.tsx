import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  number1: number;
  number2: number;
  userAnswer: {
    tens: string;
    ones: string;
  };
  carryNumber: string;
  isCorrect?: boolean;
}

interface VerifyResponse {
  results: string[];
  score: number;
  total: number;
}

const NUM_QUESTIONS = 6;

const TwoDigit = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const token = localStorage.getItem("token");
  const [type] = useState("twoDigit");
  const fetchQuestions = async () => {
    setScore(null);
    setLoading(true);
    setError(null);
    try {
      const questionPromises = Array(NUM_QUESTIONS)
        .fill(null)
        .map(() =>
          fetch(
            `https://mind-expanse.onrender.com  /api/math/addition/generate?type=${type}`,
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
          userAnswer: { tens: "", ones: "" },
          carryNumber: "",
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
    position: "tens" | "ones",
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

  const handleCarryChange = (questionIndex: number, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === questionIndex ? { ...q, carryNumber: sanitizedValue } : q
      )
    );
  };

  const checkAnswers = async () => {
    setLoading(true);
    setError(null);

    const answersToVerify = questions.map((q) => ({
      number1: q.number1,
      number2: q.number2,
      answer: parseInt(`${q.userAnswer.tens}${q.userAnswer.ones}` || "0"),
    }));

    try {
      const response = await fetch(
        "https://mind-expanse.onrender.com  /api/math/addition/verify-all",
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
      const paddedNum = String(num).padStart(2, "0");
      return { tens: paddedNum[0], ones: paddedNum[1] };
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-sm font-semibold text-gray-500 mb-2">
          Qn {index + 1}
        </div>
        <div className="inline-block">
          {/* Header row */}
          <div className="grid grid-cols-2 border-t border-l border-r border-gray-400">
            <div className="text-center py-1 px-2 text-sm font-bold border-r border-gray-400">
              Tens
            </div>
            <div className="text-center py-1 px-2 text-sm font-bold">Ones</div>
          </div>

          {/* Carry number */}
          <div className="grid grid-cols-2 h-12 mb-1">
            <input
              type="text"
              maxLength={1}
              className="w-12 h-12 border border-gray-400 text-2xl font-bold text-center
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
              value={question.carryNumber}
              onChange={(e) => handleCarryChange(index, e.target.value)}
            />
            <div></div>
          </div>

          {/* First number */}
          <div className="grid grid-cols-2">
            {Object.values(getDigits(question.number1)).map((digit, i) => (
              <div
                key={i}
                className="w-12 h-12 border border-gray-400 flex items-center justify-center text-2xl font-bold"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Second number with plus sign */}
          <div className="grid grid-cols-2 relative">
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
              <Plus className="w-4 h-4" />
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

          {/* Answer row */}
          <div className="grid grid-cols-2 mt-2 border-t-2 border-gray-600">
            {["tens", "ones"].map((pos) => (
              <motion.input
                key={pos}
                type="text"
                maxLength={1}
                className={`w-12 h-12 border border-gray-400 text-2xl font-bold text-center
                  focus:outline-none focus:ring-2 focus:ring-blue-500
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
                    pos as "tens" | "ones",
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
            ))}
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
          {type === "singleDigit"
            ? "Solve Single-Digit Addition Questions"
            : "Solve Two-Digit Addition Questions"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question, index) => renderQuestion(question, index))}
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={checkAnswers} disabled={loading} className="px-8">
          Check All Answers
        </Button>
      </div>

      {score !== null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-xl font-bold mb-2">
            Score: {score}/{NUM_QUESTIONS}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TwoDigit;

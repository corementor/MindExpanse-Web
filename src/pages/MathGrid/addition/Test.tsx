import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  number1: number;
  number2: number;
}

interface VerifyResponse {
  results: string[];
  score: number;
  total: number;
}

const PlaceValueAddition = () => {
  const [problem, setProblem] = useState<Question>({
    number1: 0,
    number2: 0,
  });

  const [answers, setAnswers] = useState({
    tens: "",
    ones: "",
  });

  const [carryNumber, setCarryNumber] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8080/api/math/addition/generate?type=singleDigit"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }
      const data = await response.json();
      setProblem(data);
    } catch (err) {
      setError("Failed to load question. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswerChange = (position: "tens" | "ones", value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setAnswers((prev) => ({
      ...prev,
      [position]: sanitizedValue,
    }));
  };

  const handleCarryChange = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setCarryNumber(sanitizedValue);
  };

  const checkAnswer = async () => {
    setLoading(true);
    setError(null);
    const userAnswer = parseInt(`${answers.tens}${answers.ones}` || "0");

    try {
      const response = await fetch(
        "http://localhost:8080/api/math/addition/verify-all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              number1: problem.number1,
              number2: problem.number2,
              answer: userAnswer,
            },
          ]),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify answer");
      }

      const data: VerifyResponse = await response.json();
      setIsCorrect(data.results[0] === "Correct");
      setShowFeedback(true);

      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    } catch (err) {
      setError("Failed to verify answer. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDigits = (num: number) => {
    const paddedNum = String(num).padStart(2, "0");
    return {
      tens: paddedNum[0],
      ones: paddedNum[1],
    };
  };

  const renderCarryInput = () => (
    <input
      type="text"
      maxLength={1}
      className={`
        w-16 h-16 border border-gray-400 text-3xl font-bold text-center
        focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50
      `}
      value={carryNumber}
      onChange={(e) => handleCarryChange(e.target.value)}
    />
  );

  const renderCell = (value: string, isInput = false) => {
    if (isInput) {
      return (
        <motion.input
          type="text"
          maxLength={1}
          className={`
            w-16 h-16 border border-gray-400 text-3xl font-bold text-center
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${
              isCorrect === true
                ? "bg-green-100"
                : isCorrect === false
                ? "bg-red-100"
                : "bg-green-50"
            }
          `}
          value={value}
          onChange={(e) =>
            handleAnswerChange(
              e.target.parentElement?.dataset.position as "tens" | "ones",
              e.target.value
            )
          }
          animate={
            showFeedback
              ? {
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.3 },
                }
              : {}
          }
        />
      );
    }

    return (
      <div className="w-16 h-16 border border-gray-400 flex items-center justify-center text-3xl font-bold bg-white">
        {value}
      </div>
    );
  };

  const resetProblem = () => {
    setAnswers({ tens: "", ones: "" });
    setCarryNumber("");
    setIsCorrect(null);
    setShowFeedback(false);
    fetchQuestion();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
        <Button onClick={fetchQuestion} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="inline-block">
        {/* Header row */}
        <div className="grid grid-cols-2 border-t border-l border-r border-gray-400">
          <div className="text-center py-2 px-4 font-bold border-r border-gray-400">
            Tens
          </div>
          <div className="text-center py-2 px-4 font-bold">Ones</div>
        </div>

        {/* Carry number - only for tens column */}
        <div className="grid grid-cols-2 h-16 mb-1">
          <div>{renderCarryInput()}</div>
          <div></div>
        </div>

        {/* First number */}
        <div className="grid grid-cols-2">
          {renderCell(getDigits(problem.number1).tens)}
          {renderCell(getDigits(problem.number1).ones)}
        </div>

        {/* Second number with plus sign */}
        <div className="grid grid-cols-2 relative">
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
            <Plus className="w-6 h-6" />
          </div>
          {renderCell(getDigits(problem.number2).tens)}
          {renderCell(getDigits(problem.number2).ones)}
        </div>

        {/* Answer row */}
        <div className="grid grid-cols-2 mt-2 border-t-2 border-gray-600">
          <div data-position="tens">{renderCell(answers.tens, true)}</div>
          <div data-position="ones">{renderCell(answers.ones, true)}</div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={checkAnswer} disabled={loading}>
          Check Answer
        </Button>
        <Button variant="outline" onClick={resetProblem} disabled={loading}>
          New Problem
        </Button>
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`text-lg font-bold ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect ? "Correct! 🎉" : "Try again! 🤔"}
        </motion.div>
      )}
    </div>
  );
};

export default PlaceValueAddition;

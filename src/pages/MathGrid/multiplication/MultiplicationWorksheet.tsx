import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Settings, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mathService } from "@/services/MathService";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/resultsModal";

interface UserPreferences {
  complexity: "with-regrouping" | "without-regrouping";
  numberOfDigits: number;
  numberOfQuestions?: number;
}

interface Question {
  id: number;
  number1: number;
  number2: number;
  userAnswer: string;
  partialProducts: {
    partialProduct1: string;
    partialProduct2: string;
    partialProduct3: string;
  };
  carries: {
    carryOnesToTens: string;
    carryTensToHundreds: string;
  };
  isCorrect?: boolean;
  partialProductsCorrect?: boolean;
  carriesCorrect?: boolean;
  correctPartialProducts?: {
    partialProduct1: number;
    partialProduct2: number;
    partialProduct3: number;
  };
  correctCarries?: {
    carryOnesToTens: number;
    carryTensToHundreds: number;
  };
}

const PreferenceSelection: React.FC<{
  onPreferencesSelected: (preferences: UserPreferences) => void;
}> = ({ onPreferencesSelected }) => {
  const [complexity, setComplexity] = useState<
    "with-regrouping" | "without-regrouping"
  >("with-regrouping");
  const [numberOfDigits, setNumberOfDigits] = useState<number>(2);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(4);

  const handleStartWorksheet = () => {
    const preferences = { complexity, numberOfDigits, numberOfQuestions };
    onPreferencesSelected(preferences);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl my-8">
        <div className="text-center mb-6">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Customize Your Worksheet
          </h1>
          <p className="text-gray-600">
            Set your preferences to create the perfect multiplication practice
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              🎯 Choose Complexity Level
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  complexity === "without-regrouping"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => setComplexity("without-regrouping")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800">
                    Without Regrouping
                  </h4>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      complexity === "without-regrouping"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {complexity === "without-regrouping" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Simple multiplication problems where no carrying is required
                </p>
                <div className="bg-gray-50 p-2 rounded-lg font-mono text-center">
                  <div> 23</div>
                  <div>× 12</div>
                  <div className="border-t border-gray-400 pt-1"> 276</div>
                </div>
              </div>
              <div
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  complexity === "with-regrouping"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setComplexity("with-regrouping")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-800">With Regrouping</h4>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      complexity === "with-regrouping"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {complexity === "with-regrouping" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Advanced problems requiring carrying over to the next column
                </p>
                <div className="bg-gray-50 p-2 rounded-lg font-mono text-center">
                  <div className="text-xs text-blue-600"> ¹ ²</div>
                  <div> 47</div>
                  <div>× 38</div>
                  <div className="border-t border-gray-400 pt-1"> 1786</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              🔢 Number of Digits
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[2, 3, 4].map((digits) => (
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
                    {digits}
                  </div>
                  <div className="text-xs text-gray-600">
                    {digits === 2
                      ? "10-99"
                      : digits === 3
                      ? "100-999"
                      : "1000-9999"}
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
                  <div className="text-xs text-gray-600">
                    {num} questions to practice
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview - with reduced padding */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {" "}
              {/* Smaller heading */}
              📋 Your Selection Summary
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              {" "}
              {/* Smaller text */}
              <p>
                <span className="font-semibold">Complexity:</span>{" "}
                {complexity === "with-regrouping"
                  ? "With Regrouping (Advanced)"
                  : "Without Regrouping (Basic)"}
              </p>
              <p>
                <span className="font-semibold">Number of Digits:</span>{" "}
                {numberOfDigits} digits per number
              </p>
              <p>
                <span className="font-semibold">Questions:</span>{" "}
                {numberOfQuestions} practice problems
              </p>
            </div>
          </motion.div>

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

const MultiplicationWorksheet = () => {
  const [showPreferences, setShowPreferences] = useState(true);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const generateQuestions = () => {
    if (!userPreferences) return;
    setLoading(true);
    setError(null);
    setScore(null);
    setShowResults(false);

    try {
      const min = Math.pow(10, userPreferences.numberOfDigits - 1);
      const max = Math.pow(10, userPreferences.numberOfDigits) - 1;
      const newQuestions: Question[] = [];

      for (let i = 0; i < (userPreferences.numberOfQuestions ?? 4); i++) {
        const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        const num2 = Math.floor(Math.random() * 90) + 10; // 2-digit multiplier

        newQuestions.push({
          id: i + 1,
          number1: num1,
          number2: num2,
          userAnswer: "",
          partialProducts: {
            partialProduct1: "",
            partialProduct2: "",
            partialProduct3: "",
          },
          carries: {
            carryOnesToTens: "",
            carryTensToHundreds: "",
          },
        });
      }

      setQuestions(newQuestions);
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSelected = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setShowPreferences(false);
  };

  useEffect(() => {
    if (!showPreferences && userPreferences) {
      generateQuestions();
    }
  }, [showPreferences, userPreferences]);

  // Fixed: Simple string-based input handling
  const handleAnswerChange = (questionId: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, userAnswer: cleanValue } : q
      )
    );
  };

  // Fixed: Simple string-based partial product handling
  const handlePartialProductChange = (
    questionId: number,
    productKey: string,
    value: string
  ) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              partialProducts: {
                ...q.partialProducts,
                [productKey]: cleanValue,
              },
            }
          : q
      )
    );
  };

  // Simple string-based carry handling
  const handleCarryChange = (
    questionId: number,
    carryKey: string,
    value: string
  ) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1); // Only single digit
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              carries: {
                ...q.carries,
                [carryKey]: cleanValue,
              },
            }
          : q
      )
    );
  };

  const checkAnswers = async () => {
    setLoading(true);
    setError(null);

    try {
      const answersToVerify = questions.map((q) => ({
        number1: q.number1,
        number2: q.number2,
        answer: parseInt(q.userAnswer) || 0,
        carries: {
          carryOnesToTens: parseInt(q.carries.carryOnesToTens) || 0,
          carryTensToHundreds: parseInt(q.carries.carryTensToHundreds) || 0,
        },
        partialProducts: {
          partialProduct1: parseInt(q.partialProducts.partialProduct1) || 0,
          partialProduct2: parseInt(q.partialProducts.partialProduct2) || 0,
          partialProduct3: parseInt(q.partialProducts.partialProduct3) || 0,
        },
      }));

      const data = await mathService.verifyMultiplicationAnswers(
        answersToVerify
      );

      setQuestions((prev) =>
        prev.map((q, idx) => {
          const correctAnswer = q.number1 * q.number2;
          const userAnswer = parseInt(q.userAnswer) || 0;

          return {
            ...q,
            isCorrect: userAnswer === correctAnswer,
            partialProductsCorrect:
              data.results[idx].includes("Perfect") ||
              data.results[idx].includes("partial products correct"),
            carriesCorrect:
              data.carryValidation[idx].carryOnesToTensCorrect &&
              data.carryValidation[idx].carryTensToHundredsCorrect,
            correctPartialProducts: data.correctPartialProducts[idx],
            correctCarries: data.correctCarries[idx],
          };
        })
      );

      setScore(data.score);
      setShowResults(true);
      setIsResultModalOpen(true);
    } catch (err) {
      setError("Failed to verify answers. Please try again.");
      console.error("Error verifying answers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Better number formatting with proper alignment
  const formatNumberToArray = (num: number, totalDigits: number): string[] => {
    const numStr = num.toString();
    const paddedStr = numStr.padStart(totalDigits, " ");
    return paddedStr.split("");
  };

  // Fixed: Completely rewritten renderQuestion with proper input handling
  const renderQuestion = (question: Question) => {
    const numDigits = userPreferences?.numberOfDigits || 2;
    const maxResultDigits = numDigits + 2;

    const num1Array = formatNumberToArray(question.number1, maxResultDigits);
    const num2Array = formatNumberToArray(question.number2, maxResultDigits);
    const correctAnswer = question.number1 * question.number2;
    const userAnswer = parseInt(question.userAnswer) || 0;

    // Fixed: Helper function to get individual digit from string
    const getDigitAtPosition = (
      str: string,
      position: number,
      totalPositions: number
    ): string => {
      if (!str) return "";
      const paddedStr = str.padStart(totalPositions, " ");
      return paddedStr[position] === " " ? "" : paddedStr[position];
    };

    // Fixed: Helper function to update digit at position
    const updateDigitAtPosition = (
      currentStr: string,
      position: number,
      totalPositions: number,
      newDigit: string
    ): string => {
      const paddedStr = currentStr.padStart(totalPositions, " ");
      const strArray = paddedStr.split("");
      strArray[position] = newDigit;
      return strArray.join("").trim();
    };

    return (
      <Card key={question.id} className="p-6">
        <CardHeader>
          <CardTitle className="text-center">Question {question.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="bg-gray-50 p-6 rounded-lg font-mono text-center">
              {/* Carry numbers for regrouping */}
              {userPreferences?.complexity === "with-regrouping" && (
                <div className="flex justify-end mb-2">
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                    }}
                  >
                    {Array.from({ length: maxResultDigits }).map((_, index) => {
                      const isTensCarry = index === maxResultDigits - 2;
                      const isHundredsCarry = index === maxResultDigits - 3;
                      const isVisible = isTensCarry || isHundredsCarry;

                      return (
                        <input
                          key={`carry-${index}`}
                          type="text"
                          maxLength={1}
                          className={`w-8 h-6 text-center text-xs border rounded ${
                            isVisible ? "border-gray-300" : "border-transparent"
                          } ${
                            showResults && isVisible
                              ? "bg-green-100 border-green-500"
                              : ""
                          }`}
                          value={
                            isTensCarry
                              ? question.carries.carryOnesToTens
                              : isHundredsCarry
                              ? question.carries.carryTensToHundreds
                              : ""
                          }
                          onChange={(e) => {
                            if (isTensCarry) {
                              handleCarryChange(
                                question.id,
                                "carryOnesToTens",
                                e.target.value
                              );
                            } else if (isHundredsCarry) {
                              handleCarryChange(
                                question.id,
                                "carryTensToHundreds",
                                e.target.value
                              );
                            }
                          }}
                          disabled={showResults}
                          style={{
                            visibility: isVisible ? "visible" : "hidden",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* First number */}
              <div className="flex justify-end mb-2">
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                  }}
                >
                  {num1Array.map((digit, index) => (
                    <div
                      key={`num1-${index}`}
                      className="w-8 h-8 flex items-center justify-center text-lg border border-gray-300 bg-white"
                    >
                      {digit.trim()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Multiplication symbol and second number */}
              <div className="flex justify-end mb-2 relative">
                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-lg">
                  ×
                </div>
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                  }}
                >
                  {num2Array.map((digit, index) => (
                    <div
                      key={`num2-${index}`}
                      className="w-8 h-8 flex items-center justify-center text-lg border border-gray-300 bg-white"
                    >
                      {digit.trim()}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-gray-400 my-3"></div>

              {/* First partial product */}
              <div className="flex justify-end mb-2">
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                  }}
                >
                  {Array.from({ length: maxResultDigits }).map((_, index) => (
                    <input
                      key={`partial1-${index}`}
                      type="text"
                      maxLength={1}
                      className={`w-8 h-8 text-center text-sm border rounded ${
                        showResults
                          ? "bg-green-100 border-green-500"
                          : "border-gray-300"
                      }`}
                      value={getDigitAtPosition(
                        question.partialProducts.partialProduct1,
                        index,
                        maxResultDigits
                      )}
                      onChange={(e) => {
                        const newValue = updateDigitAtPosition(
                          question.partialProducts.partialProduct1,
                          index,
                          maxResultDigits,
                          e.target.value.replace(/[^0-9]/g, "")
                        );
                        handlePartialProductChange(
                          question.id,
                          "partialProduct1",
                          newValue
                        );
                      }}
                      disabled={showResults}
                    />
                  ))}
                </div>
              </div>

              {/* Second partial product */}
              <div className="flex justify-end mb-2 relative">
                <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-lg">
                  +
                </div>
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                  }}
                >
                  {Array.from({ length: maxResultDigits }).map((_, index) => (
                    <input
                      key={`partial2-${index}`}
                      type="text"
                      maxLength={1}
                      className={`w-8 h-8 text-center text-sm border rounded ${
                        showResults
                          ? "bg-green-100 border-green-500"
                          : "border-gray-300"
                      }`}
                      value={getDigitAtPosition(
                        question.partialProducts.partialProduct2,
                        index,
                        maxResultDigits
                      )}
                      onChange={(e) => {
                        const newValue = updateDigitAtPosition(
                          question.partialProducts.partialProduct2,
                          index,
                          maxResultDigits,
                          e.target.value.replace(/[^0-9]/g, "")
                        );
                        handlePartialProductChange(
                          question.id,
                          "partialProduct2",
                          newValue
                        );
                      }}
                      disabled={showResults}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-gray-400 my-3"></div>

              {/* Final answer */}
              <div className="flex justify-end">
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                  }}
                >
                  {Array.from({ length: maxResultDigits }).map((_, index) => (
                    <input
                      key={`answer-${index}`}
                      type="text"
                      maxLength={1}
                      className={`w-8 h-10 text-center text-lg border rounded font-mono ${
                        showResults
                          ? userAnswer === correctAnswer
                            ? "bg-green-100 border-green-500"
                            : "bg-red-100 border-red-500"
                          : "border-gray-300"
                      }`}
                      value={getDigitAtPosition(
                        question.userAnswer,
                        index,
                        maxResultDigits
                      )}
                      onChange={(e) => {
                        const newValue = updateDigitAtPosition(
                          question.userAnswer,
                          index,
                          maxResultDigits,
                          e.target.value.replace(/[^0-9]/g, "")
                        );
                        handleAnswerChange(question.id, newValue);
                      }}
                      disabled={showResults}
                    />
                  ))}
                </div>
              </div>

              {/* Show correct answer when results are displayed */}
              {showResults && !question.isCorrect && (
                <div className="mt-4 text-center text-green-600 text-sm">
                  <div>Correct answer: {correctAnswer}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (showPreferences) {
    return (
      <PreferenceSelection onPreferencesSelected={handlePreferencesSelected} />
    );
  }

  if (loading && questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              onClick={() => setShowPreferences(true)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Preferences
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">
                Multiplication Worksheet
              </h1>
              <p className="text-gray-600">
                {userPreferences?.complexity === "with-regrouping"
                  ? "With"
                  : "Without"}{" "}
                Regrouping • {userPreferences?.numberOfDigits} digits
              </p>
            </div>
            <Button
              variant="outline"
              onClick={generateQuestions}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              New Questions
            </Button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {questions.map((question) => renderQuestion(question))}
          </div>

          <div className="text-center">
            <Button
              onClick={checkAnswers}
              disabled={loading || showResults}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {loading ? "Checking..." : "Check Answers"}
            </Button>
          </div>

          {/* {showResults && score !== null && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Results</h3>
              <div
                className={`text-4xl font-bold mb-2 ${
                  score >= 70
                    ? "text-green-600"
                    : score >= 50
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {score}%
              </div>
              <p className="text-lg">
                Score: {questions.filter((q) => q.isCorrect).length} /{" "}
                {questions.length}
              </p>
              {score === 100 && (
                <div className="mt-4 text-2xl">🎉 Perfect Score! 🎉</div>
              )}
            </div>
          )} */}

          {isResultModalOpen && (
            <Dialog
              open={isResultModalOpen}
              onOpenChange={setIsResultModalOpen}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center">
                    Quiz Results
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Here's how you performed on the Multiplication worksheet
                  </DialogDescription>
                </DialogHeader>

                <div className="py-6 text-center">
                  <div
                    className={`text-5xl font-bold mb-4 ${
                      score === questions.length
                        ? "text-green-600"
                        : score! >= questions.length * 0.7
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.round((score! / questions.length) * 100)}%
                  </div>

                  <p className="text-gray-600 text-lg mb-4">
                    You got {questions.filter((q) => q.isCorrect).length} out of{" "}
                    {questions.length} questions correct!
                  </p>

                  {score === questions.length && (
                    <div className="text-2xl mb-4">🎉 Perfect Score! 🎉</div>
                  )}
                </div>

                <DialogFooter className="flex justify-center gap-2">
                  <Button
                    onClick={() => {
                      setIsResultModalOpen(false);
                      userPreferences && generateQuestions();
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try New Questions
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsResultModalOpen(false)}
                  >
                    Review Answers
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiplicationWorksheet;

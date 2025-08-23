import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, RefreshCcw, Settings, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { mathService } from "../../../services/mathService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/resultsModal";

// Interfaces to define the structure of questions and user answers
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
  borrowNumbers: {
    thousands: string; // Borrow from thousands to hundreds
    hundreds: string; // Borrow from hundreds to tens
    tens: string; // Borrow from tens to ones
  };
  isCorrect?: boolean;
  borrowsCorrect?: boolean;
  borrowValidation?: {
    thousands: boolean;
    hundreds: boolean;
    tens: boolean;
  };
}

// Interface to define user preferences for the worksheet
interface UserPreferences {
  complexity: "with-regrouping" | "without-regrouping";
  numberOfDigits: number;
  numberOfQuestions?: number;
}

// Interface to define the structure of the response from the API
// interface VerifyResponse {
//   results: string[];
//   score: number;
//   percentage: number;
//   maxScore: number;
//   total: number;
//   correctBorrows: Array<{
//     tens: number;
//     hundreds: number;
//     thousands: number;
//   }>;
//   borrowValidation: Array<{
//     tensCorrect: boolean;
//     hundredsCorrect: boolean;
//     thousandsCorrect: boolean;
//   }>;
// }

const PreferenceSelection: React.FC<{
  onPreferencesSelected: (preferences: UserPreferences) => void;
}> = ({ onPreferencesSelected }) => {
  const [complexity, setComplexity] = useState<
    "with-regrouping" | "without-regrouping"
  >("with-regrouping");
  const [numberOfDigits, setNumberOfDigits] = useState<number>(4);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(4);

  const handleStartWorksheet = () => {
    const preferences = { complexity, numberOfDigits, numberOfQuestions };
    console.log("Selected preferences:", preferences);
    onPreferencesSelected(preferences);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl my-8"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3"
          >
            <Settings className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Customize Your Worksheet
          </h1>
          <p className="text-gray-600">
            Set your preferences to create the perfect subtraction practice
            experience
          </p>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
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
                  Simple subtraction problems where no borrowing is required
                </p>
                <div className="bg-gray-50 p-2 rounded-lg font-mono text-center">
                  <div> 456</div>
                  <div>- 123</div>
                  <div className="border-t border-gray-400 pt-1"> 333</div>
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
                  Advanced problems requiring borrowing from the next column
                </p>
                <div className="bg-gray-50 p-2 rounded-lg font-mono text-center">
                  <div className="text-xs text-blue-600"> ⁴ ¹⁵</div>
                  <div> 5 4 3</div>
                  <div>- 2 8 7</div>
                  <div className="border-t border-gray-400 pt-1"> 2 5 6</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Number of Digits and Questions selection remain the same */}
          {/* ... */}
          {/* Number of Digits Selection */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              🔢 Number of Digits
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {" "}
              {/* Reduced gap */}
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
                    {" "}
                    {/* Smaller text */}
                    {digits === 2
                      ? "10-99"
                      : digits === 3
                      ? "100-999"
                      : digits === 4
                      ? "1000-9999"
                      : "10000-99999"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Number of Questions Selection */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
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
          </motion.div>
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
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={handleStartWorksheet}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Start My Worksheet
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const SubtractionWorksheet = () => {
  const [showPreferences, setShowPreferences] = useState(true);
  const [userPreferences, setUserPreferences] =
    useState<UserPreferences | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const handlePreferencesSelected = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setShowPreferences(false);
    fetchQuestionsBasedOnPreferences(preferences);
  };

  const fetchQuestionsBasedOnPreferences = async (
    preferences: UserPreferences
  ) => {
    setScore(null);
    setLoading(true);
    setError(null);

    try {
      const min = Math.pow(10, preferences.numberOfDigits - 1);
      const max = Math.pow(10, preferences.numberOfDigits) - 1;
      const NUM_QUESTIONS = preferences.numberOfQuestions || 4;

      // Try to get questions from API
      let apiQuestions: Question[] = [];
      try {
        const data = await mathService.generateArray({
          rows: NUM_QUESTIONS,
          cols: 2,
          min,
          max,
        });
        apiQuestions = transformArrayToQuestions(data, preferences, min, max);
      } catch (apiError) {
        console.warn("API request failed, using local generation", apiError);
      }

      const localQuestions = generateLocalQuestions(
        Math.max(0, NUM_QUESTIONS - apiQuestions.length),
        preferences,
        min,
        max
      );

      setQuestions(
        [...apiQuestions, ...localQuestions].slice(0, NUM_QUESTIONS)
      );
      setShowResults(false);
    } catch (err) {
      setError("Failed to load questions. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const transformArrayToQuestions = (
    data: number[][],
    preferences: UserPreferences,
    min: number,
    max: number
  ): Question[] => {
    const questions: Question[] = [];

    for (const row of data) {
      for (let i = 0; i < row.length; i += 2) {
        if (i + 1 >= row.length) break;

        let num1 = row[i];
        let num2 = row[i + 1];

        // Ensure num1 is always greater than num2 for subtraction
        if (num1 < num2) {
          [num1, num2] = [num2, num1];
        }

        if (preferences.complexity === "without-regrouping") {
          [num1, num2] = adjustForNoRegrouping(num1, num2, min, max);
        }

        questions.push(createQuestion(num1, num2));
      }
    }

    return questions;
  };

  const generateLocalQuestions = (
    count: number,
    preferences: UserPreferences,
    min: number,
    max: number
  ): Question[] => {
    return Array.from({ length: count }, () => {
      let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      let num2 = Math.floor(Math.random() * (max - min + 1)) + min;

      // Ensure num1 is always greater than num2
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }

      if (preferences.complexity === "without-regrouping") {
        [num1, num2] = adjustForNoRegrouping(num1, num2, min, max);
      }

      return createQuestion(num1, num2);
    });
  };

  const adjustForNoRegrouping = (
    num1: number,
    num2: number,
    min: number,
    max: number
  ): [number, number] => {
    while (requiresBorrowing(num1, num2)) {
      num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      num2 = Math.floor(Math.random() * (max - min + 1)) + min;
      // Ensure num1 is always greater than num2
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
    }
    return [num1, num2];
  };

  const createQuestion = (num1: number, num2: number): Question => ({
    number1: num1,
    number2: num2,
    userAnswer: {
      tenThousands: "",
      thousands: "",
      hundreds: "",
      tens: "",
      ones: "",
    },
    borrowNumbers: { thousands: "", hundreds: "", tens: "" },
    isCorrect: undefined,
    borrowValidation: { thousands: true, hundreds: true, tens: true },
  });

  const requiresBorrowing = (num1: number, num2: number): boolean => {
    const str1 = String(num1);
    const str2 = String(num2);
    const maxLength = Math.max(str1.length, str2.length);

    for (let i = 0; i < maxLength; i++) {
      const digit1 = parseInt(str1[str1.length - 1 - i] || "0");
      const digit2 = parseInt(str2[str2.length - 1 - i] || "0");

      if (digit1 < digit2) {
        return true;
      }
    }
    return false;
  };

  const fetchQuestions = async () => {
    if (userPreferences) {
      await fetchQuestionsBasedOnPreferences(userPreferences);
    }
  };

  useEffect(() => {
    if (!showPreferences && userPreferences) {
      fetchQuestionsBasedOnPreferences(userPreferences);
    }
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

  const handleBorrowChange = (
    questionIndex: number,
    position: keyof Question["borrowNumbers"],
    value: string
  ) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === questionIndex
          ? {
              ...q,
              borrowNumbers: { ...q.borrowNumbers, [position]: sanitizedValue },
            }
          : q
      )
    );
  };

  // const calculateCorrectBorrows = (num1: number, num2: number) => {
  //   const digits1 = String(num1)
  //     .padStart(4, "0")
  //     .split("")
  //     .reverse()
  //     .map(Number);
  //   const digits2 = String(num2)
  //     .padStart(4, "0")
  //     .split("")
  //     .reverse()
  //     .map(Number);

  //   const borrows = { tens: 0, hundreds: 0, thousands: 0 };

  //   // Ones place
  //   if (digits1[0] < digits2[0]) {
  //     borrows.tens = 1;
  //     digits1[1] -= 1;
  //     digits1[0] += 10;
  //   }

  //   // Tens place
  //   if (digits1[1] < digits2[1]) {
  //     borrows.hundreds = 1;
  //     digits1[2] -= 1;
  //     digits1[1] += 10;
  //   }

  //   // Hundreds place
  //   if (digits1[2] < digits2[2]) {
  //     borrows.thousands = 1;
  //     digits1[3] -= 1;
  //     digits1[2] += 10;
  //   }

  //   return borrows;
  // };

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
      borrows: {
        tens: parseInt(q.borrowNumbers.tens || "0"),
        hundreds: parseInt(q.borrowNumbers.hundreds || "0"),
        thousands: parseInt(q.borrowNumbers.thousands || "0"),
      },
    }));

    try {
      const data = await mathService.verifySubtractionAnswers(answersToVerify);

      setQuestions((prev) =>
        prev.map((q, idx) => ({
          ...q,
          isCorrect:
            data.results[idx].includes("Correct") ||
            data.results[idx].includes("Perfect"),
          borrowValidation: {
            tens: data.borrowValidation[idx].tensCorrect,
            hundreds: data.borrowValidation[idx].hundredsCorrect,
            thousands: data.borrowValidation[idx].thousandsCorrect,
          },
        }))
      );

      setScore(data.score);
      setShowResults(true);
      setIsResultModalOpen(true);
    } catch (err) {
      setError("Failed to verify answers. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDynamicColumns = (numberOfDigits: number) => {
    switch (numberOfDigits) {
      case 2:
        return {
          positions: ["hundreds", "tens", "ones"],
          borrowPositions: ["tens"],
          gridCols: "grid-cols-3",
          totalCols: 3,
        };
      case 3:
        return {
          positions: ["thousands", "hundreds", "tens", "ones"],
          borrowPositions: ["hundreds", "tens"],
          gridCols: "grid-cols-4",
          totalCols: 4,
        };
      case 4:
      default:
        return {
          positions: ["tenThousands", "thousands", "hundreds", "tens", "ones"],
          borrowPositions: ["thousands", "hundreds", "tens"],
          gridCols: "grid-cols-5",
          totalCols: 5,
        };
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    const columns = getDynamicColumns(userPreferences?.numberOfDigits || 4);

    const getDigits = (num: number) => {
      const paddedNum = String(num).padStart(columns.totalCols, "0");
      const digits: any = {};
      columns.positions.forEach((pos, idx) => {
        digits[pos] = paddedNum[idx] || "0";
      });
      return digits;
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="text-sm font-semibold text-gray-500 mb-2">
          Qn {index + 1}
        </div>
        <div className="inline-block">
          {/* Borrow numbers row */}
          <div className={`grid ${columns.gridCols} h-12 mb-1 gap-1`}>
            {columns.positions.map((pos) => {
              if (!columns.borrowPositions.includes(pos)) {
                return <div key={pos} className="w-12 h-12"></div>;
              }

              const isCorrect =
                question.borrowValidation?.[
                  pos as keyof typeof question.borrowValidation
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
                    question.borrowNumbers[
                      pos as keyof typeof question.borrowNumbers
                    ] || ""
                  }
                  onChange={(e) =>
                    handleBorrowChange(
                      index,
                      pos as keyof Question["borrowNumbers"],
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
          </div>

          {/* First number row */}
          <div className={`grid ${columns.gridCols}`}>
            {columns.positions.map((pos, i) => {
              const digits = getDigits(question.number1);
              return (
                <div
                  key={`num1-${pos}`}
                  className="w-12 h-12 border border-gray-400 flex items-center justify-center text-2xl font-bold bg-gray-50"
                >
                  {digits[pos] === "0" && i === 0 ? "" : digits[pos]}
                </div>
              );
            })}
          </div>

          {/* Second number row */}
          <div className={`grid ${columns.gridCols} relative`}>
            <div className="absolute -left-7 top-1/2 transform -translate-y-1/2">
              <Minus className="w-6 h-6 text-gray-600" />
            </div>
            {columns.positions.map((pos, i) => {
              const digits = getDigits(question.number2);
              return (
                <div
                  key={`num2-${pos}`}
                  className="w-12 h-12 border border-gray-400 flex items-center justify-center text-2xl font-bold bg-gray-50"
                >
                  {digits[pos] === "0" && i === 0 ? "" : digits[pos]}
                </div>
              );
            })}
          </div>

          {/* Answer row */}
          <div
            className={`grid ${columns.gridCols} mt-2 border-t-2 border-gray-600`}
          >
            {columns.positions.map((pos, idx) => {
              const correctAnswer = question.number1 - question.number2;
              const correctAnswerStr = String(correctAnswer).padStart(
                columns.totalCols,
                "0"
              );
              const correctDigit = correctAnswerStr[idx];
              const userDigit =
                question.userAnswer[pos as keyof typeof question.userAnswer];
              const isDigitCorrect = userDigit === correctDigit;

              return (
                <motion.input
                  key={`answer-${pos}`}
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
            })}
          </div>
        </div>

        {isResultModalOpen && (
          <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Quiz Results
                </DialogTitle>
                <DialogDescription className="text-center">
                  Here's how you performed on the Subtraction worksheet
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
                    userPreferences && fetchQuestions();
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
    <div className="min-w-[700px] border border-gray-200 rounded-md p-6 shadow-md min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold text-gray-800">
              Subtraction Practice
            </h1>
            <p className="text-sm text-gray-600 text-center">
              {userPreferences?.complexity === "with-regrouping"
                ? "With Regrouping"
                : "Without Regrouping"}{" "}
              • {userPreferences?.numberOfDigits} digits
            </p>
          </div>
        </div>

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
                "Check Answers"
              )}
            </Button>
            {showResults && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setScore(null);
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
                      borrowNumbers: {
                        thousands: "",
                        hundreds: "",
                        tens: "",
                      },
                      isCorrect: undefined,
                      borrowValidation: {
                        thousands: true,
                        hundreds: true,
                        tens: true,
                      },
                    }))
                  );
                }}
                className="gap-2 hover:bg-blue-50"
                disabled={loading}
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtractionWorksheet;

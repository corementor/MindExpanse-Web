//v3
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Settings, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mathService } from "@/services/mathService";

interface UserPreferences {
  complexity: "with-regrouping" | "without-regrouping";
  numberOfDigits: number;
  numberOfQuestions?: number;
}

interface Question {
  id: number;
  number1: number;
  number2: number;
  userAnswer: string[];
  partialProducts: {
    [key: string]: string[];
  };
  carries: {
    [key: string]: string;
  };
  isCorrect?: boolean;
  partialProductsCorrect?: boolean;
  carriesCorrect?: boolean;
  correctPartialProducts?: {
    [key: string]: number;
  };
  correctCarries?: {
    [key: string]: number;
  };
}

const PreferenceSelection: React.FC<{
  onPreferencesSelected: (preferences: UserPreferences) => void;
}> = ({ onPreferencesSelected }) => {
  const [complexity, setComplexity] = useState<
    "with-regrouping" | "without-regrouping"
  >("with-regrouping");
  const [numberOfDigits, setNumberOfDigits] = useState<number>(2);
  const [numberOfQuestions, setNumberOfQuestions] = useState("");

  const handleStartWorksheet = () => {
    const preferences = {
      complexity,
      numberOfDigits,
      numberOfQuestions: Number(numberOfQuestions),
    };
    onPreferencesSelected(preferences);
  };

  const handleNumberOfQuestionsChange = (value: string) => {
    if (value === "") {
      setNumberOfQuestions("");
      return;
    }
    const num = parseInt(value, 10);

    if (!isNaN(num) && num >= 0 && num <= 50) {
      setNumberOfQuestions(num.toString());
    }
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
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={numberOfQuestions}
                  onChange={(e) =>
                    handleNumberOfQuestionsChange(e.target.value)
                  }
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full p-4 text-xl font-bold text-center border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
                  placeholder="Enter number"
                />

                <div className="text-center mt-2 text-sm text-gray-600">
                  Choose between 1-50 questions
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumberOfQuestions(num.toString())}
                    className={`p-2 rounded-lg border-2 text-sm font-semibold transition-all duration-200 hover:shadow-md ${
                      Number(numberOfQuestions) === num
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-blue-300 text-gray-700"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              📋 Your Selection Summary
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
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
          </div>

          <div className="text-center">
            <Button
              onClick={handleStartWorksheet}
              disabled={
                Number(numberOfQuestions) < 1 || Number(numberOfQuestions) > 50
              }
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
  const [percentage, setPercentage] = useState<number | null>(null);

  const handlePreferencesSelected = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setShowPreferences(false);
    // removed direct fetch here to avoid double fetch/race with useEffect which will call fetchQuestionsBasedOnPreferences
    // fetchQuestionsBasedOnPreferences(preferences);
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

        if (num1 < num2) {
          [num1, num2] = [num2, num1];
        }

        if (preferences.complexity === "without-regrouping") {
          [num1, num2] = adjustForNoRegrouping(num1, num2, min, max);
        }

        questions.push(
          createQuestion(num1, num2, questions.length, preferences)
        );
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
    const questions: Question[] = [];
    let attempts = 0;
    const maxTotalAttempts = count * 50; // Prevent infinite loops

    while (questions.length < count && attempts < maxTotalAttempts) {
      let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
      let num2 = Math.floor(Math.random() * (max - min + 1)) + min;

      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }

      if (preferences.complexity === "without-regrouping") {
        [num1, num2] = adjustForNoRegrouping(num1, num2, min, max);
      }

      // Only add the question if it meets our criteria
      if (
        preferences.complexity !== "without-regrouping" ||
        !requiresCarryingInMultiplication(num1, num2)
      ) {
        questions.push(
          createQuestion(num1, num2, questions.length, preferences)
        );
      }

      attempts++;
    }

    // If we couldn't generate enough questions, fill the rest with simple ones
    while (questions.length < count) {
      const simpleNum1 = 2;
      const simpleNum2 = 3;
      questions.push(
        createQuestion(simpleNum1, simpleNum2, questions.length, preferences)
      );
    }

    return questions;
  };

  const adjustForNoRegrouping = (
    num1: number,
    num2: number,
    min: number,
    max: number
  ): [number, number] => {
    const maxAttempts = 100;
    let attempts = 0;

    while (
      requiresCarryingInMultiplication(num1, num2) &&
      attempts < maxAttempts
    ) {
      // Instead of generating completely new numbers, try to adjust the second number's digits
      const num2Str = String(num2);
      let newNum2 = "";

      // Build a new second number digit by digit to avoid carrying
      for (let i = 0; i < num2Str.length; i++) {
        const digit = parseInt(num2Str[i]);
        // Choose a digit that won't cause carrying when multiplied by any digit of num1
        const num1Str = String(num1);
        let safeDigit = digit;

        // Find a digit that doesn't cause carrying with any digit of num1
        let foundSafe = false;
        for (let testDigit = 1; testDigit <= 9 && !foundSafe; testDigit++) {
          let causesCarrying = false;
          for (let j = 0; j < num1Str.length; j++) {
            const num1Digit = parseInt(num1Str[j]);
            if (num1Digit * testDigit > 9) {
              causesCarrying = true;
              break;
            }
          }
          if (!causesCarrying) {
            safeDigit = testDigit;
            foundSafe = true;
            break;
          }
        }

        newNum2 += safeDigit.toString();
      }

      num2 = parseInt(newNum2);
      if (num2 < min) {
        num2 = min;
      }
      if (num2 > max) {
        num2 = max;
      }

      // Ensure num1 is still larger than num2
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }

      attempts++;
    }

    // If we still have carrying after max attempts, return the best we can find
    if (requiresCarryingInMultiplication(num1, num2)) {
      // Fallback: use smaller numbers that are guaranteed to work
      const fallbackMin = Math.pow(10, Math.floor(String(min).length / 2));
      const fallbackMax = Math.pow(10, Math.ceil(String(min).length / 2)) - 1;
      num1 =
        Math.floor(Math.random() * (fallbackMax - fallbackMin + 1)) +
        fallbackMin;
      num2 =
        Math.floor(Math.random() * (fallbackMax - fallbackMin + 1)) +
        fallbackMin;

      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
    }

    return [num1, num2];
  };

  const requiresCarryingInMultiplication = (
    num1: number,
    num2: number
  ): boolean => {
    const str2 = String(num2);

    for (let i = 0; i < str2.length; i++) {
      const digit = parseInt(str2[str2.length - 1 - i]);
      const partialProduct = num1 * digit;

      if (partialProduct > 9) {
        return true;
      }
    }

    return false;
  };

  // Updated createQuestion to dynamically create partial products based on second number's digits
  const createQuestion = (
    num1: number,
    num2: number,
    id: number,
    preferences: UserPreferences
  ): Question => {
    const numDigits = preferences.numberOfDigits;
    const maxResultDigits = numDigits * 2; // More realistic result length

    // Get number of digits in the second number to determine partial products needed
    const num2Digits = String(num2).length;

    // Create partial products and carries dynamically
    const partialProducts: { [key: string]: string[] } = {};
    const carries: { [key: string]: string } = {};

    // Create partial product rows based on second number's digits
    for (let i = 0; i < num2Digits; i++) {
      partialProducts[`partialProduct${i + 1}`] =
        Array(maxResultDigits).fill("");
    }

    // Create carry fields - more carries for more digits
    const maxCarries = Math.max(2, numDigits);
    for (let i = 0; i < maxCarries; i++) {
      carries[`carry${i + 1}`] = "";
    }

    return {
      id: id + 1,
      number1: num1,
      number2: num2,
      userAnswer: Array(maxResultDigits).fill(""),
      partialProducts,
      carries,
      isCorrect: undefined,
    };
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
  }, [showPreferences, userPreferences]);

  const handleAnswerDigitChange = (
    questionId: number,
    digitIndex: number,
    value: string
  ) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              userAnswer: q.userAnswer.map((digit, index) =>
                index === digitIndex ? cleanValue : digit
              ),
            }
          : q
      )
    );
  };

  const handlePartialProductDigitChange = (
    questionId: number,
    productKey: string,
    digitIndex: number,
    value: string
  ) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              partialProducts: {
                ...q.partialProducts,
                [productKey]: q.partialProducts[productKey].map(
                  (digit, index) => (index === digitIndex ? cleanValue : digit)
                ),
              },
            }
          : q
      )
    );
  };

  const handleCarryChange = (
    questionId: number,
    carryKey: string,
    value: string
  ) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1);
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

  const arrayToString = (arr: string[]): string => {
    return arr.join("").replace(/^0+/, "") || "0";
  };

  const checkAnswers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build answers in the shape backend expects: carries -> carryOnesToTens, carryTensToHundreds ...
      const answersToVerify = questions.map((q) => {
        // expanded backend carry keys to cover up to 4 carry positions
        const carryBackendKeys = [
          "carryOnesToTens",
          "carryTensToHundreds",
          "carryHundredsToThousands",
          "carryThousandsToTenThousands",
        ];
        const carryValues: { [key: string]: number } = {};

        // sort internal carry keys by numeric suffix: carry1, carry2, ...
        const carryKeys = Object.keys(q.carries).sort((a, b) => {
          const ai = parseInt(a.replace(/\D/g, "")) || 0;
          const bi = parseInt(b.replace(/\D/g, "")) || 0;
          return ai - bi;
        });
        carryKeys.forEach((k, idx) => {
          const backendKey = carryBackendKeys[idx] || `carry${idx + 1}`;
          const raw = q.carries[k];
          // ensure empty strings are converted to 0
          carryValues[backendKey] = raw === "" ? 0 : parseInt(raw) || 0;
        });

        // partial products map in ascending order partialProduct1..partialProductN
        const partialProductBackendKeys = [
          "partialProduct1",
          "partialProduct2",
          "partialProduct3",
          "partialProduct4",
        ];
        const partialProductsOrdered: { [key: string]: number } = {};
        const ppKeys = Object.keys(q.partialProducts).sort((a, b) => {
          const ai = parseInt(a.replace(/\D/g, "")) || 0;
          const bi = parseInt(b.replace(/\D/g, "")) || 0;
          return ai - bi;
        });
        ppKeys.forEach((k, idx) => {
          const backendKey =
            partialProductBackendKeys[idx] || `partialProduct${idx + 1}`;
          // arrayToString already returns "0" for fully empty digits; parseInt(...) || 0 ensures numeric 0
          const rawValue = parseInt(arrayToString(q.partialProducts[k])) || 0;
          // multiply by place value so partialProduct2 (tens) becomes value*10, partialProduct3 becomes *100, etc.
          partialProductsOrdered[backendKey] = rawValue * Math.pow(10, idx);
        });

        return {
          number1: q.number1,
          number2: q.number2,
          // arrayToString returns "0" when the digits are empty -> parseInt -> 0
          answer: parseInt(arrayToString(q.userAnswer)) || 0,
          carries: carryValues as any,
          partialProducts: partialProductsOrdered as any,
        };
      });

      const data = await mathService.verifyMultiplicationAnswers(
        answersToVerify
      );

      // Apply backend response to question state for per-field marking
      setQuestions((prev) =>
        prev.map((q, idx) => {
          const correctPartial = data.correctPartialProducts?.[idx] || {};
          const correctCarries = data.correctCarries?.[idx] || {};

          return {
            ...q,
            isCorrect:
              q.number1 * q.number2 ===
              (parseInt(arrayToString(q.userAnswer)) || 0),
            partialProductsCorrect:
              data.results[idx]?.includes("Perfect") ||
              data.results[idx]?.includes("partial products correct") ||
              false,
            carriesCorrect: true,
            correctPartialProducts: correctPartial,
            correctCarries: correctCarries,
          } as Question;
        })
      );

      setScore(data.score);
      setShowResults(true);
      setPercentage(data.percentage);
      setIsResultModalOpen(true);
    } catch (err) {
      setError("Failed to verify answers. Please try again.");
      console.error("Error verifying answers:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumberToArray = (num: number, totalDigits: number): string[] => {
    const numStr = num.toString();
    const paddedStr = numStr.padStart(totalDigits, " ");
    return paddedStr.split("");
  };

  const renderQuestion = (question: Question) => {
    const numDigits = userPreferences?.numberOfDigits || 2;
    const maxResultDigits = numDigits * 2;
    const num2Digits = String(question.number2).length;

    const num1Array = formatNumberToArray(question.number1, maxResultDigits);
    const num2Array = formatNumberToArray(question.number2, maxResultDigits);
    const correctAnswer = question.number1 * question.number2;
    const userAnswer = parseInt(arrayToString(question.userAnswer)) || 0;

    // Get partial product keys in order
    const partialProductKeys = Object.keys(question.partialProducts).sort();

    // Helpers to get per-digit correctness
    const formatNumberToDigitArray = (
      n: number | undefined,
      totalDigits: number
    ) => {
      const s = (n ?? 0).toString();
      return s.padStart(totalDigits, " ").split("");
    };

    // Map backend carry keys to internal carry keys order (carry1 -> carryOnesToTens, carry2 -> carryTensToHundreds)
    const carryBackendOrder = [
      "carryOnesToTens",
      "carryTensToHundreds",
      "carryHundredsToThousands",
    ];
    const carryInternalKeys = Object.keys(question.carries).sort(); // carry1, carry2, ...

    return (
      <Card key={question.id} className="p-6">
        <CardHeader>
          <CardTitle className="text-center">Question {question.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <div className="bg-gray-50 p-6 rounded-lg font-mono text-center">
              {/* Carry row - only show if with regrouping */}
              {userPreferences?.complexity === "with-regrouping" && (
                <div className="flex justify-end mb-2">
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                    }}
                  >
                    {Array.from({ length: maxResultDigits }).map((_, index) => {
                      // assign carry inputs to the rightmost positions
                      const carrySlotIndex =
                        index - (maxResultDigits - carryInternalKeys.length);
                      const carryKey =
                        carryInternalKeys[carrySlotIndex] || null;
                      const backendCarryKey =
                        carryBackendOrder[carrySlotIndex] || null;
                      const correctCarryValue =
                        backendCarryKey && question.correctCarries
                          ? (question.correctCarries as any)[backendCarryKey]
                          : undefined;
                      const userCarryValue = carryKey
                        ? question.carries[carryKey] || ""
                        : "";

                      // Determine correctness for this carry cell
                      const isCorrect =
                        showResults &&
                        backendCarryKey &&
                        correctCarryValue !== undefined
                          ? String(correctCarryValue) === String(userCarryValue)
                          : undefined;

                      const baseClass = `w-8 h-6 text-center text-xs border rounded`;
                      const colorClass =
                        showResults && isCorrect !== undefined
                          ? isCorrect
                            ? "bg-green-100 border-green-500"
                            : "bg-red-100 border-red-500"
                          : "border-transparent";

                      return (
                        <input
                          key={`carry-${index}`}
                          type="text"
                          maxLength={1}
                          className={`${baseClass} ${
                            index >= maxResultDigits - carryInternalKeys.length
                              ? "border-gray-300"
                              : "border-transparent"
                          } ${colorClass}`}
                          value={
                            index >=
                              maxResultDigits - carryInternalKeys.length &&
                            carryKey
                              ? question.carries[carryKey] || ""
                              : ""
                          }
                          onChange={(e) => {
                            if (carryKey) {
                              handleCarryChange(
                                question.id,
                                carryKey,
                                e.target.value
                              );
                            }
                          }}
                          disabled={showResults}
                          style={{
                            visibility:
                              index >=
                              maxResultDigits - carryInternalKeys.length
                                ? "visible"
                                : "hidden",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* First and second numbers and partial products rendering unchanged except coloring for result rows */}
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

              {/* Dynamic partial product rows with per-digit coloring */}
              {partialProductKeys.map((productKey, productIndex) => {
                // correct number from backend for this partial product
                const backendKey = `partialProduct${productIndex + 1}`;
                const correctNumber =
                  (question.correctPartialProducts &&
                    (question.correctPartialProducts as any)[backendKey]) ??
                  0;
                const correctDigits = formatNumberToDigitArray(
                  correctNumber,
                  maxResultDigits
                );

                return (
                  <div key={productKey}>
                    <div className="flex justify-end mb-2 relative">
                      {productIndex > 0 && (
                        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-lg">
                          +
                        </div>
                      )}
                      <div
                        className="grid gap-1"
                        style={{
                          gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                        }}
                      >
                        {Array.from({ length: maxResultDigits }).map(
                          (_, index) => {
                            const userDigit =
                              question.partialProducts[productKey][index] || "";
                            const correctDigit =
                              correctDigits[index] === " "
                                ? ""
                                : correctDigits[index];

                            let cellClass =
                              "w-8 h-8 text-center text-sm border rounded ";
                            if (showResults) {
                              if (String(userDigit) === String(correctDigit)) {
                                cellClass += "bg-green-100 border-green-500";
                              } else {
                                cellClass += "bg-red-100 border-red-500";
                              }
                            } else {
                              cellClass += "border-gray-300";
                            }

                            return (
                              <input
                                key={`${productKey}-${index}`}
                                type="text"
                                maxLength={1}
                                className={cellClass}
                                value={userDigit}
                                onChange={(e) => {
                                  handlePartialProductDigitChange(
                                    question.id,
                                    productKey,
                                    index,
                                    e.target.value
                                  );
                                }}
                                disabled={showResults}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="border-t-2 border-gray-400 my-3"></div>

              {/* Final answer with per-digit correctness */}
              <div className="flex justify-end">
                <div
                  className="grid gap-1"
                  style={{
                    gridTemplateColumns: `repeat(${maxResultDigits}, 2rem)`,
                  }}
                >
                  {Array.from({ length: maxResultDigits }).map((_, index) => {
                    const userDigit = question.userAnswer[index] || "";
                    const correctDigits = formatNumberToDigitArray(
                      correctAnswer,
                      maxResultDigits
                    );
                    const correctDigit =
                      correctDigits[index] === " " ? "" : correctDigits[index];

                    let className = `w-8 h-10 text-center text-lg border rounded font-mono `;
                    if (showResults) {
                      className +=
                        userDigit === correctDigit
                          ? "bg-green-100 border-green-500"
                          : "bg-red-100 border-red-500";
                    } else {
                      className += "border-gray-300";
                    }

                    return (
                      <input
                        key={`answer-${index}`}
                        type="text"
                        maxLength={1}
                        className={className}
                        value={userDigit}
                        onChange={(e) => {
                          handleAnswerDigitChange(
                            question.id,
                            index,
                            e.target.value
                          );
                        }}
                        disabled={showResults}
                      />
                    );
                  })}
                </div>
              </div>

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
              onClick={fetchQuestions}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCcw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
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

          {isResultModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
                  <p className="text-gray-600 mb-4">
                    Here's how you performed on the Multiplication worksheet
                  </p>

                  <div
                    className={`text-5xl font-bold mb-4 ${
                      score === questions.length
                        ? "text-green-600"
                        : score! >= questions.length * 0.7
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {percentage}%
                  </div>

                  <p className="text-gray-600 text-lg mb-4">
                    You got {questions.filter((q) => q.isCorrect).length} out of{" "}
                    {questions.length} questions correct!
                  </p>

                  {score === questions.length && (
                    <div className="text-2xl mb-4">🎉 Perfect Score! 🎉</div>
                  )}
                </div>

                <div className="flex justify-center gap-2 mt-6">
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiplicationWorksheet;

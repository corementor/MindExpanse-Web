import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { useNavigate } from "react-router-dom";
import { images } from "@/constants/images";
import { Button } from "@/components/ui/button";
import { FileCheck, Minus, RefreshCcw, Settings, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface UserPreferences {
  complexity: "with-regrouping" | "without-regrouping";
  numberOfDigits: number;
}

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
    thousands: string;
    hundreds: string;
    tens: string;
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

const PreferenceSelect: React.FC<{
  onPreferencesSelected: (preferences: UserPreferences) => void;
}> = ({ onPreferencesSelected }) => {
  const [complexity, setComplexity] = useState<
    "with-regrouping" | "without-regrouping"
  >("with-regrouping");

  const [numberOfDigits, setNumberOfDigits] = useState<number>(2);

  const handleStartWorksheet = () => {
    const preferences = { complexity, numberOfDigits };
    console.log("Selected preferences:", preferences);
    onPreferencesSelected(preferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
          >
            <Settings className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Customize Your Worksheet
          </h1>
          <p className="text-gray-600 text-lg">
            Set your preferences to create the perfect subtraction practice
            experience
          </p>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              🎯 Choose Complexity Level
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  complexity === "without-regrouping"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => setComplexity("without-regrouping")}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-gray-800">
                    Without Regrouping
                  </h4>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
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
                <p className="text-gray-600 text-sm mb-3">
                  Simple subtraction problems where no borrowing is required
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-center">
                  <div> 654</div>
                  <div>- 321</div>
                  <div className="border-t border-gray-400 pt-1"> 333</div>
                </div>
              </div>

              <div
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  complexity === "with-regrouping"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setComplexity("with-regrouping")}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-gray-800">
                    With Regrouping
                  </h4>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
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
                <p className="text-gray-600 text-sm mb-3">
                  Advanced problems requiring borrowing from the next column
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-center">
                  <div className="text-xs text-blue-600"> 1 ¹</div>
                  <div> 602</div>
                  <div>- 389</div>
                  <div className="border-t border-gray-400 pt-1"> 213</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              🔢 Number of Digits
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[2, 3, 4, 5].map((digits) => (
                <div
                  key={digits}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md text-center ${
                    numberOfDigits === digits
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => setNumberOfDigits(digits)}
                >
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      numberOfDigits === digits
                        ? "text-purple-600"
                        : "text-gray-700"
                    }`}
                  >
                    {digits}
                  </div>
                  <div className="text-sm text-gray-600">
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

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 p-6 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              📋 Your Selection Summary
            </h3>
            <div className="space-y-2 text-gray-700">
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
                {NUM_QUESTIONS} practice problems
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
              className="px-12 py-4 text-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🚀 Start My Worksheet
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

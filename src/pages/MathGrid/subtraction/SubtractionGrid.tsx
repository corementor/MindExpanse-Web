import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Settings, Calculator, Hash, HelpCircle, FileText, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubtractionOptions {
  complexity: 'without-regrouping' | 'with-regrouping';
  digits: 2 | 3 | 4;
  questions: 4 | 6 | 8 | 10;
}

type Question = {
  top: number;
  bottom: number;
};

const generateQuestions = (digits: number, count: number): Question[] => {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    let b = Math.floor(Math.random() * (max - min + 1)) + min;
    if (a < b) [a, b] = [b, a]; // Ensure result is not negative
    questions.push({ top: a, bottom: b });
  }

  return questions;
};

const Subtraction: React.FC = () => {
  const [view, setView] = useState<"setup" | "worksheet">("setup");
  const [options, setOptions] = useState<SubtractionOptions>({
    complexity: 'with-regrouping',
    digits: 4,
    questions: 4,
  });
  const [questions, setQuestions] = useState<Question[]>([]);

  const updateOption = <K extends keyof SubtractionOptions>(
    key: K,
    value: SubtractionOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleStart = () => {
    setQuestions(generateQuestions(options.digits, options.questions));
    setView("worksheet");
  };

  if (view === "worksheet") {
    return (
      <div className="p-6 max-w-5xl mx-auto font-sans">
        {/* Practice Mode */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setView("setup")}
            className="px-3 py-2 bg-gray-200 rounded"
          >
            ← Change Preferences
          </button>
          <h2 className="text-xl font-bold">
            Subtraction Practice
            <span className="text-sm font-normal ml-2">
              {options.complexity} • {options.digits} digits
            </span>
          </h2>
          <button
            onClick={handleStart}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded"
          >
            🔄 New Questions
          </button>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {questions.map((q, index) => {
            const topStr = q.top.toString().padStart(options.digits, " ");
            const bottomStr = q.bottom.toString().padStart(options.digits, " ");
            return (
              <div key={index} className="border p-4 rounded shadow-sm">
                <div className="font-semibold mb-1">Qn {index + 1}</div>
                <div className="flex flex-col gap-1 items-center font-mono text-xl">
                  <div className="flex gap-2">
                    {Array(options.digits).fill("").map((_, i) => (
                      <div key={i} className="w-8 h-8 border rounded"></div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {topStr.split("").map((d, i) => (
                      <div key={i} className="w-8 h-8 border flex items-center justify-center">{d}</div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xl mr-1">−</span>
                    {bottomStr.split("").map((d, i) => (
                      <div key={i} className="w-8 h-8 border flex items-center justify-center">{d}</div>
                    ))}
                  </div>
                  <div className="border-t border-black w-full mt-1 mb-1"></div>
                  <div className="flex gap-2">
                    {Array(options.digits).fill("").map((_, i) => (
                      <div key={i} className="w-8 h-8 border rounded bg-blue-50"></div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:opacity-90">
            Check Answers
          </button>
        </div>
      </div>
    );
  }

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
            Set your preferences to create the perfect subtraction practice experience
          </p>
        </div>

        <div className="space-y-8">
          {/* Complexity Selection */}
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
                  options.complexity === "without-regrouping"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => updateOption('complexity', 'without-regrouping')}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-gray-800">
                    Without Regrouping
                  </h4>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      options.complexity === "without-regrouping"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {options.complexity === "without-regrouping" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Simple subtraction problems where no borrowing is required
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-center">
                  <div> 543</div>
                  <div>- 321</div>
                  <div className="border-t border-gray-400 pt-1"> 222</div>
                </div>
              </div>

              <div
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  options.complexity === "with-regrouping"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => updateOption('complexity', 'with-regrouping')}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-gray-800">
                    With Regrouping
                  </h4>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      options.complexity === "with-regrouping"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {options.complexity === "with-regrouping" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Advanced problems requiring borrowing from the next column
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-center relative">
                  <div className="text-xs text-blue-600 absolute -top-2 left-1/2 transform -translate-x-1/2">
                    ⁴ ¹
                  </div>
                  <div> 521</div>
                  <div>- 287</div>
                  <div className="border-t border-gray-400 pt-1"> 234</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Number of Digits Selection */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              🔢 Number of Digits
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 2 as const, range: '10-99' },
                { value: 3 as const, range: '100-999' },
                { value: 4 as const, range: '1000-9999' },
              ].map(({ value, range }) => (
                <div
                  key={value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md text-center ${
                    options.digits === value
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => updateOption('digits', value)}
                >
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      options.digits === value
                        ? "text-purple-600"
                        : "text-gray-700"
                    }`}
                  >
                    {value}
                  </div>
                  <div className="text-sm text-gray-600">{range}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Number of Questions Selection */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              📄 Number of Questions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[4, 6, 8, 10].map((num) => (
                <div
                  key={num}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md text-center ${
                    options.questions === num
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => updateOption('questions', num as 4 | 6 | 8 | 10)}
                >
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      options.questions === num
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {num}
                  </div>
                  <div className="text-sm text-gray-600">
                    {num} questions to practice
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Preview */}
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
                {options.complexity === "with-regrouping"
                  ? "With Regrouping (Advanced)"
                  : "Without Regrouping (Basic)"}
              </p>
              <p>
                <span className="font-semibold">Number of Digits:</span>{" "}
                {options.digits} digits per number
              </p>
              <p>
                <span className="font-semibold">Questions:</span>{" "}
                {options.questions} practice problems
              </p>
            </div>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              onClick={handleStart}
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

export default Subtraction;
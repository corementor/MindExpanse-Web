import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileCheck, X, RefreshCcw, Settings, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface UserPreferences {
  complexity: "with-regrouping" | "without-regrouping";
  numberOfDigits: number;
  numberOfQuestions: number;
}

interface Question {
  id: number;
  number1: number;
  number2: number;
  correctAnswer: number;
  partialProducts: number[];
  userPartialProducts: string[];
  userAdditionSteps: string[];
  userFinalAnswer: string;
  carryNumbers: {
    thousands: string;
    hundreds: string;
    tens: string;
  };
  isCorrect?: boolean;
  carriesCorrect?: boolean;
}

interface VerifyResponse {
  results: string[];
  score: number;
  percentage: number;
  maxScore: number;
  total: number;
}

interface PreferenceSelectProps {
  onPreferencesSelected: (preferences: UserPreferences) => void;
}

const PreferenceSelect: React.FC<PreferenceSelectProps> = ({ onPreferencesSelected }) => {
  const [complexity, setComplexity] = useState<
    "with-regrouping" | "without-regrouping"
  >("with-regrouping");

  const [numberOfDigits, setNumberOfDigits] = useState<number>(2);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(4);

  const handleStartWorksheet = () => {
    const preferences = { complexity, numberOfDigits, numberOfQuestions };
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
            Set your preferences to create the perfect multiplication practice
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
                  Simple multiplication problems where no carrying is required
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-center">
                  <div> 21</div>
                  <div>× 13</div>
                  <div className="border-t border-gray-400 pt-1">
                    <div className="text-sm"> 63</div>
                    <div className="text-sm">+210</div>
                    <div className="border-t border-gray-400 pt-1">273</div>
                  </div>
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
                  Advanced problems requiring carrying over to the next column
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-center">
                  <div className="text-xs text-blue-600 mb-1"> ¹ ² </div>
                  <div> 47</div>
                  <div>× 38</div>
                  <div className="border-t border-gray-400 pt-1">
                    <div className="text-sm"> 376</div>
                    <div className="text-sm">+1410</div>
                    <div className="border-t border-gray-400 pt-1">1786</div>
                  </div>
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
              {[2, 3, 4].map((digits) => (
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
                      : "1000-9999"}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              📝 Number of Questions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[4, 6, 8, 10].map((numQuestions) => (
                <div
                  key={numQuestions}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md text-center ${
                    numberOfQuestions === numQuestions
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setNumberOfQuestions(numQuestions)}
                >
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      numberOfQuestions === numQuestions
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {numQuestions}
                  </div>
                  <div className="text-sm text-gray-600">
                    {numQuestions} questions to practice
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
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
                {numberOfQuestions} practice problems
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
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

// Random number generation functions
const generateRandomNumber = (digits: number, complexity: string): number => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  
  if (complexity === "without-regrouping") {
    // For without regrouping, ensure no carrying is needed
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (needsCarrying(num, digits));
    return num;
  } else {
    // For with regrouping, ensure carrying is needed
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

const needsCarrying = (num: number, digits: number): boolean => {
  const str = num.toString();
  for (let i = 0; i < str.length; i++) {
    if (parseInt(str[i]) > 5) return true;
  }
  return false;
};

const calculatePartialProducts = (num1: number, num2: number): number[] => {
  const num2Str = num2.toString();
  const partialProducts: number[] = [];
  
  for (let i = num2Str.length - 1; i >= 0; i--) {
    const digit = parseInt(num2Str[i]);
    const position = num2Str.length - 1 - i;
    const product = num1 * digit * Math.pow(10, position);
    if (product > 0) {
      partialProducts.push(product);
    }
  }
  
  return partialProducts;
};

const generateQuestion = (preferences: UserPreferences, id: number): Question => {
  const number1 = generateRandomNumber(preferences.numberOfDigits, preferences.complexity);
  const number2 = generateRandomNumber(2, preferences.complexity);
  const partialProducts = calculatePartialProducts(number1, number2);
  
  return {
    id,
    number1,
    number2,
    correctAnswer: number1 * number2,
    partialProducts,
    userPartialProducts: new Array(partialProducts.length).fill(""),
    userAdditionSteps: new Array(partialProducts.length).fill(""),
    userFinalAnswer: "",
    carryNumbers: {
      thousands: "",
      hundreds: "",
      tens: "",
    },
  };
};

// Multiplication Grid Component
const MultiplicationPractice: React.FC<{
  preferences: UserPreferences;
  onBack: () => void;
}> = ({ preferences, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [preferences]);

  const generateQuestions = () => {
    const newQuestions: Question[] = [];
    for (let i = 1; i <= preferences.numberOfQuestions; i++) {
      newQuestions.push(generateQuestion(preferences, i));
    }
    setQuestions(newQuestions);
    setIsChecked(false);
  };

  const handlePartialProductChange = (questionId: number, index: number, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            userPartialProducts: q.userPartialProducts.map((pp, i) => i === index ? value : pp)
          }
        : q
    ));
  };

  const handleAdditionStepChange = (questionId: number, index: number, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            userAdditionSteps: q.userAdditionSteps.map((as, i) => i === index ? value : as)
          }
        : q
    ));
  };

  const handleFinalAnswerChange = (questionId: number, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            userFinalAnswer: value
          }
        : q
    ));
  };

  const handleCarryChange = (questionId: number, field: string, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            carryNumbers: {
              ...q.carryNumbers,
              [field]: value
            }
          }
        : q
    ));
  };

  const checkAnswers = () => {
    const updatedQuestions = questions.map(q => {
      const userFinalAnswerNum = parseInt(q.userFinalAnswer) || 0;
      const partialProductsCorrect = q.partialProducts.every((pp, index) => {
        const userPP = parseInt(q.userPartialProducts[index]) || 0;
        return userPP === pp;
      });
      
      return {
        ...q,
        isCorrect: userFinalAnswerNum === q.correctAnswer && partialProductsCorrect
      };
    });
    
    setQuestions(updatedQuestions);
    setIsChecked(true);
  };

  const formatNumberForDisplay = (num: number, minWidth: number = 5): string[] => {
    const str = num.toString().padStart(minWidth, ' ');
    return str.split('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Preferences
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Multiplication Worksheet
              </h1>
              <p className="text-gray-600">
                {preferences.complexity === "with-regrouping" ? "With" : "Without"} Regrouping • {preferences.numberOfDigits} digits
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {questions.map((question) => {
              const num1Digits = formatNumberForDisplay(question.number1, 5);
              const num2Digits = formatNumberForDisplay(question.number2, 5);
              
              return (
                <Card key={question.id} className="p-6">
                  <CardHeader>
                    <CardTitle>Question {question.id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg font-mono">
                        {/* Carry numbers for regrouping */}
                        {preferences.complexity === "with-regrouping" && (
                          <div className="grid grid-cols-5 gap-2 mb-2">
                            <div></div>
                            <input
                              type="text"
                              maxLength={1}
                              className="w-8 h-6 text-center text-xs border rounded"
                              value={question.carryNumbers.thousands}
                              onChange={(e) => handleCarryChange(question.id, 'thousands', e.target.value)}
                            />
                            <input
                              type="text"
                              maxLength={1}
                              className="w-8 h-6 text-center text-xs border rounded"
                              value={question.carryNumbers.hundreds}
                              onChange={(e) => handleCarryChange(question.id, 'hundreds', e.target.value)}
                            />
                            <input
                              type="text"
                              maxLength={1}
                              className="w-8 h-6 text-center text-xs border rounded"
                              value={question.carryNumbers.tens}
                              onChange={(e) => handleCarryChange(question.id, 'tens', e.target.value)}
                            />
                            <div></div>
                          </div>
                        )}
                        
                        {/* First number */}
                        <div className="grid grid-cols-5 gap-2 mb-2">
                          {num1Digits.map((digit, index) => (
                            <div key={`num1-${index}`} className="w-10 h-10 flex items-center justify-center text-lg">
                              {digit.trim() && digit}
                            </div>
                          ))}
                        </div>
                        
                        {/* Multiplication symbol and second number */}
                        <div className="grid grid-cols-5 gap-2 mb-2">
                          <div className="w-10 h-10 flex items-center justify-center text-lg">×</div>
                          {num2Digits.slice(1).map((digit, index) => (
                            <div key={`num2-${index}`} className="w-10 h-10 flex items-center justify-center text-lg">
                              {digit.trim() && digit}
                            </div>
                          ))}
                        </div>
                        
                        {/* Horizontal line */}
                        <div className="border-t-2 border-gray-400 my-2"></div>
                        
                        {/* Partial products */}
                        {question.partialProducts.map((partialProduct, index) => (
                          <div key={`partial-${index}`} className="relative">
                            <div className="grid grid-cols-5 gap-2 mb-2">
                              {/* Add plus sign for addition steps (except first partial product) */}
                              {index > 0 && (
                                <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-lg font-bold text-gray-600">
                                  +
                                </div>
                              )}
                              {formatNumberForDisplay(0, 5).map((_, digitIndex) => (
                                <input
                                  key={`partial-input-${index}-${digitIndex}`}
                                  type="text"
                                  maxLength={1}
                                  className={`w-10 h-8 text-center text-sm border rounded ${
                                    isChecked 
                                      ? (parseInt(question.userPartialProducts[index]) || 0) === partialProduct
                                        ? 'bg-green-100 border-green-500' 
                                        : 'bg-red-100 border-red-500'
                                      : 'border-gray-300'
                                  }`}
                                  value={question.userPartialProducts[index]?.[digitIndex] || ''}
                                  onChange={(e) => {
                                    const newValue = question.userPartialProducts[index] || '';
                                    const updatedValue = newValue.substring(0, digitIndex) + e.target.value + newValue.substring(digitIndex + 1);
                                    handlePartialProductChange(question.id, index, updatedValue);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {/* Addition line if more than one partial product */}
                        {question.partialProducts.length > 1 && (
                          <div className="border-t-2 border-gray-400 my-2"></div>
                        )}
                        
                        {/* Final answer */}
                        <div className="grid grid-cols-5 gap-2">
                          {formatNumberForDisplay(0, 5).map((_, index) => (
                            <input
                              key={`final-${index}`}
                              type="text"
                              maxLength={1}
                              className={`w-10 h-10 text-center text-lg border rounded font-mono ${
                                isChecked 
                                  ? (parseInt(question.userFinalAnswer) || 0) === question.correctAnswer
                                    ? 'bg-green-100 border-green-500' 
                                    : 'bg-red-100 border-red-500'
                                  : 'border-gray-300'
                              }`}
                              value={question.userFinalAnswer[index] || ''}
                              onChange={(e) => {
                                const newValue = question.userFinalAnswer || '';
                                const updatedValue = newValue.substring(0, index) + e.target.value + newValue.substring(index + 1);
                                handleFinalAnswerChange(question.id, updatedValue);
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Show correct answers when checked */}
                        {isChecked && !question.isCorrect && (
                          <div className="mt-4 text-center text-green-600 text-sm">
                            <div>Partial Products: {question.partialProducts.join(', ')}</div>
                            <div>Final Answer: {question.correctAnswer}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button 
              onClick={checkAnswers}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Check Answers
            </Button>
          </div>

          {/* Results summary */}
          {isChecked && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">Results</h3>
              <p className="text-lg">
                Score: {questions.filter(q => q.isCorrect).length} / {questions.length}
              </p>
              <p className="text-gray-600">
                {Math.round((questions.filter(q => q.isCorrect).length / questions.length) * 100)}% Correct
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
const Index: React.FC = () => {
  const [showPreferences, setShowPreferences] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const handlePreferencesSelected = (selectedPreferences: UserPreferences) => {
    setPreferences(selectedPreferences);
    setShowPreferences(false);
  };

  const handleBack = () => {
    setShowPreferences(true);
  };

  if (showPreferences) {
    return <PreferenceSelect onPreferencesSelected={handlePreferencesSelected} />;
  }

  return (
    <MultiplicationPractice 
      preferences={preferences!} 
      onBack={handleBack}
    />
  );
};

export default Index;

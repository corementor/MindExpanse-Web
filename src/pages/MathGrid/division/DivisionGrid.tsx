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
  complexity: "with-remainder" | "without-remainder";
  numberOfDigits: number;
  numberOfQuestions: number;
}

interface Question {
  id: number;
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  userQuotient: string;
  userRemainder: string;
  workingSteps: string[];
  isCorrect?: boolean;
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
    "with-remainder" | "without-remainder"
  >("with-remainder");

  const [numberOfDigits, setNumberOfDigits] = useState<number>(2);
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(4);

  const handleStartWorksheet = () => {
    const preferences = { complexity, numberOfDigits, numberOfQuestions };
    console.log("Selected preferences:", preferences);
    onPreferencesSelected(preferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
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
            className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4"
          >
            <Settings className="w-10 h-10 text-green-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Customize Your Division Worksheet
          </h1>
          <p className="text-gray-600 text-lg">
            Set your preferences to create the perfect division practice
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
                  complexity === "without-remainder"
                    ? "border-green-500 bg-green-50 shadow-md"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => setComplexity("without-remainder")}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-gray-800">
                    Without Remainder
                  </h4>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      complexity === "without-remainder"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {complexity === "without-remainder" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Simple division problems that divide evenly with no remainder
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-center">
                  <div className="text-sm">    12</div>
                  <div className="text-sm border-b border-l border-gray-400 inline-block">3 ) 36</div>
                  <div className="text-sm">    36</div>
                  <div className="text-sm">    --</div>
                  <div className="text-sm">     0</div>
                </div>
              </div>

              <div
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  complexity === "with-remainder"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setComplexity("with-remainder")}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-gray-800">
                    With Remainder
                  </h4>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      complexity === "with-remainder"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {complexity === "with-remainder" && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  Advanced problems that may have remainders after division
                </p>
                <div className="bg-gray-50 p-3 rounded-lg font-mono text-center">
                  <div className="text-sm">    13 R2</div>
                  <div className="text-sm border-b border-l border-gray-400 inline-block">4 ) 54</div>
                  <div className="text-sm">    4</div>
                  <div className="text-sm">    --</div>
                  <div className="text-sm">    14</div>
                  <div className="text-sm">    12</div>
                  <div className="text-sm">    --</div>
                  <div className="text-sm">     2</div>
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
              🔢 Dividend Digits
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
                {complexity === "with-remainder"
                  ? "With Remainder (Advanced)"
                  : "Without Remainder (Basic)"}
              </p>
              <p>
                <span className="font-semibold">Dividend Digits:</span>{" "}
                {numberOfDigits} digits
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
              className="px-12 py-4 text-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              🚀 Start My Division Worksheet
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Random number generation functions
const generateRandomDivisor = (): number => {
  return Math.floor(Math.random() * 9) + 2; // 2-10
};

const generateRandomDividend = (digits: number, divisor: number, complexity: string): number => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  
  if (complexity === "without-remainder") {
    // Generate a number that divides evenly
    const quotient = Math.floor(Math.random() * (Math.floor(max / divisor) - Math.floor(min / divisor))) + Math.floor(min / divisor);
    return quotient * divisor;
  } else {
    // Generate any number in range (may have remainder)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

const generateQuestion = (preferences: UserPreferences, id: number): Question => {
  const divisor = generateRandomDivisor();
  const dividend = generateRandomDividend(preferences.numberOfDigits, divisor, preferences.complexity);
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  
  return {
    id,
    dividend,
    divisor,
    quotient,
    remainder,
    userQuotient: "",
    userRemainder: "",
    workingSteps: new Array(10).fill(""), // More space for working steps
  };
};

// Division Practice Component with worksheet-style layout
const DivisionPractice: React.FC<{
  preferences: UserPreferences;
  onBack: () => void;
}> = ({ preferences, onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [studentName, setStudentName] = useState("");

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

  const handleQuotientChange = (questionId: number, digitIndex: number, value: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const quotientArray = q.userQuotient.split('');
        quotientArray[digitIndex] = value;
        return {
          ...q,
          userQuotient: quotientArray.join('')
        };
      }
      return q;
    }));
  };

  const handleRemainderChange = (questionId: number, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            userRemainder: value
          }
        : q
    ));
  };

  const handleWorkingStepChange = (questionId: number, index: number, value: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            workingSteps: q.workingSteps.map((step, i) => i === index ? value : step)
          }
        : q
    ));
  };

  const checkAnswers = () => {
    const updatedQuestions = questions.map(q => {
      const userQuotientNum = parseInt(q.userQuotient) || 0;
      const userRemainderNum = parseInt(q.userRemainder) || 0;
      
      const quotientCorrect = userQuotientNum === q.quotient;
      const remainderCorrect = preferences.complexity === "without-remainder" 
        ? q.remainder === 0 
        : userRemainderNum === q.remainder;
      
      return {
        ...q,
        isCorrect: quotientCorrect && remainderCorrect
      };
    });
    
    setQuestions(updatedQuestions);
    setIsChecked(true);
  };

  const getQuotientDigits = (quotient: number) => {
    return quotient.toString().split('');
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-6">
            Division {preferences.complexity === "with-remainder" ? "With" : "Without"} Remainder
          </h1>
          
          <div className="flex items-center justify-start mb-8">
            <span className="text-lg font-semibold mr-4">Name:</span>
            <div className="border-b-2 border-black w-96">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full py-2 text-lg bg-transparent focus:outline-none"
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Preferences
          </Button>
          <Button 
            variant="outline" 
            onClick={generateQuestions}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            New Questions
          </Button>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-8">
          {questions.map((question, index) => {
            const quotientDigits = getQuotientDigits(question.quotient);
            const dividendStr = question.dividend.toString();
            
            return (
              <div key={question.id} className="flex flex-col">
                <div className="text-lg font-semibold mb-4">{index + 1}.</div>
                
                <div className="font-mono text-xl leading-relaxed">
                  {/* Quotient input boxes */}
                  <div className="flex items-center mb-2">
                    <div className="w-8"></div> {/* Space for problem number alignment */}
                    <div className="flex space-x-1">
                      {dividendStr.split('').map((_, digitIndex) => (
                        <input
                          key={digitIndex}
                          type="text"
                          maxLength={1}
                          className={`w-8 h-8 border-2 border-black text-center text-lg font-bold ${
                            isChecked 
                              ? question.isCorrect 
                                ? 'bg-green-100' 
                                : 'bg-red-100'
                              : 'bg-white'
                          }`}
                          onChange={(e) => handleQuotientChange(question.id, digitIndex, e.target.value)}
                        />
                      ))}
                      {preferences.complexity === "with-remainder" && (
                        <>
                          <span className="mx-2 text-lg font-bold">R</span>
                          <input
                            type="text"
                            maxLength={2}
                            className={`w-12 h-8 border-2 border-black text-center text-lg font-bold ${
                              isChecked 
                                ? question.isCorrect 
                                  ? 'bg-green-100' 
                                  : 'bg-red-100'
                                : 'bg-white'
                            }`}
                            value={question.userRemainder}
                            onChange={(e) => handleRemainderChange(question.id, e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Division problem layout */}
                  <div className="flex items-start">
                    <div className="text-lg font-bold mr-2">{question.divisor}</div>
                    <div className="relative">
                      <div className="border-l-2 border-t-2 border-black pl-3 pt-1">
                        <div className="text-lg font-bold">{question.dividend}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Working space with input boxes */}
                  <div className="ml-8 mt-4 space-y-2">
                    {[0, 1, 2, 3, 4, 5].map((stepIndex) => (
                      <div key={stepIndex} className="flex items-center">
                        <input
                          type="text"
                          className="w-16 h-8 border border-black text-center text-lg bg-white"
                          value={question.workingSteps[stepIndex] || ''}
                          onChange={(e) => handleWorkingStepChange(question.id, stepIndex, e.target.value)}
                        />
                        {stepIndex % 2 === 1 && stepIndex < 5 && (
                          <div className="ml-2 border-t border-black w-12"></div>
                        )}
                      </div>
                    ))}
                    
                    {/* Final remainder box for with-remainder problems */}
                    {preferences.complexity === "with-remainder" && (
                      <div className="flex items-center mt-4">
                        <input
                          type="text"
                          className="w-12 h-8 border border-black text-center text-lg bg-white"
                          value={question.workingSteps[6] || ''}
                          onChange={(e) => handleWorkingStepChange(question.id, 6, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Show correct answers when checked */}
                  {isChecked && !question.isCorrect && (
                    <div className="mt-4 text-green-600 text-sm font-normal">
                      <div>Correct: {question.quotient}</div>
                      {preferences.complexity === "with-remainder" && question.remainder > 0 && (
                        <div>Remainder: {question.remainder}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mb-8">
          <Button 
            onClick={checkAnswers}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-lg"
          >
            Check Answers
          </Button>
        </div>

        {/* Results summary */}
        {isChecked && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg text-center border-2 border-gray-300">
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
  );
};

// Main Component
const Division: React.FC = () => {
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
    <DivisionPractice 
      preferences={preferences!} 
      onBack={handleBack}
    />
  );
};

export default Division;
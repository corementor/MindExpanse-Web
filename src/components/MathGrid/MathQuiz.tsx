import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { RefreshCcw, Plus } from "lucide-react";

interface Question {
  number1: number;
  number2: number;
  userAnswer: string;
}

const MathQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const num_questions: number = 12;
  const fetchQuestions = () => {
    setLoading(true);
    Promise.all(
      Array.from({ length: num_questions }, () =>
        fetch(`https://mind-expanse.onrender.com/api/math/generate`)
          .then((response) => response.json())
          .catch((error) => {
            console.error("Error fetching question:", error);
            return { number1: 0, number2: 0 };
          })
      )
    ).then((data: Question[]) => {
      setQuestions(data.map((q) => ({ ...q, userAnswer: "" })));
      setResults([]);
      setScore(null);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].userAnswer = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    setLoading(true);
    fetch(`https://mind-expanse.onrender.com/api/math/verify-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        questions.map((q) => ({
          answer: parseInt(q.userAnswer, 10),
        }))
      ),
    })
      .then((response) => response.json())
      .then((data) => {
        setResults(data.results);
        setScore(data.score);
      })
      .catch((error) => console.error("Error verifying answers:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-w-[700px] border-[1px] border-gray-200 rounded-md p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center">
          Solve these Addition Questions
        </h2>
        <Button
          variant="ghost"
          onClick={fetchQuestions}
          title="Reshuffle Questions"
        >
          <RefreshCcw className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </Button>
      </div>

      {loading ? (
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-whiteTheme-primaryColor border-r-transparent align-[center]"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {questions.map((q, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 bg-gray-100 p-4 rounded-md relative"
            >
              {/* Added question number */}
              <span className="absolute top-2 left-2 text-sm text-gray-500 font-semibold">
                Q{index + 1}
              </span>

              <div className="flex flex-col items-end gap-1">
                <span className="text-2xl font-bold">{q.number1}</span>
                <div className="flex items-end gap-1">
                  <Button variant="ghost" className="text-2xl font-bold">
                    <Plus />
                  </Button>
                  <span className="text-2xl font-bold">{q.number2}</span>
                </div>

                <div className="w-full border-b-2 border-gray-300"></div>
                <input
                  type="number"
                  className="w-16 text-2xl font-bold text-center border-2 border-gray-300 rounded-md  px-1"
                  value={q.userAnswer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-4 mb-4 mt-4">
        <Button onClick={handleSubmit}>Submit All</Button>
      </div>

      {score !== null && (
        <div className="p-4 mt-4 rounded-md text-center text-white font-medium bg-blue-500">
          <span>
            Your Score: {score}/{num_questions}
          </span>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Results:</h3>
          <ul className="list-disc pl-6">
            {results.map((result, index) => (
              <li
                key={index}
                className={`${
                  result.startsWith("Correct")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Q{index + 1}: {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MathQuiz;

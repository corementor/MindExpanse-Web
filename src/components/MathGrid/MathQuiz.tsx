import React, { useState, useEffect, FormEvent } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react"; // Icons

const api = "https://mind-expanse.onrender.com/api/math";

interface Question {
  number1: number;
  number2: number;
  userAnswer: string; // Answer input by the user
}

const MathQuiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);

  // Fetch 10 questions from the backend
  const fetchQuestions = () => {
    Promise.all(
      Array.from({ length: 10 }, () =>
        fetch(`${api}/generate`)
          .then((response) => response.json())
          .catch((error) => {
            console.error("Error fetching question:", error);
            return { number1: 0, number2: 0 }; // Default on error
          })
      )
    ).then((data: Question[]) => {
      setQuestions(data.map((q) => ({ ...q, userAnswer: "" }))); // Reset answers
      setResults([]);
      setScore(null);
    });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle change in an individual answer
  const handleAnswerChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].userAnswer = value;
    setQuestions(updatedQuestions);
  };

  // Submit all answers for evaluation
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    fetch(`${api}/verify-all`, {
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
        setResults(data.results); // Feedback for each question
        setScore(data.score); // Total score
      })
      .catch((error) => console.error("Error verifying answers:", error));
  };

  return (
    <div className="min-w-[700px] border-[1px] border-gray-200 rounded-md p-6 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center">Math Quiz</h2>
        <Button
          variant="ghost"
          onClick={fetchQuestions}
          title="Reshuffle Questions"
        >
          <RefreshCcw className="w-5 h-5 text-gray-600 hover:text-gray-800" />
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5">
          {questions.map((q, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <span className="text-xl font-semibold">
                Q{index + 1}: {q.number1} + {q.number2}
              </span>
              <Input
                className="w-20 text-center"
                type="number"
                placeholder="?"
                value={q.userAnswer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                required
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mb-4 mt-4">
          <Button type="submit">Submit All</Button>
        </div>
      </form>

      {score !== null && (
        <div className="p-4 mt-4 rounded-md text-center text-white font-medium bg-blue-500">
          <span>Your Score: {score}/10</span>
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

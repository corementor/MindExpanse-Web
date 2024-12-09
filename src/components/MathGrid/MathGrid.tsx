import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { api } from "../../utils/api";

interface MathProblem {
  id: number;
  firstNumber: number;
  secondNumber: number;
  operationType: string;
  correctAnswer: number;
  userAnswer?: number;
  isCorrect?: boolean;
}

const MathGrid: React.FC = () => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [results, setResults] = useState<{ [key: number]: boolean } | null>(
    null
  );
  const [operationType, setOperationType] = useState<
    "addition" | "subtraction"
  >("addition");

  const fetchProblems = async () => {
    try {
      const response = await axios.get<MathProblem[]>(`${api}/generate`, {
        params: {
          count: 10,
          operationType,
        },
      });

      if (!Array.isArray(response.data)) {
        console.error("Invalid response format:", response.data);
        setProblems([]);
      } else {
        setProblems(response.data);
      }

      setUserAnswers({});
      setResults(null);
    } catch (error) {
      console.error("Problem generation failed:", error);
      setProblems([]); // Reset to empty array on failure
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [operationType]);

  const handleAnswerChange = (problemId: number, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [problemId]: parseInt(answer) || undefined,
    }));
  };

  const submitWorksheet = async () => {
    try {
      const response = await axios.post<{ [key: number]: boolean }>(
        `${api}/check`,
        Object.values(problems).map((p) => ({
          ...p,
          userAnswer: userAnswers[p.id],
        }))
      );
      setResults(response.data);
    } catch (error) {
      console.error("Worksheet submission failed:", error);
    }
  };

  const renderProblem = (problem: MathProblem) => {
    const isCorrect = results ? results[problem.id] : undefined;
    const userAnswer = userAnswers[problem.id];

    return (
      <div key={problem.id} className="flex items-center gap-2">
        <span className="w-[80px] text-xl font-semibold">
          {problem.firstNumber} {operationType === "addition" ? "+" : "-"}{" "}
          {problem.secondNumber} =
        </span>
        <Input
          className={`w-16 text-center ${
            isCorrect === false ? "border-red-500" : ""
          }`}
          type="number"
          placeholder="?"
          value={userAnswer !== undefined ? userAnswer.toString() : ""}
          onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
          disabled={!!results}
        />
        {isCorrect !== undefined && (
          <span
            className={`ml-2 ${isCorrect ? "text-green-500" : "text-red-500"}`}
          >
            {isCorrect ? "✓" : `✗ (${problem.correctAnswer})`}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-w-[500px] border-[1px] border-gray-200 rounded-md p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Solve the {operationType} problems
      </h2>

      <div className="flex justify-center gap-4 mb-4">
        <Button
          variant={operationType === "addition" ? "default" : "outline"}
          onClick={() => setOperationType("addition")}
        >
          Addition
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Array.isArray(problems) && problems.map(renderProblem)}
      </div>

      {!results && (
        <Button
          className="w-full mt-4 flex items-center justify-center gap-2"
          onClick={submitWorksheet}
          disabled={Object.keys(userAnswers).length !== problems.length}
        >
          <Check className="w-4 h-4" />
          <span>Submit</span>
        </Button>
      )}

      {results && (
        <Button
          className="w-full mt-4"
          onClick={fetchProblems}
          variant="secondary"
        >
          Generate New Worksheet
        </Button>
      )}
    </div>
  );
};

export default MathGrid;

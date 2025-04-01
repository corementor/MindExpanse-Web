import React from "react";
import { useNavigate } from "react-router-dom";

const levels = [
  { digits: 1, example: "1 + 1", description: "Lowest level: Simple one-digit operations.", route: "/subtraction"},
  { digits: 2, example: "12 + 34", description: "Two-digit numbers, slightly harder.", route: "/subtraction" },
  { digits: 3, example: "123 + 456", description: "Three-digit operations.", route: "/subtraction"},
  { digits: 4, example: "1234 + 5678", description: "Four-digit operations, more challenging.", route: "/subtraction"},
  { digits: 5, example: "134567 + 485767", description: "Highest level: Complex five-digit calculations.", route: "/doubledigitadd"}
];

const NumberOfDigits: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Choose Your Difficulty Level</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        maxWidth: "800px",
        margin: "20px auto"
      }}>
        {levels.map((level, index) => (
          <div 
            key={index} 
            onClick={() => navigate(level.route)}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              textAlign: "center",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
              boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
              cursor: "pointer"
            }}
          >
            <h2>{level.digits} Digit{level.digits > 1 ? "s" : ""}</h2>
            <p>{level.example}</p>
            <small>{level.description}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NumberOfDigits;

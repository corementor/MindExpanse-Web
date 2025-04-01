import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layout/DashboardLayout";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignUp";
import NotFound from "@/pages/NotFound";
import ProtectedRoutes from "@/routes/outlets/ProtectedRoutes";

import DashboardPage from "@/pages/dashboard/DashboardPage";
import Subtraction from "@/pages/MathGrid/subtraction/Subtraction";
import SubtractionGrid from "@/pages/MathGrid/subtraction/SubtractionGrid";
import Addition from "@/pages/MathGrid/addition/Addition";
import AdditionGrid from "@/pages/MathGrid/addition/AdditionGrid";
import MultiplicationGrid from "@/pages/MathGrid/multiplication/MultiplicationGrid";
import Multiplication from "@/pages/MathGrid/multiplication/Multiplication";
import Division from "@/pages/MathGrid/division/Division";
import DivisionGrid from "@/pages/MathGrid/division/DivisionGrid";
import FourDigitAddition from "@/pages/MathGrid/addition/FourDigit";
import TwoDigit from "@/pages/MathGrid/addition/TwoDigit";
import Quadrant from "@/pages/MathGrid/addition/QuadrantAdd";
import Grouping from "@/pages/MathGrid/addition/GroupingAdd";
import NumberofDigits from "@/pages/MathGrid/addition/NumberofDigitsAdd";
import QuadrantSub from "@/pages/MathGrid/subtraction/QuadrantSub";
import GroupingSub from "@/pages/MathGrid/subtraction/GroupingSub";
import NumberofDigitsSub from "@/pages/MathGrid/subtraction/NumberofDigitsSub";
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/Quadrant" element={<Quadrant />} />
          {/* routes for SUbstraction */}
          <Route path="/QuadrantSub" element={<QuadrantSub />} />
          <Route path="/GroupingSub" element={<GroupingSub />} />
          <Route path="/NumberofDigitsSub" element={<NumberofDigitsSub />} />
          
          <Route path="/NumberofDigits" element={<NumberofDigits />} />
          <Route path="/Grouping" element={<Grouping />} />
          <Route path="/additiongrid" element={<AdditionGrid />} />
          <Route path="/addition" element={<Addition />} />
          <Route path="/subtractiongrid" element={<SubtractionGrid />} />
          <Route path="/subtraction" element={<Subtraction />} />
          <Route path="/multiplicationgrid" element={<MultiplicationGrid />} />
          <Route path="/multiply" element={<Multiplication />} />
          <Route path="/divisiongrid" element={<DivisionGrid />} />
          <Route path="/divide" element={<Division />} />
          <Route path="/doubledigitadd" element={<TwoDigit />} />
          <Route path="/multidigitadd" element={<FourDigitAddition />} />
        </Route>
      </Route>

      {/* Catch-All for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

import React from "react";
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layout/DashboardLayout";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignUp";
import NotFound from "@/pages/NotFound";
import ProtectedRoutes from "@/routes/outlets/ProtectedRoutes";

import DashboardPage from "@/pages/dashboard/DashboardPage";
import Subtraction from "@/pages/MathGrid/subtraction/Subtraction";

import Addition from "@/pages/MathGrid/addition/Addition";

import Multiplication from "@/pages/MathGrid/multiplication/Multiplication";
import DivisionWorkSheet from "@/pages/MathGrid/division/DivisionWorkSheet";
import DivisionGrid from "@/pages/MathGrid/division/DivisionGrid";

import TwoDigit from "@/pages/MathGrid/addition/TwoDigit";
import AdditionWorksheetApp from "@/pages/MathGrid/addition/AdditionWorksheet";
import TestWorksheet from "@/pages/MathGrid/addition/test";
import SubtractionWorkSheet from "@/pages/MathGrid/subtraction/SubtractionWorkSheet";
import MultiplicationGridWorkSheet from "@/pages/MathGrid/multiplication/MultiplicationGrid";
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
          <Route path="/additiongrid" element={<AdditionWorksheetApp />} />
          <Route path="/addition" element={<Addition />} />
          <Route path="/subtractiongrid" element={<SubtractionWorkSheet />} />
          <Route path="/subtraction" element={<Subtraction />} />
          <Route
            path="/multiplicationgrid"
            element={<MultiplicationGridWorkSheet />}
          />
          <Route path="/multiply" element={<Multiplication />} />
          <Route path="/divisiongrid" element={<DivisionWorkSheet />} />
          <Route path="/divide" element={<DivisionWorkSheet />} />
          <Route path="/doubledigitadd" element={<TwoDigit />} />
          {/* <Route path="/multidigitadd" element={<AdditionWorksheet />} /> */}
          <Route path="/multidigitadd" element={<TestWorksheet />} />
        </Route>
      </Route>

      {/* Catch-All for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

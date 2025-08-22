// src/routes/routes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layout/DashboardLayout";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignUp";
import NotFound from "@/pages/NotFound";
import ProtectedRoutes from "@/routes/outlets/ProtectedRoutes";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import DivisionWorkSheet from "@/pages/MathGrid/division/DivisionWorkSheet";
import AdditionWorksheetApp from "@/pages/MathGrid/addition/AdditionWorksheet";
import SubtractionWorkSheet from "@/pages/MathGrid/subtraction/SubtractionWorkSheet";
import MultiplicationWorksheet from "@/pages/MathGrid/multiplication/MultiplicationWorksheet";
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/additiongrid" element={<AdditionWorksheetApp />} />
          <Route path="/subtractiongrid" element={<SubtractionWorkSheet />} />
          <Route
            path="/multiplicationgrid"
            element={<MultiplicationWorksheet />}
          />
          <Route path="/divisiongrid" element={<DivisionWorkSheet />} />
        </Route>
      </Route>

      {/* Catch-All for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

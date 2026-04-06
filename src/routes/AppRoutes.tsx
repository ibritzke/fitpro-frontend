import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Layout } from "../components/layout/Layout";

import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminTrainers from "../pages/admin/AdminTrainers";
import TrainerDashboard from "../pages/trainer/Dashboard";
import Students from "../pages/trainer/Students";
import StudentDetail from "../pages/trainer/StudentDetail";
import Categories from "../pages/trainer/Categories";
import Exercises from "../pages/trainer/Exercises";
import WorkoutTypes from "../pages/trainer/WorkoutTypes";
import Templates from "../pages/trainer/Templates";
import StudentToday from "../pages/student/Today";
import StudentHistory from "../pages/student/History";

const PrivateRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 32 }}>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const RedirectByRole: React.FC = () => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 32 }}>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "TRAINER") return <Navigate to="/trainer/dashboard" replace />;
  return <Navigate to="/student/today" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute roles={["ADMIN"]}><AdminDashboard /></PrivateRoute>
        } />
        <Route path="/admin/trainers" element={
          <PrivateRoute roles={["ADMIN"]}><AdminTrainers /></PrivateRoute>
        } />

        {/* Trainer */}
        <Route path="/trainer/dashboard" element={
          <PrivateRoute roles={["TRAINER"]}><TrainerDashboard /></PrivateRoute>
        } />
        <Route path="/trainer/students" element={
          <PrivateRoute roles={["TRAINER"]}><Students /></PrivateRoute>
        } />
        <Route path="/trainer/students/:id" element={
          <PrivateRoute roles={["TRAINER"]}><StudentDetail /></PrivateRoute>
        } />
        <Route path="/trainer/categories" element={
          <PrivateRoute roles={["TRAINER"]}><Categories /></PrivateRoute>
        } />
        <Route path="/trainer/exercises" element={
          <PrivateRoute roles={["TRAINER"]}><Exercises /></PrivateRoute>
        } />
        <Route path="/trainer/workout-types" element={
          <PrivateRoute roles={["TRAINER"]}><WorkoutTypes /></PrivateRoute>
        } />
        <Route path="/trainer/templates" element={
          <PrivateRoute roles={["TRAINER"]}><Templates /></PrivateRoute>
        } />

        {/* Student */}
        <Route path="/student/today" element={
          <PrivateRoute roles={["STUDENT"]}><StudentToday /></PrivateRoute>
        } />
        <Route path="/student/history" element={
          <PrivateRoute roles={["STUDENT"]}><StudentHistory /></PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<RedirectByRole />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
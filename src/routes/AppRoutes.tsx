import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Login from "../pages/Login";

// Layouts
import { Layout } from "../components/layout/Layout"; // desktop (admin/trainer)
import { StudentLayout } from "../components/layout/StudentLayout"; // mobile-first aluno

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import AdminTrainers from "../pages/admin/AdminTrainers";

// Trainer
import TrainerDashboard from "../pages/trainer/Dashboard";
import Students from "../pages/trainer/Students";
import StudentDetail from "../pages/trainer/StudentDetail";
import Categories from "../pages/trainer/Categories";
import Exercises from "../pages/trainer/Exercises";
import WorkoutTypes from "../pages/trainer/WorkoutTypes";
import Templates from "../pages/trainer/Templates";

// Student
import StudentToday from "../pages/student/Today";
import StudentHistory from "../pages/student/History";
import StudentWeek from "../pages/student/StudentWeek";
import StudentProfile from "../pages/student/Profile";
// depois: StudentHome, StudentWeek, StudentProfile
import Account from "../pages/Account/Account";
/* =========================
   PRIVATE ROUTE
========================= */
const PrivateRoute: React.FC<{
  children: React.ReactNode;
  roles?: string[];
}> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 32 }}>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

/* =========================
   REDIRECT BY ROLE
========================= */
const RedirectByRole: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 32 }}>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "TRAINER":
      return <Navigate to="/trainer/dashboard" replace />;
    case "STUDENT":
      return <Navigate to="/student/home" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

/* =========================
   APP ROUTES
========================= */
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* ACCOUNT (Admin / Trainer / Student) */}
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Layout>
                <Account />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/trainers"
          element={
            <PrivateRoute roles={["ADMIN"]}>
              <Layout>
                <AdminTrainers />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* TRAINER */}
        <Route
          path="/trainer/dashboard"
          element={
            <PrivateRoute roles={["TRAINER"]}>
              <Layout>
                <TrainerDashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/trainer/students"
          element={
            <PrivateRoute roles={["TRAINER"]}>
              <Layout>
                <Students />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/trainer/students/:id"
          element={
            <PrivateRoute roles={["TRAINER"]}>
              <Layout>
                <StudentDetail />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/trainer/categories"
          element={
            <PrivateRoute roles={["TRAINER"]}>
              <Layout>
                <Categories />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/trainer/exercises"
          element={
            <PrivateRoute roles={["TRAINER"]}>
              <Layout>
                <Exercises />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/trainer/workout-types"
          element={
            <PrivateRoute roles={["TRAINER"]}>
              <Layout>
                <WorkoutTypes />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/trainer/templates"
          element={
            <PrivateRoute roles={["TRAINER"]}>
              <Layout>
                <Templates />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* STUDENT (Mobile First) */}
        <Route
          path="/student/today"
          element={
            <PrivateRoute roles={["STUDENT"]}>
              <StudentLayout>
                <StudentToday />
              </StudentLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/student/history"
          element={
            <PrivateRoute roles={["STUDENT"]}>
              <StudentLayout>
                <StudentHistory />
              </StudentLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/student/week"
          element={
            <PrivateRoute roles={["STUDENT"]}>
              <StudentLayout>
                <StudentWeek />
              </StudentLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <PrivateRoute roles={["STUDENT"]}>
              <StudentLayout>
                <StudentProfile />
              </StudentLayout>
            </PrivateRoute>
          }
        />

        {/* NOT AUTHORIZED */}
        <Route
          path="/not-authorized"
          element={
            <div style={{ padding: 32 }}>
              <h2>Acesso não autorizado</h2>
            </div>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<RedirectByRole />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

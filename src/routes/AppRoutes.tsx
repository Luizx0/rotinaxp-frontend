import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import HomePage from "../pages/HomePage/HomePage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProgressPage from "../pages/Progress/ProgressPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import RewardsPage from "../pages/Rewards/RewardsPage";
import TasksPage from "../pages/Tasks/TasksPage";
import { appPaths } from "./paths";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path={appPaths.root} element={isAuthenticated ? <Navigate to={appPaths.dashboard} replace /> : <HomePage />} />
      <Route path={appPaths.login} element={isAuthenticated ? <Navigate to={appPaths.dashboard} replace /> : <LoginPage />} />
      <Route path={appPaths.register} element={isAuthenticated ? <Navigate to={appPaths.dashboard} replace /> : <RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path={appPaths.dashboard} element={<DashboardPage />} />
          <Route path={appPaths.tasks} element={<TasksPage />} />
          <Route path={appPaths.rewards} element={<RewardsPage />} />
          <Route path={appPaths.progress} element={<ProgressPage />} />
          <Route path={appPaths.profile} element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={appPaths.root} replace />} />
    </Routes>
  );
}

export default AppRoutes;

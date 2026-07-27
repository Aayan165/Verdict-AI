import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import EvaluatePage from '../pages/EvaluatePage';
import EvaluationsPage from '../pages/EvaluationsPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import ModelComparisonPage from '../pages/ModelComparisonPage';
import ExperimentsPage from '../pages/ExperimentsPage';
import ExperimentDetailPage from '../pages/ExperimentDetailPage';
import ProfilePage from '../pages/ProfilePage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout title="Dashboard" subtitle="Monitor evaluations, scores, and experiment health in one place." />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route element={<AppLayout title="Evaluate" subtitle="Submit a prompt, response, and model name to run the adjudication workflow." />}>
          <Route path="/evaluate" element={<EvaluatePage />} />
        </Route>
        <Route element={<AppLayout title="Evaluations" subtitle="Browse and manage the saved evaluation history for your account." />}>
          <Route path="/evaluations" element={<EvaluationsPage />} />
        </Route>
        <Route element={<AppLayout title="Analytics" subtitle="Inspect aggregate scoring signals and verdict distributions." />}>
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
        <Route element={<AppLayout title="Model Comparison" subtitle="Compare models across accuracy, logic, completeness, and overall score." />}>
          <Route path="/model-comparison" element={<ModelComparisonPage />} />
        </Route>
        <Route element={<AppLayout title="Experiments" subtitle="Organize evaluations into experiment groups and export results." />}>
          <Route path="/experiments" element={<ExperimentsPage />} />
        </Route>
        <Route element={<AppLayout title="Experiment Details" subtitle="Inspect a single experiment and its attached evaluations." />}>
          <Route path="/experiments/:id" element={<ExperimentDetailPage />} />
        </Route>
        <Route element={<AppLayout title="Profile" subtitle="Review the authenticated session details from the current JWT." />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
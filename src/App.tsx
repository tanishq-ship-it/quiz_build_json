import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import QuizCreator from "./pages/QuizCreator";
import NotFound from "./pages/NotFound";
import Preview from "./pages/preview";
import PreviewPlay from "./pages/PreviewPlay";
import Editorial from "./pages/Editorial";
import PublicQuiz from "./pages/PublicQuiz";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes - for customers */}
        <Route path="/login" element={<Login />} />
        <Route path="/:quizId" element={<PublicQuiz />} />

        {/* Protected routes - admin only */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <QuizCreator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview"
          element={
            <ProtectedRoute>
              <Preview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview/:quizId"
          element={
            <ProtectedRoute>
              <Preview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editorion/:quizId"
          element={
            <ProtectedRoute>
              <Editorial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preview-play/:quizId"
          element={
            <ProtectedRoute>
              <PreviewPlay />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

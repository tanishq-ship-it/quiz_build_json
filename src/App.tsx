import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import LandingPage from "./pages/Landing";
import QuizCreator from "./pages/QuizCreator";
import NotFound from "./pages/NotFound";
import Preview from "./pages/preview";
import PreviewPlay from "./pages/PreviewPlay";
import Editorial from "./pages/Editorial";
import PublicQuiz from "./pages/PublicQuiz";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import EmailCollection from "./pages/EmailCollection";
import PaymentPage from "./pages/PaymentPage";
import EmailConfirm from "./pages/EmailConfirm";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing page - main public page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public routes - for customers */}
        <Route path="/login" element={<Login />} />

        {/* Payment flow routes (must be before /:quizId catch-all) */}
        <Route path="/email/:quizId" element={<EmailCollection />} />
        <Route path="/payment/:quizId" element={<PaymentPage />} />
        <Route path="/email-confirm/:quizId" element={<EmailConfirm />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* Protected routes - admin only */}
        <Route
          path="/admin"
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

        {/* Quiz playback (catch-all for quiz IDs - must be last) */}
        <Route path="/:quizId" element={<PublicQuiz />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

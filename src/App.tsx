import { Routes, Route } from "react-router-dom";
import QuizCreator from "./pages/QuizCreator";
import NotFound from "./pages/NotFound";
import Preview from "./pages/preview";
import PreviewPlay from "./pages/PreviewPlay";
import Editorial from "./pages/Editorial";
import PublicQuiz from "./pages/PublicQuiz";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizCreator />} />
      <Route path="/:quizId" element={<PublicQuiz />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/preview/:quizId" element={<Preview />} />
      <Route path="/preview-play/:quizId" element={<PreviewPlay />} />
      <Route path="/editorion/:quizId" element={<Editorial />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import QuizCreator from "./pages/QuizCreator";
import NotFound from "./pages/NotFound";
import Preview from "./pages/preview";
import PreviewPlay from "./pages/PreviewPlay";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizCreator />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/preview/:quizId" element={<Preview />} />
      <Route path="/preview-play/:quizId" element={<PreviewPlay />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

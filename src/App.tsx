import { Routes, Route } from 'react-router-dom';
import QuizCreator from './pages/QuizCreator';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizCreator />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

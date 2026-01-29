import logo from "../../assests/logo.png";

interface NavigationProps {
  quizId: string | null;
}

export default function Navigation({ quizId }: NavigationProps) {
  const handleTakeQuiz = () => {
    if (quizId) {
      window.location.href = `/${quizId}`;
    } else {
      // Scroll to quiz section if no quiz is set
      document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-black/5 bg-white/60 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="font-semibold tracking-tight text-lg flex items-center gap-2 text-black"
        >
          <img src={logo} alt="Mindsnack" className="w-8 h-8 rounded-lg" />
          Mindsnack
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="hidden sm:inline-flex text-sm font-medium text-neutral-600 hover:text-black transition-colors"
          >
            How it works
          </a>
          <button
            onClick={handleTakeQuiz}
            className="text-sm font-medium transition-colors text-white bg-black hover:bg-neutral-800 rounded-full px-4 py-2"
          >
            Take Quiz
          </button>
        </div>
      </div>
    </nav>
  );
}

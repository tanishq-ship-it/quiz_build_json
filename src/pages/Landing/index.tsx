import { useEffect, useState } from "react";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import SolutionSection from "./SolutionSection";
import QuizCTA from "./QuizCTA";
import FAQ from "./FAQ";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import { getPublicWebQuiz } from "../../services/api";

export default function LandingPage() {
  const [quizId, setQuizId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebQuiz = async () => {
      try {
        const webQuiz = await getPublicWebQuiz();
        if (webQuiz && webQuiz.quiz && webQuiz.quiz.live) {
          setQuizId(webQuiz.quizId);
        }
      } catch (error) {
        console.error("Failed to fetch web quiz:", error);
      }
    };

    fetchWebQuiz();
  }, []);

  return (
    <div className="antialiased selection:bg-[#6d3be8] selection:text-white mesh-gradient text-neutral-800 overflow-x-hidden scroll-smooth">
      <Navigation quizId={quizId} />
      <HeroSection quizId={quizId} />
      <ProblemSection />
      <SolutionSection />
      <QuizCTA quizId={quizId} />
      <FAQ />
      <FinalCTA quizId={quizId} />
      <Footer />
    </div>
  );
}

import { Icon } from "@iconify/react";

interface QuizCTAProps {
  quizId: string | null;
}

export default function QuizCTA({ quizId }: QuizCTAProps) {
  const handleTakeQuiz = () => {
    if (quizId) {
      window.location.href = `/${quizId}`;
    }
  };

  return (
    <section id="quiz" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#6d3be8]/5 -z-10"></div>
      <div className="md:p-16 text-center bg-white shadow-xl max-w-4xl mx-auto rounded-[2.5rem] p-8 relative overflow-hidden border border-neutral-100">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6d3be8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF812A]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto bg-neutral-50 rounded-2xl flex items-center justify-center mb-6 text-[#6d3be8] shadow-sm border border-neutral-100">
            <Icon icon="solar:magic-stick-3-linear" width={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-neutral-900">
            Where are your blind spots?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto text-neutral-600 font-light">
            Take our 2-minute diagnostic to identify your current bottlenecks.
            We'll generate a personalized skills roadmap just for you.
          </p>

          <button
            onClick={handleTakeQuiz}
            disabled={!quizId}
            className="group hover:scale-105 transition-all inline-flex items-center gap-3 text-base font-medium text-white bg-[#6d3be8] h-14 rounded-full px-10 shadow-lg shadow-[#6d3be8]/25 hover:bg-[#5b32c2] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Take the Free Quiz
            <Icon
              icon="solar:arrow-right-linear"
              width={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <p className="mt-6 text-xs text-neutral-400">
            No credit card required. Instant results.
          </p>
        </div>
      </div>
    </section>
  );
}

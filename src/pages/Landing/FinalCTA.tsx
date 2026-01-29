interface FinalCTAProps {
  quizId: string | null;
}

export default function FinalCTA({ quizId }: FinalCTAProps) {
  const handleTakeQuiz = () => {
    if (quizId) {
      window.location.href = `/${quizId}`;
    } else {
      // Scroll to quiz section if no quiz is set
      document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="text-center py-32 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#6d3be8]/5 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-semibold text-neutral-900 tracking-tight mb-8">
          Stop scrolling. Start growing.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.open("https://apps.apple.com/in/app/mindsnack-daily-microlearning/id6752513248", "_blank")}
            className="w-full sm:w-auto transition-colors hover:bg-[#5b32c2] text-sm font-medium text-white bg-[#6d3be8] h-12 rounded-full px-8 shadow-lg shadow-[#6d3be8]/30"
          >
            Install Mindsnack
          </button>
          <button
            onClick={handleTakeQuiz}
            className="w-full sm:w-auto transition-colors hover:bg-neutral-100 text-sm font-medium text-[#6d3be8] h-12 border border-[#6d3be8]/30 bg-white rounded-full px-8"
          >
            Take the Free Quiz
          </button>
        </div>
      </div>
    </section>
  );
}

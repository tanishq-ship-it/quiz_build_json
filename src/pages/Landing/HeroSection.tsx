import { Icon } from "@iconify/react";
import PhoneMockup from "./PhoneMockup";

interface HeroSectionProps {
  quizId: string | null;
}

export default function HeroSection({ quizId }: HeroSectionProps) {
  const handleTakeQuiz = () => {
    if (quizId) {
      window.location.href = `/${quizId}`;
    } else {
      // Scroll to quiz section if no quiz is set
      document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="overflow-hidden bg-slate-50 pt-32 pr-6 pb-20 pl-6 relative">
      {/* Abstract Background Orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#6d3be8]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-[#FF812A]/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="z-10 text-center max-w-4xl mr-auto ml-auto relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#6d3be8]/20 shadow-sm mb-8 animate-fade-in-up cursor-default">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
          </span>
          <span className="text-[11px] uppercase font-semibold text-neutral-600 tracking-wider">
            Now Available on iOS
          </span>
        </div>

        <h1 className="md:text-7xl lg:text-8xl leading-[1] text-5xl font-semibold text-neutral-900 tracking-tight mb-8">
          Lifeskills Simplified
        </h1>

        <p className="md:text-xl leading-relaxed text-lg font-light text-neutral-600 max-w-xl mr-auto mb-10 ml-auto">
          Actionable psychology and soft skills etc in 2-minute daily snacks.
          Build confidence and clarity without the fluff.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-20">
          <button
            onClick={() => window.open("https://apps.apple.com/in/app/mindsnack-daily-microlearning/id6752513248", "_blank")}
            className="sm:w-auto transition-all transform hover:-translate-y-0.5 flex gap-2 hover:bg-[#5b32c2] shadow-[#6d3be8]/20 text-sm font-medium text-white bg-[#6d3be8] w-full h-12 rounded-full pr-8 pl-8 shadow-lg gap-x-2 gap-y-2 items-center justify-center"
          >
            <Icon icon="solar:download-minimalistic-linear" width={20} />
            Get the App
          </button>
          <button
            onClick={handleTakeQuiz}
            className="sm:w-auto transition-all flex gap-2 group hover:bg-neutral-50 text-sm font-extrabold text-[#6d3be8] bg-white w-full h-12 border-[#6d3be8] border rounded-full pr-8 pl-8 gap-x-2 gap-y-2 items-center justify-center"
          >
            Take the Quiz -&gt;
          </button>
        </div>
      </div>

      {/* Phone Mockup */}
      <PhoneMockup />
    </section>
  );
}

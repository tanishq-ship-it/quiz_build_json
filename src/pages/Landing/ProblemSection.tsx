const featureCards = [
  {
    emoji: "🔬",
    title: "Science-Backed",
    description:
      "Every lesson is grounded in peer-reviewed research and psychological principles.",
    bgColor: "bg-blue-50",
    textColor: "text-blue-500",
    shadowColor: "hover:shadow-blue-500/5",
  },
  {
    emoji: "⚡",
    title: "Two-Minute Lessons",
    description:
      "Learn powerful life skills in bite-sized, digestible formats that fit your schedule.",
    bgColor: "bg-amber-50",
    textColor: "text-amber-500",
    shadowColor: "hover:shadow-amber-500/5",
  },
  {
    emoji: "🎯",
    title: "Real-World Focus",
    description:
      "From communication to decision-making, we tackle skills that matter every day.",
    bgColor: "bg-red-50",
    textColor: "text-red-500",
    shadowColor: "hover:shadow-red-500/5",
  },
  {
    emoji: "🌱",
    title: "Natural Growth",
    description:
      "No overwhelm, no burnout. Growth that feels effortless and sustainable.",
    bgColor: "bg-[#10B981]/10",
    textColor: "text-[#10B981]",
    shadowColor: "hover:shadow-[#10B981]/5",
  },
];

export default function ProblemSection() {
  return (
    <section className="px-6 py-24 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className={`p-8 rounded-3xl glass-panel group transition-all duration-300 hover:shadow-lg ${card.shadowColor}`}
            >
              <div className="text-4xl mb-6">{card.emoji}</div>
              <h3 className="text-lg font-semibold mb-3 text-neutral-900">
                {card.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

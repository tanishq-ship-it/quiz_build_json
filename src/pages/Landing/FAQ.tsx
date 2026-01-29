import { Icon } from "@iconify/react";

const faqItems = [
  {
    question: "How long are the lessons?",
    answer:
      "Every lesson is designed to be consumed in 3-5 minutes. We prioritize brevity and density of information over length.",
  },
  {
    question: "Is this just motivational content?",
    answer:
      'No. We don\'t do "you can do it" fluff. Mindsnack provides frameworks, cognitive models, and psychological tools based on research that you can actually use.',
  },
  {
    question: "Is it free to start?",
    answer:
      'Yes, the initial assessment and the "Essentials" track are completely free. You can unlock advanced tracks with a premium subscription.',
  },
];

export default function FAQ() {
  return (
    <section className="border-t border-neutral-200 py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold tracking-tight mb-12 text-center text-neutral-900">
          Common Questions
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={index}
              className="group border border-neutral-200 rounded-2xl open:bg-neutral-50 open:border-[#6d3be8]/30 transition-all bg-white overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between p-6 font-medium select-none text-neutral-900 hover:text-[#6d3be8] transition-colors">
                {item.question}
                <span className="transition-transform duration-300 group-open:rotate-180 text-neutral-400">
                  <Icon icon="solar:alt-arrow-down-linear" width={20} />
                </span>
              </summary>
              <div className="px-6 pb-6 text-sm leading-relaxed text-neutral-600">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

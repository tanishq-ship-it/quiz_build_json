import { Icon } from "@iconify/react";
import infocardImage from "../../assests/infocard.png";

export default function SolutionSection() {
  return (
    <section id="features" className="py-24 px-6 bg-white border-t border-neutral-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <div className="inline-block px-3 py-1 rounded-full border border-[#6d3be8]/20 bg-[#6d3be8]/5 text-xs font-bold text-[#6d3be8] mb-6 uppercase tracking-wider">
            The Mindsnack Method
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-neutral-900">
            Bite-sized growth. <br />
            <span className="text-[#6d3be8]">Maximum impact.</span>
          </h2>
          <p className="text-lg mb-8 leading-relaxed text-neutral-500">
            We distill complex frameworks into 3-minute practical lessons. No
            filler. Just the tools you need to upgrade your operating system.
          </p>

          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981] flex-shrink-0">
                <Icon icon="solar:check-circle-bold" width={16} />
              </div>
              <div>
                <span className="block font-semibold text-neutral-900">
                  Actionable immediately
                </span>
                <span className="block text-neutral-500 text-sm mt-1">
                  Apply what you learn the second you put your phone down.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="mt-1 w-8 h-8 rounded-full bg-[#FF812A]/10 flex items-center justify-center text-[#FF812A] flex-shrink-0">
                <Icon icon="solar:clock-circle-bold" width={16} />
              </div>
              <div>
                <span className="block font-semibold text-neutral-900">
                  Fits in the gaps
                </span>
                <span className="block text-neutral-500 text-sm mt-1">
                  Learn while commuting, brewing coffee, or waiting in line.
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Course Card */}
        <div className="flex-1 w-full max-w-md relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6d3be8]/20 to-[#FF812A]/20 rounded-[2rem] transform rotate-3 scale-105 blur-xl"></div>
          <div className="relative bg-white rounded-[1.5rem] shadow-2xl overflow-hidden border border-neutral-200">
            {/* Course Image */}
            <div className="relative">
              <img
                src={infocardImage}
                alt="Course thumbnail"
                className="w-full h-52 object-cover"
              />
              {/* Category Badge
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Icon icon="solar:star-outline" width={14} className="text-amber-500" />
                <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wide">
                  Confidence & Charisma
                </span>
              </div>
              {/* PRO Badge */}
              {/* <div className="absolute top-4 right-4 bg-[#10B981] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                PRO
              </div>  */}
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-2 leading-tight">
                Build First Impressions That Open Doors for Years
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                Tired of being forgettable? Learn the quiet signals of presence and leave impressions that stick long after you leave the room.
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mb-5 text-sm">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <Icon icon="solar:clock-circle-linear" width={16} className="text-neutral-400" />
                  <span>37 mins</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <Icon icon="solar:layers-linear" width={16} className="text-neutral-400" />
                  <span>12 lessons</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 font-semibold">
                  <Icon icon="solar:bolt-bold" width={16} />
                  <span>+1380 XP</span>
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-[#10B981] hover:bg-[#0d9668] transition-colors text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2">
                View Full Course
                <Icon icon="solar:arrow-right-linear" width={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

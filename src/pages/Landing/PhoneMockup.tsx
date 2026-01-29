import { Icon } from "@iconify/react";

export default function PhoneMockup() {
  return (
    <div className="relative max-w-[300px] md:max-w-[340px] mx-auto z-20">
      {/* Glow behind phone */}
      <div className="absolute -inset-4 bg-gradient-to-b from-[#6d3be8]/30 to-[#FF812A]/30 blur-2xl -z-10 rounded-full opacity-60"></div>

      {/* Phone Bezel */}
      <div className="bg-neutral-900 rounded-[3rem] p-3 shadow-2xl mockup-shadow border-4 border-neutral-800 relative">
        {/* Power/Volume Buttons */}
        <div className="absolute -right-1.5 top-24 w-1.5 h-16 bg-neutral-800 rounded-r-md"></div>
        <div className="absolute -left-1.5 top-24 w-1.5 h-10 bg-neutral-800 rounded-l-md"></div>
        <div className="absolute -left-1.5 top-36 w-1.5 h-16 bg-neutral-800 rounded-l-md"></div>

        {/* Screen */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden w-full h-[640px] relative flex flex-col">
          {/* Notch Area */}
          <div className="h-10 w-full flex justify-center pt-2 absolute top-0 z-20">
            <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
          </div>

          {/* App Header */}
          <div className="bg-[#F8F7FF] pt-14 px-6 pb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
                <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white overflow-hidden">
                <img
                  src="https://ui-avatars.com/api/?name=Alex&background=FF812A&color=fff"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-neutral-900 leading-tight mb-1">
              Good Morning,
            </h3>
            <p className="text-sm text-neutral-500">
              Ready for your daily upgrade?
            </p>
          </div>

          {/* Daily Snack Card */}
          <div className="px-6 -mt-4 relative z-10">
            <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-[#6d3be8]/10 text-[#6d3be8] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                  Productivity
                </div>
                <span className="text-xs font-mono text-neutral-400">
                  3 min
                </span>
              </div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                The "2-Minute Rule"
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                Stop procrastination by immediately doing tasks that take less
                than 2 minutes.
              </p>
              <div className="flex items-center gap-2">
                <button className="flex-1 bg-neutral-900 text-white rounded-full py-3 text-xs font-medium flex items-center justify-center gap-2">
                  <Icon icon="solar:play-bold" width={14} /> Start Lesson
                </button>
                <button className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-400">
                  <Icon icon="solar:bookmark-linear" width={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Categories / Feed */}
          <div className="px-6 mt-6 flex-1 overflow-hidden relative">
            {/* Fade at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent z-10"></div>

            <div className="flex justify-between items-end mb-4">
              <h5 className="font-medium text-neutral-900">Your Path</h5>
              <span className="text-[10px] text-[#6d3be8] font-medium">
                View all
              </span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-100/50">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
                  <Icon icon="solar:check-circle-bold" width={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">
                    Active Listening
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Completed yesterday
                  </div>
                </div>
              </div>
              {/* Item 2 */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-100/50 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-[#FF812A]/10 text-[#FF812A] flex items-center justify-center">
                  <Icon
                    icon="solar:lock-keyhole-minimalistic-linear"
                    width={20}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">
                    Negotiation 101
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Unlocks tomorrow
                  </div>
                </div>
              </div>
              {/* Item 3 */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-50 border border-neutral-100/50 opacity-40">
                <div className="w-10 h-10 rounded-xl bg-[#6d3be8]/10 text-[#6d3be8] flex items-center justify-center">
                  <Icon
                    icon="solar:lock-keyhole-minimalistic-linear"
                    width={20}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">
                    Deep Work
                  </div>
                  <div className="text-[10px] text-neutral-400">Locked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="absolute bottom-0 w-full bg-white border-t border-neutral-100 h-16 flex justify-around items-center px-6 pb-2 z-20">
            <div className="text-[#6d3be8] flex flex-col items-center gap-1">
              <Icon icon="solar:home-smile-bold" width={24} />
              <span className="text-[8px] font-medium">Home</span>
            </div>
            <div className="text-neutral-300 flex flex-col items-center gap-1">
              <Icon icon="solar:compass-linear" width={24} />
              <span className="text-[8px] font-medium">Explore</span>
            </div>
            <div className="text-neutral-300 flex flex-col items-center gap-1">
              <Icon icon="solar:user-circle-linear" width={24} />
              <span className="text-[8px] font-medium">Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

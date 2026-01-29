import logo from "../../assests/logo.png";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-neutral-200 bg-white text-center px-6">
      <div className="flex items-center justify-center gap-2 mb-6 text-neutral-900">
        <img src={logo} alt="Mindsnack" className="w-6 h-6 rounded" />
        <span className="font-semibold tracking-tight text-sm">MINDSNACK</span>
      </div>
      <div className="flex justify-center gap-8 mb-8 text-xs text-neutral-500 font-medium">
        <a href="#" className="transition-colors hover:text-[#6d3be8]">
          Privacy Policy
        </a>
        <a href="#" className="transition-colors hover:text-[#6d3be8]">
          Terms of Service
        </a>
        <a href="#" className="transition-colors hover:text-[#6d3be8]">
          Contact Support
        </a>
      </div>
      <p className="text-[10px] text-neutral-400">
        © 2024 Mindsnack Inc. All rights reserved.
      </p>
    </footer>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Terminal, Sparkles, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#101014] text-white border-t-[3px] border-[#101014] mt-20 relative">
      <div className="arcade-ribbon"></div>
      <div className="absolute -top-6 right-8 sm:right-16 w-8 h-8 bg-[#A77AF5] border-2 border-white flex items-center justify-center shadow-[2px_2px_0px_#101014]">
        <div className="w-4 h-4 bg-[#FFD21C] border border-[#101014]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-8 h-8 bg-[#FFD21C] border-2 border-white flex items-center justify-center font-mono font-black text-[#101014] text-base">
                LB
              </div>
              <span className="font-heading text-2xl font-black tracking-wider text-white">
                LEARN<span className="text-[#FFD21C]">BYTE</span>
              </span>
            </div>

            <a 
              href="mailto:Shikhar281204@gmail.com" 
              className="inline-flex items-center space-x-2 text-sm font-mono text-[#F1F0E9]/80 hover:text-[#FFD21C] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#FFD21C]" />
              <span>Shikhar281204@gmail.com</span>
            </a>

            <p className="mt-3 text-xs font-mono text-[#F1F0E9]/60 max-w-sm">
              Empowering self-directed learners to convert massive YouTube video playlists into mastery-level structured courses with NVIDIA Nemotron.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-mono font-bold tracking-widest text-[#FFD21C] uppercase mb-3 flex items-center space-x-1.5">
              <span>EXPLORE BY DOMAIN</span>
              <span className="w-2 h-2 bg-[#FFD21C] inline-block"></span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Link 
                to="/courses?category=DevOps" 
                className="bg-[#A77AF5] text-[#101014] p-3 border-2 border-white shadow-[3px_3px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all block group"
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase mb-1">DEVOPS</div>
                <div className="font-heading text-2xl font-black">42</div>
                <div className="text-[9px] font-mono text-[#101014]/70">COURSES</div>
              </Link>
              <Link 
                to="/courses?category=Programming" 
                className="bg-[#F34D43] text-[#101014] p-3 border-2 border-white shadow-[3px_3px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all block group"
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase mb-1">PROGRAMMING</div>
                <div className="font-heading text-2xl font-black">90</div>
                <div className="text-[9px] font-mono text-[#101014]/70">COURSES</div>
              </Link>
              <Link 
                to="/courses?category=AI%20%26%20Machine%20Learning" 
                className="bg-[#48B7EC] text-[#101014] p-3 border-2 border-white shadow-[3px_3px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all block group"
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase mb-1">AI & ML</div>
                <div className="font-heading text-2xl font-black">62</div>
                <div className="text-[9px] font-mono text-[#101014]/70">COURSES</div>
              </Link>
              <Link 
                to="/courses?category=Cloud%20Computing" 
                className="bg-[#35D68B] text-[#101014] p-3 border-2 border-white shadow-[3px_3px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all block group"
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase mb-1">CLOUD</div>
                <div className="font-heading text-2xl font-black">75</div>
                <div className="text-[9px] font-mono text-[#101014]/70">COURSES</div>
              </Link>
              <Link 
                to="/courses?category=Web%20Development" 
                className="bg-[#F27CB5] text-[#101014] p-3 border-2 border-white shadow-[3px_3px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all block group"
              >
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase mb-1">WEB DEV</div>
                <div className="font-heading text-2xl font-black">279</div>
                <div className="text-[9px] font-mono text-[#101014]/70">COURSES</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="py-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-[#F1F0E9]/80">
          <Link to="/" className="hover:text-[#FFD21C] transition-colors">Home</Link>
          <Link to="/courses" className="hover:text-[#FFD21C] transition-colors">Course Catalog</Link>
          <Link to="/study-plan" className="hover:text-[#FFD21C] transition-colors">Daily Planner</Link>
          <Link to="/quizzes" className="hover:text-[#FFD21C] transition-colors">AI Quiz Bank</Link>
          <Link to="/notes" className="hover:text-[#FFD21C] transition-colors">Video Notes</Link>
          <Link to="/profile" className="hover:text-[#FFD21C] transition-colors">Nemotron Settings</Link>
          <a href="#disclaimer" className="hover:text-[#FFD21C] transition-colors">Educational Fair Use Notice</a>
        </div>
        <p className="text-[11px] font-mono text-[#F1F0E9]/50 leading-relaxed max-w-4xl" id="disclaimer">
          LEARNBYTE does not host or re-upload third-party video media. All video playback is streamed directly through the official YouTube IFrame Embed API. Course syllabi, quizzes, summaries, and transcripts are generated automatically using NVIDIA Nemotron for transformative personal study purposes under fair use. All video copyrights belong to their respective YouTube creators.
        </p>
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-[#F1F0E9]/70">
            © 2026 LEARNBYTE • Built with NVIDIA Nemotron 340B & 70B
          </div>
          <div className="text-[#FFD21C] font-mono tracking-widest text-[11px]">
            00 6C 65 61 72 6E 62 79 74 65 20 61 69
          </div>
        </div>
      </div>
    </footer>
  );
};

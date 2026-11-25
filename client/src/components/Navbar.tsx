import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, BookOpen, Calendar, HelpCircle, 
  FileText, User, PlusCircle, Search, Cpu
} from 'lucide-react';
import { api } from '../services/api';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [nemotronInfo, setNemotronInfo] = useState<{ hasKey: boolean; model: string }>({
    hasKey: false,
    model: 'nvidia/nemotron-4-340b-instruct'
  });

  useEffect(() => {
    api.getAiSettings()
      .then(info => setNemotronInfo(info))
      .catch(() => {});
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'HOME', path: '/', icon: Sparkles },
    { name: 'MY COURSES', path: '/courses', icon: BookOpen },
    { name: 'STUDY PLAN', path: '/study-plan', icon: Calendar },
    { name: 'QUIZZES', path: '/quizzes', icon: HelpCircle },
    { name: 'MY NOTES', path: '/notes', icon: FileText },
    { name: 'DASHBOARD', path: '/dashboard', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#101014] border-b-[3px] border-[#101014] text-white">
      <div className="arcade-ribbon"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-[#FFD21C] border-2 border-[#FFFFFF] shadow-[2px_2px_0px_#FFFFFF] flex items-center justify-center font-mono font-black text-[#101014] text-xl transition-transform group-hover:scale-105">
              LB
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading text-2xl font-black tracking-wider text-white">LEARN<span className="text-[#FFD21C]">BYTE</span></span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#A77AF5] text-[#101014] font-bold border border-white">AI</span>
              </div>
              <span className="text-[9px] font-mono text-[#F1F0E9]/70 tracking-widest block uppercase -mt-1">
                YOUTUBE TO COURSE ENGINE
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 font-heading text-sm font-bold border-2 transition-all ${
                    active
                      ? 'bg-[#FFD21C] text-[#101014] border-[#FFD21C] shadow-[2px_2px_0px_#FFFFFF]'
                      : 'border-transparent text-[#F1F0E9] hover:border-white/50 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center space-x-3">
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 bg-[#101014] border border-[#35D68B] text-[#35D68B] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#35D68B] animate-pulse"></span>
              <span className="font-bold">NEMOTRON AI</span>
            </div>
            <Link
              to="/generate"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#FFD21C] text-[#101014] font-heading font-black text-sm border-2 border-white shadow-[2px_2px_0px_#FFFFFF] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all uppercase"
            >
              <PlusCircle className="w-4 h-4" />
              <span>NEW COURSE</span>
            </Link>
            <Link
              to="/profile"
              className={`w-9 h-9 border-2 flex items-center justify-center transition-all ${
                isActive('/profile') ? 'border-[#FFD21C] bg-[#FFD21C] text-[#101014]' : 'border-white text-white bg-white/10 hover:bg-white/20'
              }`}
              title="Profile & AI Settings"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Play, BookOpen, 
  BrainCircuit, Calendar, FileText, CheckCircle2, 
  HelpCircle, Clipboard, AlertCircle, Video, Layers, 
  Cpu, ArrowUpRight, PlusCircle
} from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { api } from '../services/api';
import { ICourse } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    api.getCourses()
      .then(data => {

        setCourses(data);
      })
      .catch(err => console.error('Failed to load courses:', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.includes('youtube.com') || text.includes('youtu.be'))) {
        setYoutubeUrl(text);
        setErrorMsg('');
      } else {
        setErrorMsg('Clipboard does not contain a valid YouTube link.');
      }
    } catch (e) {
      setErrorMsg('Could not read clipboard. Please paste manually.');
    }
  };

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) {
      setErrorMsg('Please paste a YouTube video or playlist URL first.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    navigate(`/generate?url=${encodeURIComponent(youtubeUrl.trim())}`);
  };

  const scrollToInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#101014] text-[#FFD21C] border-2 border-[#101014] shadow-neo-sm font-mono text-xs font-bold uppercase mb-6">
          <span className="w-2 h-2 bg-[#FFD21C] animate-pulse"></span>
          <span>POWERED BY NVIDIA NEMOTRON 340B & 70B</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-[#101014] uppercase tracking-tight leading-[0.95] mb-6">
          STOP WATCHING. <br className="hidden sm:inline" />
          <span className="text-[#A77AF5] underline decoration-[#101014] decoration-4 underline-offset-8">
            START LEARNING.
          </span>
        </h1>
        <p className="font-sans text-lg sm:text-xl text-[#101014]/80 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
          Turn any lengthy YouTube educational tutorial or playlist into your own structured, mastery-level online course in seconds.
        </p>
        <div className="max-w-3xl mx-auto bg-white border-[3px] border-[#101014] shadow-neo-lg p-4 sm:p-5 relative">
          <form onSubmit={handleGenerateSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Paste YouTube Video or Playlist URL here (e.g. youtube.com/watch?v=...)"
                className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-4 py-3.5 text-sm sm:text-base font-mono text-[#101014] placeholder-[#101014]/50 focus:outline-none focus:bg-white focus:border-[#A77AF5] transition-all"
              />
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#101014] text-[#FFD21C] text-xs font-mono font-bold hover:bg-[#A77AF5] hover:text-[#101014] border border-white transition-all flex items-center space-x-1"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PASTE</span>
              </button>
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 bg-[#FFD21C] text-[#101014] font-heading font-black text-sm sm:text-base border-2 border-[#101014] shadow-[3px_3px_0px_#101014] hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center space-x-2 uppercase whitespace-nowrap"
            >
              <Sparkles className="w-5 h-5 fill-[#101014]" />
              <span>GENERATE MY COURSE</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-3 text-left text-xs font-mono text-[#F34D43] font-bold flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-[#101014]/15 flex items-center justify-between text-left text-[11px] font-mono text-[#101014]/70">
            <span>PASTE ANY YOUTUBE LINK • SUPPORTS SINGLE VIDEOS & PLAYLISTS</span>
            <span className="hidden sm:inline font-bold text-[#A77AF5]">AUTOMATIC TRANSCRIPT EXTRACTION</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <div className="bg-white border-2 border-[#101014] shadow-neo p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-[#A77AF5] border-2 border-[#101014] shadow-[2px_2px_0px_#101014] flex items-center justify-center mb-3">
              <BrainCircuit className="w-5 h-5 text-[#101014]" />
            </div>
            <h3 className="font-heading text-lg font-black uppercase text-[#101014] mb-1">
              AI GENERATED LESSONS
            </h3>
            <p className="text-xs font-sans text-[#101014]/80 leading-relaxed">
              Nemotron breaks monster recordings into logical, bite-sized lessons with precise start and end timestamps.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#101014]/10 text-[10px] font-mono text-[#A77AF5] font-black uppercase">

          </div>
        </div>

        <div className="bg-white border-2 border-[#101014] shadow-neo p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-[#FFD21C] border-2 border-[#101014] shadow-[2px_2px_0px_#101014] flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-[#101014]" />
            </div>
            <h3 className="font-heading text-lg font-black uppercase text-[#101014] mb-1">
              SMART STUDY PLANNER
            </h3>
            <p className="text-xs font-sans text-[#101014]/80 leading-relaxed">
              Set your target date and daily study hours. LearnByte schedules daily tasks so you master the subject on time.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#101014]/10 text-[10px] font-mono text-[#101014] font-black uppercase">

          </div>
        </div>

        <div className="bg-white border-2 border-[#101014] shadow-neo p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-[#35D68B] border-2 border-[#101014] shadow-[2px_2px_0px_#101014] flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5 text-[#101014]" />
            </div>
            <h3 className="font-heading text-lg font-black uppercase text-[#101014] mb-1">
              TIMESTAMPED QUIZZES
            </h3>
            <p className="text-xs font-sans text-[#101014]/80 leading-relaxed">
              Every lesson comes with AI-generated quizzes. Missed a question? One click jumps the video right to where it was taught.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#101014]/10 text-[10px] font-mono text-[#35D68B] font-black uppercase">

          </div>
        </div>

        <div className="bg-white border-2 border-[#101014] shadow-neo p-5 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-[#F27CB5] border-2 border-[#101014] shadow-[2px_2px_0px_#101014] flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-[#101014]" />
            </div>
            <h3 className="font-heading text-lg font-black uppercase text-[#101014] mb-1">
              VIDEO-LINKED NOTES
            </h3>
            <p className="text-xs font-sans text-[#101014]/80 leading-relaxed">
              Jot down markdown notes that auto-tag the current video second. Click any note badge later to resume playback at that exact frame.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#101014]/10 text-[10px] font-mono text-[#F27CB5] font-black uppercase">

          </div>
        </div>
      </div>
      <div className="mb-16">
        <div className="bg-[#101014] text-white border-[3px] border-[#101014] shadow-neo-lg p-6 sm:p-10 relative overflow-hidden">
          <div className="arcade-ribbon absolute top-0 left-0 right-0"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FFD21C] text-[#101014] border-2 border-white shadow-[2px_2px_0px_#FFFFFF] font-mono text-xs font-black uppercase mb-4">
              <Video className="w-3.5 h-3.5" />
              <span>TRANSFORM ANY VIDEO INTO COURSE</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase text-white leading-tight">
                  CONVERT YOUTUBE INTO A <br className="hidden sm:inline" />
                  <span className="text-[#FFD21C]">STRUCTURED ACADEMY</span>
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#F1F0E9]/80 max-w-2xl mt-2 leading-relaxed">
                  Paste any programming tutorial, cloud crash course, full university lecture, or video playlist. NVIDIA Nemotron analyzes the transcript, creates a syllabus with bite-sized lessons, generates quizzes, and builds your daily study plan.
                </p>
              </div>

              <button
                onClick={scrollToInput}
                className="px-6 py-3 bg-[#35D68B] text-[#101014] font-heading font-black text-sm border-2 border-white shadow-[3px_3px_0px_#FFFFFF] hover:bg-[#2fc47d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center space-x-2 uppercase shrink-0 self-start lg:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>PASTE YOUR LINK NOW</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="bg-white text-[#101014] border-2 border-white p-5 shadow-[4px_4px_0px_#FFD21C] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 bg-[#FFD21C] border border-[#101014] font-mono text-xs font-black flex items-center justify-center">
                      01
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#101014]/60 uppercase">INPUT</span>
                  </div>
                  <h3 className="font-heading text-lg font-black uppercase mb-1">
                    PASTE YOUTUBE URL
                  </h3>
                  <p className="text-xs font-sans text-[#101014]/80 leading-relaxed">
                    Provide any single YouTube video or complete playlist link. LearnByte validates the stream and fetches creator metadata.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#101014]/15 text-[10px] font-mono text-[#101014]/70 font-bold">
                  ✓ Automatic Video & Playlist Detection
                </div>
              </div>
              <div className="bg-white text-[#101014] border-2 border-white p-5 shadow-[4px_4px_0px_#A77AF5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 bg-[#A77AF5] border border-[#101014] font-mono text-xs font-black flex items-center justify-center">
                      02
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#101014]/60 uppercase">NEMOTRON AI</span>
                  </div>
                  <h3 className="font-heading text-lg font-black uppercase mb-1">
                    TRANSCRIPT EXTRACTION
                  </h3>
                  <p className="text-xs font-sans text-[#101014]/80 leading-relaxed">
                    NVIDIA Nemotron parses the full audio transcript, detects key conceptual milestones, and organizes topics into modules.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#101014]/15 text-[10px] font-mono text-[#101014]/70 font-bold">
                  ✓ Preserved Video Timestamps
                </div>
              </div>
              <div className="bg-white text-[#101014] border-2 border-white p-5 shadow-[4px_4px_0px_#35D68B] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 bg-[#35D68B] border border-[#101014] font-mono text-xs font-black flex items-center justify-center">
                      03
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#101014]/60 uppercase">WORKSPACE</span>
                  </div>
                  <h3 className="font-heading text-lg font-black uppercase mb-1">
                    COMPLETE COURSE READY
                  </h3>
                  <p className="text-xs font-sans text-[#101014]/80 leading-relaxed">
                    Study with embedded playback, timestamped notes, instant quizzes with revisit-seek, and a paced daily learning schedule.
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-[#101014]/15 text-[10px] font-mono text-[#101014]/70 font-bold">
                  ✓ 100% Saved In Your Personal Library
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#101014]">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-[#35D68B] border border-[#101014]"></span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase text-[#101014]">
              CONTINUE LEARNING
            </h2>
          </div>
          {courses.length > 0 && (
            <button
              onClick={() => navigate('/courses')}
              className="text-xs font-mono font-bold text-[#101014] hover:text-[#A77AF5] flex items-center space-x-1"
            >
              <span>VIEW ALL ({courses.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white border-2 border-[#101014] shadow-neo animate-pulse"></div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (

          <div className="bg-white border-[3px] border-[#101014] shadow-neo-lg p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-[#FFD21C] border-2 border-[#101014] shadow-neo flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[#101014]" />
            </div>

            <h3 className="font-heading text-2xl font-black uppercase text-[#101014] mb-2">
              NO COURSES GENERATED YET
            </h3>

            <p className="font-sans text-sm text-[#101014]/80 max-w-md mx-auto mb-6 leading-relaxed">
              Your "Continue Learning" list displays only the courses you have transformed. Paste any YouTube tutorial or playlist link above to create your first course!
            </p>

            <button
              onClick={scrollToInput}
              className="px-6 py-3 bg-[#FFD21C] text-[#101014] font-heading font-black text-sm border-2 border-[#101014] shadow-neo hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 uppercase inline-flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>PASTE YOUTUBE LINK TO START</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

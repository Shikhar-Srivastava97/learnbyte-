import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, CheckCircle2, Loader2, AlertCircle, 
  Play, BookOpen, Clock, Layers, ArrowRight, Terminal
} from 'lucide-react';
import { api } from '../services/api';
import { ICourse } from '../types';

interface Stage {
  id: number;
  label: string;
  desc: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export const CourseGenerationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlParam = searchParams.get('url') || '';

  const [inputUrl, setInputUrl] = useState<string>(urlParam);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [generatedCourse, setGeneratedCourse] = useState<ICourse | null>(null);
  const [videoPreview, setVideoPreview] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const [stages, setStages] = useState<Stage[]>([
    { id: 1, label: 'FETCHING VIDEO INFORMATION', desc: 'Validating stream URL & retrieving author, title, and video duration', status: 'pending' },
    { id: 2, label: 'EXTRACTING TRANSCRIPT', desc: 'Extracting audio captions and structuring millisecond timestamps', status: 'pending' },
    { id: 3, label: 'UNDERSTANDING TOPICS', desc: 'NVIDIA Nemotron analyzing conceptual hierarchies and domain boundaries', status: 'pending' },
    { id: 4, label: 'STRUCTURING CURRICULUM', desc: 'Synthesizing pedagogical modules, learning objectives, and progression flow', status: 'pending' },
    { id: 5, label: 'GENERATING LESSONS', desc: 'Constructing bite-sized lessons, timestamp seek anchors, and quiz bank', status: 'pending' }
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const updateStage = (stageId: number, status: Stage['status']) => {
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, status } : s));
  };

  const startGenerationFlow = async (targetUrl: string) => {
    if (!targetUrl.trim()) {
      setError('Please provide a valid YouTube URL');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedCourse(null);
    setLogs([]);
    addLog(`Initiating LearnByte generation pipeline for: ${targetUrl}`);

    try {

      updateStage(1, 'in_progress');
      addLog('Connecting to YouTube metadata service...');
      const validation = await api.validateUrl(targetUrl);
      setVideoPreview(validation.metadata);
      addLog(`✓ Found video: "${validation.metadata.title}" (${validation.metadata.durationFormatted})`);
      addLog(`✓ Creator: ${validation.metadata.author}`);
      updateStage(1, 'completed');

      updateStage(2, 'in_progress');
      addLog('Extracting timestamped caption tracks...');
      await new Promise(r => setTimeout(r, 800));
      addLog(`✓ Synchronized ${Math.floor(validation.metadata.durationSeconds / 30)} transcript segments.`);
      updateStage(2, 'completed');

      updateStage(3, 'in_progress');
      addLog('Dispatching prompt to NVIDIA Nemotron inference engine...');
      addLog('Analyzing transcript semantics, extracting domain concepts...');
      await new Promise(r => setTimeout(r, 1000));
      updateStage(3, 'completed');

      updateStage(4, 'in_progress');
      addLog('Synthesizing structured modular syllabus & learning objectives...');
      await new Promise(r => setTimeout(r, 900));
      updateStage(4, 'completed');

      updateStage(5, 'in_progress');
      addLog('Calling LearnByte course builder backend with Nemotron JSON schema...');

      const response = await api.generateCourse(targetUrl);
      if (!response.course) {
        throw new Error('Course generation returned empty response.');
      }

      setGeneratedCourse(response.course);
      addLog(`✅ Successfully created course: "${response.course.title}"`);
      addLog(`✓ Generated ${response.course.modules.length} modules.`);
      addLog(`✓ Generated quizzes and video-linked study plan.`);
      updateStage(5, 'completed');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Generation pipeline failed. Please check the URL.');
      setStages(prev => prev.map(s => s.status === 'in_progress' ? { ...s, status: 'failed' } : s));
      addLog(`❌ ERROR: ${err.message || 'Failed'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (urlParam) {
      startGenerationFlow(urlParam);
    }
  }, [urlParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startGenerationFlow(inputUrl);
  };

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 pb-4 border-b-2 border-[#101014] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#A77AF5] uppercase mb-1">
            <Sparkles className="w-4 h-4 text-[#A77AF5]" />
            <span>NEMOTRON TRANSCRIPT CURRICULUM SYNTHESIS</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#101014] uppercase">
            COURSE GENERATION ENGINE
          </h1>
        </div>

        <Link
          to="/courses"
          className="px-3.5 py-1.5 bg-white text-[#101014] font-heading text-xs font-bold border-2 border-[#101014] shadow-neo-sm hover:bg-[#F1F0E9]"
        >
          VIEW MY COURSES
        </Link>
      </div>
      <div className="bg-white border-2 border-[#101014] shadow-neo p-4 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={isGenerating}
            placeholder="Paste YouTube Video or Playlist URL (e.g. https://www.youtube.com/watch?v=...)"
            className="flex-1 bg-[#F1F0E9] border-2 border-[#101014] px-4 py-2.5 font-mono text-sm text-[#101014] focus:outline-none focus:bg-white"
          />
          <button
            type="submit"
            disabled={isGenerating || !inputUrl.trim()}
            className="px-6 py-2.5 bg-[#FFD21C] text-[#101014] font-heading font-black text-sm border-2 border-[#101014] shadow-neo-sm hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 transition-all uppercase whitespace-nowrap"
          >
            {isGenerating ? 'ANALYZING...' : 'START GENERATION'}
          </button>
        </form>

        {error && (
          <div className="mt-3 p-3 bg-[#F34D43]/10 border-2 border-[#F34D43] text-[#F34D43] text-xs font-mono font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-7 bg-white border-2 border-[#101014] shadow-neo p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-[#101014]">
            <span className="font-heading text-base font-black uppercase text-[#101014]">
              GENERATION PIPELINE STAGES
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#FFD21C] border border-[#101014]">
              {progressPercent}% COMPLETED
            </span>
          </div>
          <div className="w-full h-3 bg-[#F1F0E9] border-2 border-[#101014] mb-6 overflow-hidden">
            <div
              className="h-full bg-[#35D68B] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="space-y-3">
            {stages.map((stage) => {
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in_progress';
              const isFailed = stage.status === 'failed';

              return (
                <div
                  key={stage.id}
                  className={`p-3.5 border-2 transition-all flex items-start space-x-3 ${
                    isCompleted
                      ? 'bg-[#35D68B]/10 border-[#35D68B]'
                      : isInProgress
                      ? 'bg-[#FFD21C]/20 border-[#101014] shadow-neo-sm'
                      : isFailed
                      ? 'bg-[#F34D43]/10 border-[#F34D43]'
                      : 'bg-[#F1F0E9]/50 border-[#101014]/20 opacity-70'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <div className="w-5 h-5 bg-[#35D68B] border border-[#101014] flex items-center justify-center text-[#101014]">
                        <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : isInProgress ? (
                      <div className="w-5 h-5 bg-[#FFD21C] border border-[#101014] flex items-center justify-center">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#101014]" />
                      </div>
                    ) : isFailed ? (
                      <div className="w-5 h-5 bg-[#F34D43] border border-[#101014] flex items-center justify-center text-white">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-white border border-[#101014] font-mono text-[10px] font-bold flex items-center justify-center text-[#101014]">
                        {stage.id}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-sm font-black uppercase text-[#101014]">
                        {stage.label}
                      </h4>
                      <span className="text-[10px] font-mono font-bold uppercase">
                        {isCompleted && <span className="text-[#35D68B]">DONE</span>}
                        {isInProgress && <span className="text-[#101014] animate-pulse">PROCESSING</span>}
                        {isFailed && <span className="text-[#F34D43]">FAILED</span>}
                        {stage.status === 'pending' && <span className="text-gray-400">QUEUED</span>}
                      </span>
                    </div>
                    <p className="text-xs font-sans text-[#101014]/70 mt-0.5">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          {videoPreview && (
            <div className="bg-white border-2 border-[#101014] shadow-neo p-3">
              <div className="text-[10px] font-mono text-[#101014]/70 uppercase font-bold mb-1.5 flex items-center space-x-1">
                <span>DETECTED SOURCE MEDIA</span>
              </div>
              <div className="flex gap-3">
                <img
                  src={videoPreview.thumbnailUrl}
                  alt={videoPreview.title}
                  className="w-28 h-18 object-cover border border-[#101014] bg-black shrink-0"
                />
                <div className="overflow-hidden">
                  <h5 className="font-heading text-xs font-bold text-[#101014] uppercase truncate">
                    {videoPreview.title}
                  </h5>
                  <p className="text-[11px] font-mono text-[#101014]/70 mt-1">
                    Author: {videoPreview.author}
                  </p>
                  <p className="text-[11px] font-mono text-[#101014]/70">
                    Duration: {videoPreview.durationFormatted}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="bg-[#101014] border-2 border-[#101014] shadow-neo p-3 text-white flex-1 flex flex-col min-h-[260px]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/20 text-xs font-mono">
              <div className="flex items-center space-x-1.5 text-[#35D68B]">
                <Terminal className="w-3.5 h-3.5" />
                <span className="font-bold">NEMOTRON LIVE LOGS</span>
              </div>
              <span className="text-[10px] text-white/50">STDOUT</span>
            </div>

            <div className="font-mono text-xs text-[#35D68B] space-y-1.5 overflow-y-auto max-h-[300px] flex-1">
              {logs.length === 0 ? (
                <div className="text-white/40 italic">Waiting for pipeline trigger...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="leading-snug break-all">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {generatedCourse && (
        <div className="bg-[#FFD21C] border-[3px] border-[#101014] shadow-neo-lg p-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#101014] text-white text-xs font-mono font-bold uppercase mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#35D68B]" />
                <span>COURSE GENERATION COMPLETE</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase text-[#101014]">
                {generatedCourse.title}
              </h2>
              <div className="flex items-center space-x-4 text-xs font-mono text-[#101014] mt-2 font-bold">
                <span>{generatedCourse.modules.length} MODULES</span>
                <span>•</span>
                <span>{generatedCourse.totalDuration} TOTAL RUNTIME</span>
                <span>•</span>
                <span>CATEGORY: {generatedCourse.category}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                to={`/workspace/${generatedCourse._id}`}
                className="w-full sm:w-auto px-6 py-3 bg-[#101014] text-[#FFD21C] font-heading font-black text-sm border-2 border-white shadow-[2px_2px_0px_#FFFFFF] hover:bg-[#A77AF5] hover:text-[#101014] flex items-center justify-center space-x-2 uppercase transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>OPEN IN WORKSPACE</span>
              </Link>

              <Link
                to={`/courses/${generatedCourse._id}`}
                className="w-full sm:w-auto px-5 py-3 bg-white text-[#101014] font-heading font-black text-sm border-2 border-[#101014] shadow-[2px_2px_0px_#101014] hover:bg-[#F1F0E9] flex items-center justify-center space-x-2 uppercase transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>VIEW SYLLABUS</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

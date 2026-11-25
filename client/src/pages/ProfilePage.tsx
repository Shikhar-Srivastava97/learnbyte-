import React, { useState, useEffect } from 'react';
import { 
  User, Cpu, Key, ShieldCheck, Flame, 
  Award, Clock, CheckCircle2, RotateCcw, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { IUser } from '../types';

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [aiSettings, setAiSettings] = useState<{ hasKey: boolean; maskedKey: string | null; model: string }>({
    hasKey: false,
    maskedKey: null,
    model: 'nvidia/nemotron-4-340b-instruct'
  });
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [savingKey, setSavingKey] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.getUser(),
      api.getAiSettings()
    ]).then(([userData, aiData]) => {
      setUser(userData);
      setAiSettings(aiData);
    }).finally(() => setLoading(false));
  }, []);

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKey(true);
    setFeedbackMsg('');

    try {
      const res = await api.updateAiSettings(apiKeyInput.trim());
      setAiSettings(res.status);
      setApiKeyInput('');
      setFeedbackMsg('NVIDIA Nemotron API configuration updated successfully!');
    } catch (err: any) {
      setFeedbackMsg(`Failed to update key: ${err.message}`);
    } finally {
      setSavingKey(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#101014] border-t-[#FFD21C] rounded-full animate-spin mx-auto mb-4"></div>
        <div className="font-mono text-sm font-bold uppercase">Loading Student Profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 pb-4 border-b-2 border-[#101014]">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#A77AF5] uppercase mb-1">
          <User className="w-4 h-4 text-[#A77AF5]" />
          <span>LEARNER IDENTITY & AI CONFIGURATION</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#101014] uppercase">
          PROFILE & NEMOTRON SETTINGS
        </h1>
      </div>
      <div className="bg-white border-[3px] border-[#101014] shadow-neo-lg p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-[#FFD21C] border-[3px] border-[#101014] shadow-neo flex items-center justify-center font-heading text-3xl font-black text-[#101014] shrink-0">
          AR
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <h2 className="font-heading text-2xl font-black uppercase text-[#101014]">
              {user.name}
            </h2>
            <span className="px-2 py-0.5 bg-[#35D68B] text-[#101014] border border-[#101014] font-mono text-[10px] font-black uppercase">
              STUDENT TIER
            </span>
          </div>
          <p className="font-mono text-xs text-[#101014]/70 mb-4">
            {user.email} • Member since Oct 2026
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md bg-[#F1F0E9] border-2 border-[#101014] p-3 text-center font-mono">
            <div>
              <div className="text-[10px] text-[#101014]/60 uppercase">HOURS</div>
              <div className="font-heading text-lg font-black">{user.totalHoursStudied}h</div>
            </div>
            <div>
              <div className="text-[10px] text-[#101014]/60 uppercase">LESSONS</div>
              <div className="font-heading text-lg font-black">{user.completedLessonsCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#101014]/60 uppercase">STREAK</div>
              <div className="font-heading text-lg font-black text-[#FFD21C]">🔥 {user.studyStreak}d</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border-[3px] border-[#101014] shadow-neo-lg p-6 sm:p-8 mb-8">
        <div className="flex items-center space-x-2 pb-3 mb-4 border-b-2 border-[#101014]">
          <Cpu className="w-6 h-6 text-[#A77AF5]" />
          <h2 className="font-heading text-xl font-black uppercase text-[#101014]">
            AI INFERENCE ENGINE & API SETTINGS
          </h2>
        </div>
        <div className="p-4 bg-[#F1F0E9] border-2 border-[#101014] mb-6 flex items-start space-x-3">
          <div className="w-8 h-8 bg-[#35D68B] border border-[#101014] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-[#101014]" />
          </div>
          <div className="text-xs font-mono text-[#101014] space-y-1">
            <div className="font-bold uppercase flex items-center space-x-2">
              <span>ACTIVE MODEL: {aiSettings.model}</span>
              <span className="px-1.5 py-0.2 bg-[#35D68B] text-[#101014] text-[9px] uppercase font-black">
                READY
              </span>
            </div>
            <p className="text-[#101014]/80">
              {aiSettings.hasKey
                ? `Connected API Key: ${aiSettings.maskedKey}`
                : 'Using Built-in High-Performance Curriculum Synthesizer Engine (Free & Instant). You can also plug in any free API key below.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 bg-white border border-[#101014] text-xs font-mono hover:bg-[#FFD21C] transition-colors block"
          >
            <div className="font-bold text-[#101014]">1. Groq (100% Free)</div>
            <div className="text-[10px] text-[#101014]/70">Fastest Llama 3.3 70B • console.groq.com</div>
          </a>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 bg-white border border-[#101014] text-xs font-mono hover:bg-[#48B7EC] transition-colors block"
          >
            <div className="font-bold text-[#101014]">2. Google Gemini</div>
            <div className="text-[10px] text-[#101014]/70">Free AI Studio Key • aistudio.google.com</div>
          </a>
          <a
            href="https://build.nvidia.com"
            target="_blank"
            rel="noreferrer"
            className="p-2.5 bg-white border border-[#101014] text-xs font-mono hover:bg-[#35D68B] transition-colors block"
          >
            <div className="font-bold text-[#101014]">3. NVIDIA NIM</div>
            <div className="text-[10px] text-[#101014]/70">1,000 Free Credits • build.nvidia.com</div>
          </a>
        </div>

        <form onSubmit={handleSaveApiKey} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1.5">
              API KEY (OPTIONAL — GROQ, GEMINI, NEMOTRON, OPENROUTER):
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Paste key: gsk_... (Groq) or AIzaSy... (Gemini) or nvapi-..."
                className="flex-1 bg-[#F1F0E9] border-2 border-[#101014] px-4 py-2.5 font-mono text-sm text-[#101014] focus:outline-none focus:bg-white"
              />
              <button
                type="submit"
                disabled={savingKey || !apiKeyInput.trim()}
                className="px-6 py-2.5 bg-[#FFD21C] text-[#101014] font-heading font-black text-xs border-2 border-[#101014] shadow-neo uppercase hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {savingKey ? 'VALIDATING...' : 'SAVE KEY'}
              </button>
            </div>
            <p className="text-[11px] font-mono text-[#101014]/60 mt-1.5">
              Automatically detects key provider. Stored safely in backend memory only.
            </p>
          </div>

          {feedbackMsg && (
            <div className="p-3 bg-[#35D68B]/15 border-2 border-[#35D68B] text-xs font-mono font-bold text-[#101014]">
              {feedbackMsg}
            </div>
          )}
        </form>
      </div>
      <div className="bg-white border-2 border-[#101014] shadow-neo p-6 text-xs font-mono text-[#101014] space-y-2">
        <div className="font-heading text-sm font-black uppercase text-[#101014] pb-2 border-b border-[#101014]/20">
          LEARNBYTE TECHNICAL SPECIFICATIONS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <div>• <strong>Frontend:</strong> React 18, TypeScript, Vite, Tailwind CSS</div>
          <div>• <strong>Backend:</strong> Node.js, Express, MongoDB Mongoose Models</div>
          <div>• <strong>AI Engine:</strong> NVIDIA Nemotron 4-340B & Llama 3.1 70B</div>
          <div>• <strong>Video Stream:</strong> YouTube IFrame Embed API with Seek Anchors</div>
        </div>
      </div>
    </div>
  );
};

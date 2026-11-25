import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, Clock, CheckCircle2, ChevronDown, ChevronUp, 
  BookOpen, ExternalLink, Sparkles, Layers, Award, Target
} from 'lucide-react';
import { api } from '../services/api';
import { ICourse, IModule, ILesson } from '../types';

export const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.getCourseById(id)
      .then(data => {
        setCourse(data);

        const initialExpanded: Record<string, boolean> = {};
        data.modules?.forEach((m, idx) => {
          if (idx < 2) initialExpanded[m._id] = true;
        });
        setExpandedModules(initialExpanded);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-[#101014] border-t-[#FFD21C] rounded-full animate-spin mx-auto mb-4"></div>
        <div className="font-mono text-sm font-bold uppercase">Loading syllabus...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="font-heading text-2xl font-black uppercase mb-4">Course Not Found</h2>
        <Link to="/courses" className="px-4 py-2 bg-[#FFD21C] border-2 border-[#101014] font-bold text-xs uppercase shadow-neo">
          Return to Courses
        </Link>
      </div>
    );
  }

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const firstLessonId = course.modules?.[0]?.lessons?.[0]?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white border-[3px] border-[#101014] shadow-neo-lg p-6 sm:p-8 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="aspect-video w-full border-2 border-[#101014] overflow-hidden bg-black relative shadow-neo">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Link
                  to={`/workspace/${course._id}${firstLessonId ? `?lesson=${firstLessonId}` : ''}`}
                  className="w-14 h-14 bg-[#FFD21C] border-2 border-[#101014] shadow-neo flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Play className="w-6 h-6 fill-[#101014] ml-0.5" />
                </Link>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#101014]/70">
              <span className="truncate">Creator: <strong className="text-[#101014]">{course.channelTitle}</strong></span>
              <a
                href={course.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#A77AF5] flex items-center space-x-1"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-[#A77AF5] text-[#101014] border border-[#101014] font-mono text-xs font-bold uppercase shadow-neo-sm">
                  {course.category}
                </span>
                <span className="px-2.5 py-0.5 bg-[#101014] text-[#35D68B] border border-white font-mono text-xs font-bold uppercase shadow-neo-sm">
                  ⚡ {course.generatorModel || 'NEMOTRON 4-340B'}
                </span>
                <span className="px-2.5 py-0.5 bg-white text-[#101014] border border-[#101014] font-mono text-xs font-bold uppercase">
                  DIFFICULTY: {course.difficulty}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#101014] leading-tight mb-3">
                {course.title}
              </h1>
              <p className="font-sans text-sm sm:text-base text-[#101014]/85 leading-relaxed mb-6">
                {course.description}
              </p>
              <div className="grid grid-cols-3 gap-2 p-3 bg-[#F1F0E9] border-2 border-[#101014] text-center font-mono mb-6">
                <div>
                  <div className="text-[10px] text-[#101014]/60 uppercase">TOTAL RUNTIME</div>
                  <div className="font-heading text-lg font-black text-[#101014]">{course.totalDuration}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#101014]/60 uppercase">CURRICULUM</div>
                  <div className="font-heading text-lg font-black text-[#101014]">{course.modules.length} MODULES</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#101014]/60 uppercase">LESSONS</div>
                  <div className="font-heading text-lg font-black text-[#101014]">{totalLessons} TOTAL</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                to={`/workspace/${course._id}${firstLessonId ? `?lesson=${firstLessonId}` : ''}`}
                className="w-full sm:w-auto flex-1 py-3 px-6 bg-[#FFD21C] text-[#101014] font-heading font-black text-sm border-2 border-[#101014] shadow-neo hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center space-x-2 uppercase"
              >
                <Play className="w-4 h-4 fill-[#101014]" />
                <span>START LEARNING IN WORKSPACE</span>
              </Link>

              <Link
                to={`/study-plan?courseId=${course._id}`}
                className="w-full sm:w-auto py-3 px-5 bg-white text-[#101014] font-heading font-bold text-sm border-2 border-[#101014] shadow-neo hover:bg-[#F1F0E9] flex items-center justify-center space-x-2 uppercase"
              >
                <span>CREATE STUDY PLAN</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {course.learningObjectives && course.learningObjectives.length > 0 && (
        <div className="bg-white border-2 border-[#101014] shadow-neo p-6 mb-10">
          <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-[#101014]">
            <Target className="w-5 h-5 text-[#A77AF5]" />
            <h2 className="font-heading text-xl font-black uppercase text-[#101014]">
              WHAT YOU WILL MASTER
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.learningObjectives.map((obj, i) => (
              <div key={i} className="flex items-start space-x-3 p-2.5 bg-[#F1F0E9] border border-[#101014]">
                <CheckCircle2 className="w-4 h-4 text-[#35D68B] shrink-0 mt-0.5 fill-[#101014]" />
                <span className="text-xs sm:text-sm font-sans text-[#101014] leading-snug">
                  {obj}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-[#101014]">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#FFD21C]" />
            <h2 className="font-heading text-2xl font-black uppercase text-[#101014]">
              COURSE CURRICULUM SYLLABUS
            </h2>
          </div>
          <span className="text-xs font-mono text-[#101014]/70">
            {course.modules.length} MODULES • {totalLessons} LESSONS
          </span>
        </div>

        <div className="space-y-4">
          {course.modules.map((mod, modIdx) => {
            const isExpanded = !!expandedModules[mod._id];

            return (
              <div
                key={mod._id}
                className="bg-white border-2 border-[#101014] shadow-neo transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleModule(mod._id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#F1F0E9]/60 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 bg-[#101014] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {modIdx + 1}
                    </span>
                    <div>
                      <h3 className="font-heading text-base sm:text-lg font-black uppercase text-[#101014]">
                        {mod.title}
                      </h3>
                      {mod.description && (
                        <p className="text-xs font-sans text-[#101014]/70 line-clamp-1 mt-0.5">
                          {mod.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <span className="text-xs font-mono text-[#101014]/60 hidden sm:inline">
                      {mod.lessons.length} LESSONS
                    </span>
                    <div className="w-7 h-7 bg-[#FFD21C] border border-[#101014] flex items-center justify-center shadow-neo-sm">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#101014]" /> : <ChevronDown className="w-4 h-4 text-[#101014]" />}
                    </div>
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t-2 border-[#101014] divide-y divide-[#101014]/15 bg-[#F1F0E9]/30">
                    {mod.lessons.map((les, lesIdx) => (
                      <div
                        key={les._id}
                        className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xs font-mono text-[#101014]/50 mt-1 font-bold">
                            {modIdx + 1}.{lesIdx + 1}
                          </span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-heading text-sm sm:text-base font-bold uppercase text-[#101014]">
                                {les.title}
                              </h4>
                              {les.completed && (
                                <span className="px-1.5 py-0.5 bg-[#35D68B] text-[#101014] text-[9px] font-mono font-bold uppercase border border-[#101014]">
                                  COMPLETED
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-sans text-[#101014]/80 mt-1 max-w-2xl">
                              {les.description || les.learningObjectives?.[0]}
                            </p>
                            {les.keyConcepts && les.keyConcepts.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {les.keyConcepts.map((kc, kci) => (
                                  <span
                                    key={kci}
                                    className="px-1.5 py-0.5 bg-white border border-[#101014]/30 text-[10px] font-mono text-[#101014]"
                                  >
                                    #{kc}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 self-end md:self-center shrink-0">
                          <div className="flex items-center space-x-1 text-xs font-mono text-[#101014]/70">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{les.duration}</span>
                          </div>

                          <Link
                            to={`/workspace/${course._id}?lesson=${les._id}`}
                            className="px-3 py-1.5 bg-[#FFD21C] text-[#101014] font-heading text-xs font-bold border-2 border-[#101014] shadow-neo-sm hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center space-x-1 uppercase"
                          >
                            <Play className="w-3 h-3 fill-[#101014]" />
                            <span>PLAY</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

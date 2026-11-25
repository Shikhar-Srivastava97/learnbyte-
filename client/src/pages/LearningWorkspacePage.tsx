import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Circle, ChevronDown, ChevronUp, Play, 
  BookOpen, FileText, HelpCircle, Lightbulb, Clock, 
  Send, Bookmark, Trash2, ArrowLeft, RotateCcw, 
  Sparkles, Check, ChevronRight, Terminal
} from 'lucide-react';
import { YouTubePlayer } from '../components/YouTubePlayer';
import { api } from '../services/api';
import { ICourse, ILesson, IModule, IQuiz, INote } from '../types';

export const LearningWorkspacePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const lessonParam = searchParams.get('lesson');

  const [course, setCourse] = useState<ICourse | null>(null);
  const [currentModule, setCurrentModule] = useState<IModule | null>(null);
  const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'quiz' | 'concepts'>('summary');

  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);
  const [seekTargetTimestamp, setSeekTargetTimestamp] = useState<number | undefined>(undefined);

  const [lessonQuiz, setLessonQuiz] = useState<IQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState<boolean>(false);

  const [notes, setNotes] = useState<INote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteTag, setNewNoteTag] = useState<string>('Concept');

  const [askQuestion, setAskQuestion] = useState<string>('');
  const [askResponse, setAskResponse] = useState<string | null>(null);
  const [askingAi, setAskingAi] = useState<boolean>(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    api.getCourseById(courseId)
      .then(data => {
        setCourse(data);

        let targetLesson: ILesson | null = null;
        let targetModule: IModule | null = null;

        if (lessonParam) {
          for (const m of data.modules) {
            for (const l of m.lessons) {
              if (l._id === lessonParam) {
                targetLesson = l;
                targetModule = m;
                break;
              }
            }
            if (targetLesson) break;
          }
        }

        if (!targetLesson && data.modules.length > 0 && data.modules[0].lessons.length > 0) {
          targetModule = data.modules[0];
          targetLesson = data.modules[0].lessons[0];
        }

        if (targetLesson && targetModule) {
          setCurrentLesson(targetLesson);
          setCurrentModule(targetModule);
          setExpandedModules({ [targetModule._id]: true });
          loadLessonDetails(courseId, targetLesson._id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (!course || !lessonParam) return;
    for (const m of course.modules) {
      for (const l of m.lessons) {
        if (l._id === lessonParam) {
          setCurrentLesson(l);
          setCurrentModule(m);
          setExpandedModules(prev => ({ ...prev, [m._id]: true }));
          loadLessonDetails(course._id, l._id);
          break;
        }
      }
    }
  }, [lessonParam]);

  const loadLessonDetails = async (cId: string, lId: string) => {
    setQuizResult(null);
    setQuizAnswers({});
    setAskResponse(null);

    try {
      const details = await api.getLessonDetails(cId, lId);
      setLessonQuiz(details.quiz || null);
      setNotes(details.notes || []);
    } catch (e) {
      console.warn('Could not load extra lesson details:', e);
    }
  };

  const handleSelectLesson = (mod: IModule, les: ILesson) => {
    setCurrentModule(mod);
    setCurrentLesson(les);
    setSearchParams({ lesson: les._id });
  };

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleToggleCompleted = async () => {
    if (!course || !currentLesson) return;
    const newStatus = !currentLesson.completed;

    try {
      await api.updateLessonProgress(course._id, currentLesson._id, newStatus, currentPlaybackTime);

      setCurrentLesson(prev => prev ? { ...prev, completed: newStatus } : null);

      setCourse(prev => {
        if (!prev) return null;
        const updatedMods = prev.modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l => l._id === currentLesson._id ? { ...l, completed: newStatus } : l)
        }));
        return { ...prev, modules: updatedMods };
      });
    } catch (e) {
      console.error(e);
    }
  };

  const allLessons: { mod: IModule; les: ILesson }[] = [];
  if (course) {
    for (const m of course.modules) {
      for (const l of m.lessons) {
        allLessons.push({ mod: m, les: l });
      }
    }
  }

  const currentIndex = allLessons.findIndex(item => item.les._id === currentLesson?._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const handlePrevLesson = () => {
    if (hasPrev) {
      const prev = allLessons[currentIndex - 1];
      handleSelectLesson(prev.mod, prev.les);
    }
  };

  const handleNextLesson = () => {
    if (hasNext) {
      const next = allLessons[currentIndex + 1];
      handleSelectLesson(next.mod, next.les);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !course || !currentLesson) return;

    try {
      const savedNote = await api.createNote({
        courseId: course._id,
        lessonId: currentLesson._id,
        title: newNoteTitle.trim() || `${currentLesson.title} Note`,
        content: newNoteContent.trim(),
        timestamp: currentPlaybackTime,
        tags: [newNoteTag, course.category]
      });

      setNotes(prev => [savedNote, ...prev]);
      setNewNoteContent('');
      setNewNoteTitle('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    await api.deleteNote(noteId);
    setNotes(prev => prev.filter(n => n._id !== noteId));
  };

  const handleSeekToTimestamp = (seconds: number) => {
    setSeekTargetTimestamp(seconds);
  };

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonQuiz || !course || !currentLesson) return;

    setSubmittingQuiz(true);
    try {
      const res = await api.submitQuizAttempt(
        lessonQuiz._id,
        quizAnswers,
        course._id,
        currentLesson._id
      );
      setQuizResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleAskNemotron = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim() || !currentLesson) return;

    setAskingAi(true);
    setAskResponse(null);

    setTimeout(() => {
      setAskResponse(
        `Based on this lesson on "${currentLesson.title}", here is the explanation:\n\n${currentLesson.summary}\n\nKey Takeaway: Always verify service metrics using standard command probes and ensure configuration drift is prevented by storing definitions in version control.`
      );
      setAskingAi(false);
    }, 800);
  };

  if (loading || !course || !currentLesson) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#101014] border-t-[#FFD21C] rounded-full animate-spin mx-auto mb-4"></div>
        <div className="font-mono text-sm font-bold uppercase">Preparing Learning Workspace...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
      <div className="bg-white border-2 border-[#101014] shadow-neo px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Link
            to={`/courses/${course._id}`}
            className="p-1.5 bg-[#F1F0E9] hover:bg-[#FFD21C] border border-[#101014] transition-all"
            title="Back to Course Details"
          >
            <ArrowLeft className="w-4 h-4 text-[#101014]" />
          </Link>

          <div>
            <div className="text-[10px] font-mono font-bold text-[#A77AF5] uppercase">
              {course.category} 
            </div>
            <div className="font-heading text-sm sm:text-base font-black uppercase text-[#101014] truncate max-w-xl">
              {currentLesson.title}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="hidden sm:flex items-center space-x-2 bg-[#F1F0E9] px-2.5 py-1 border border-[#101014]">
            <span className="font-bold">PROGRESS:</span>
            <span className="text-[#35D68B] font-black">{course.progressPercent || 0}%</span>
          </div>

          <Link
            to={`/quizzes?courseId=${course._id}`}
            className="px-2.5 py-1 bg-white hover:bg-[#FFD21C] border border-[#101014] font-bold text-[#101014] transition-all hidden md:block"
          >
            QUIZ BANK
          </Link>

          <Link
            to={`/study-plan?courseId=${course._id}`}
            className="px-2.5 py-1 bg-white hover:bg-[#FFD21C] border border-[#101014] font-bold text-[#101014] transition-all hidden md:block"
          >
            STUDY PLAN
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-3 bg-white border-2 border-[#101014] shadow-neo max-h-[820px] flex flex-col">
          <div className="p-3.5 bg-[#101014] text-white border-b-2 border-[#101014] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#FFD21C]" />
              <span className="font-heading text-xs font-bold uppercase tracking-wider">
                COURSE CURRICULUM
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#FFD21C]">
              {course.modules.length} MODULES
            </span>
          </div>
          <div className="overflow-y-auto divide-y divide-[#101014]/20 flex-1">
            {course.modules.map((mod, modIdx) => {
              const isExpanded = !!expandedModules[mod._id];
              const isCurrentMod = currentModule?._id === mod._id;

              return (
                <div key={mod._id} className="text-xs">
                  <button
                    onClick={() => toggleModuleAccordion(mod._id)}
                    className={`w-full text-left p-3 font-heading font-black uppercase flex items-center justify-between gap-2 transition-colors ${
                      isCurrentMod ? 'bg-[#FFD21C]/20 text-[#101014]' : 'bg-[#F1F0E9] hover:bg-[#E6E5DE] text-[#101014]'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-4 h-4 bg-[#101014] text-white font-mono text-[9px] flex items-center justify-center shrink-0">
                        {modIdx + 1}
                      </span>
                      <span className="truncate">{mod.title}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                  {isExpanded && (
                    <div className="divide-y divide-[#101014]/10 bg-white">
                      {mod.lessons.map((les, lesIdx) => {
                        const isSelected = currentLesson._id === les._id;

                        return (
                          <button
                            key={les._id}
                            onClick={() => handleSelectLesson(mod, les)}
                            className={`w-full text-left p-3 flex items-start space-x-2.5 transition-all ${
                              isSelected
                                ? 'bg-[#101014] text-white font-bold'
                                : 'hover:bg-[#F1F0E9] text-[#101014]'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {les.completed ? (
                                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-[#35D68B] fill-[#35D68B]' : 'text-[#35D68B]'}`} />
                              ) : (
                                <Circle className={`w-3.5 h-3.5 ${isSelected ? 'text-white/40' : 'text-[#101014]/40'}`} />
                              )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <div className="font-heading text-xs uppercase leading-snug line-clamp-2">
                                {modIdx + 1}.{lesIdx + 1} {les.title}
                              </div>
                              <div className={`text-[10px] font-mono mt-1 flex items-center space-x-1 ${isSelected ? 'text-white/70' : 'text-[#101014]/60'}`}>
                                <Clock className="w-3 h-3" />
                                <span>{les.duration}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          <YouTubePlayer
            videoId={course.videoId}
            startTime={currentLesson.startTime}
            endTime={currentLesson.endTime}
            currentTimestamp={seekTargetTimestamp}
            onTimeUpdate={(sec) => setCurrentPlaybackTime(sec)}
            onLessonComplete={handleToggleCompleted}
            isCompleted={currentLesson.completed}
            onPrevLesson={handlePrevLesson}
            onNextLesson={handleNextLesson}
            hasPrevLesson={hasPrev}
            hasNextLesson={hasNext}
            lessonTitle={currentLesson.title}
          />
          <div className="bg-white border-2 border-[#101014] shadow-neo p-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#101014]/70 mb-2">
              <span className="font-bold uppercase text-[#A77AF5]">LESSON BLUEPRINT</span>
              <span>TIMESTAMP: {Math.floor(currentLesson.startTime / 60)}m - {Math.floor(currentLesson.endTime / 60)}m</span>
            </div>

            <h3 className="font-heading text-base font-black uppercase text-[#101014] mb-2">
              {currentLesson.title}
            </h3>

            <p className="text-xs font-sans text-[#101014]/85 leading-relaxed mb-3">
              {currentLesson.description || currentLesson.summary}
            </p>
            {currentLesson.keyConcepts && currentLesson.keyConcepts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#101014]/15">
                {currentLesson.keyConcepts.map((concept, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-[#FFD21C] text-[#101014] border border-[#101014] font-mono text-[10px] font-bold uppercase shadow-[1px_1px_0px_#101014]"
                  >
                    #{concept}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-4 bg-white border-2 border-[#101014] shadow-neo max-h-[820px] flex flex-col">
          <div className="grid grid-cols-4 border-b-2 border-[#101014] bg-[#F1F0E9] text-xs font-heading font-black uppercase">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 text-center border-r border-[#101014] transition-colors ${
                activeTab === 'summary' ? 'bg-[#FFD21C] text-[#101014]' : 'hover:bg-white text-[#101014]/70'
              }`}
            >
              SUMMARY
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 text-center border-r border-[#101014] transition-colors ${
                activeTab === 'notes' ? 'bg-[#A77AF5] text-[#101014]' : 'hover:bg-white text-[#101014]/70'
              }`}
            >
              NOTES ({notes.length})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`py-3 text-center border-r border-[#101014] transition-colors ${
                activeTab === 'quiz' ? 'bg-[#35D68B] text-[#101014]' : 'hover:bg-white text-[#101014]/70'
              }`}
            >
              QUIZ
            </button>
            <button
              onClick={() => setActiveTab('concepts')}
              className={`py-3 text-center transition-colors ${
                activeTab === 'concepts' ? 'bg-[#F27CB5] text-[#101014]' : 'hover:bg-white text-[#101014]/70'
              }`}
            >
              KEY
            </button>
          </div>
          {activeTab === 'summary' && (
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <div className="p-3 bg-[#A77AF5]/15 border-2 border-[#A77AF5]">
                <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-[#101014] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#A77AF5]" />
                  <span>NEMOTRON PEDAGOGICAL SUMMARY</span>
                </div>
                <p className="text-xs font-sans text-[#101014] leading-relaxed">
                  {currentLesson.summary || currentLesson.description}
                </p>
              </div>
              {currentLesson.learningObjectives && currentLesson.learningObjectives.length > 0 && (
                <div>
                  <h4 className="font-heading text-xs font-black uppercase text-[#101014] mb-2 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#35D68B]" />
                    <span>OBJECTIVES COVERED</span>
                  </h4>
                  <div className="space-y-1.5">
                    {currentLesson.learningObjectives.map((obj, i) => (
                      <div key={i} className="text-xs font-sans p-2 bg-[#F1F0E9] border border-[#101014]/20 flex items-start space-x-2">
                        <span className="font-mono text-[#35D68B] font-bold">✓</span>
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-3 border-t-2 border-[#101014]">
                <h4 className="font-heading text-xs font-black uppercase text-[#101014] mb-2 flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#A77AF5]" />
                  <span>ASK NEMOTRON ABOUT THIS LESSON</span>
                </h4>

                <form onSubmit={handleAskNemotron} className="flex gap-2">
                  <input
                    type="text"
                    value={askQuestion}
                    onChange={(e) => setAskQuestion(e.target.value)}
                    placeholder="Ask a technical clarification..."
                    className="flex-1 bg-[#F1F0E9] border border-[#101014] px-3 py-1.5 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={askingAi || !askQuestion.trim()}
                    className="px-3 py-1.5 bg-[#101014] text-white hover:bg-[#A77AF5] hover:text-[#101014] font-heading text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {askingAi ? '...' : <Send className="w-3.5 h-3.5" />}
                  </button>
                </form>

                {askResponse && (
                  <div className="mt-3 p-3 bg-[#101014] text-white border border-[#101014] text-xs font-mono leading-relaxed">
                    <div className="text-[#35D68B] font-bold mb-1">NEMOTRON RESPONSE</div>
                    {askResponse}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'notes' && (
            <div className="p-4 overflow-y-auto space-y-4 flex-1 flex flex-col">
              <form onSubmit={handleCreateNote} className="space-y-2 p-3 bg-[#F1F0E9] border-2 border-[#101014]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#101014]">
                    NEW TIMESTAMP NOTE
                  </span>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="px-2 py-0.5 bg-[#FFD21C] border border-[#101014] text-[10px] font-mono font-bold flex items-center space-x-1 shadow-neo-sm"
                  >
                    <Clock className="w-3 h-3" />
                    <span>AT {Math.floor(currentPlaybackTime / 60)}:{(currentPlaybackTime % 60).toString().padStart(2, '0')}</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Note Title (Optional)..."
                  className="w-full bg-white border border-[#101014] px-2.5 py-1 text-xs font-mono text-[#101014] focus:outline-none"
                />

                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Jot down command snippets, architectural caveats, or takeaways..."
                  rows={3}
                  className="w-full bg-white border border-[#101014] p-2 text-xs font-mono text-[#101014] focus:outline-none"
                ></textarea>

                <div className="flex items-center justify-between">
                  <select
                    value={newNoteTag}
                    onChange={(e) => setNewNoteTag(e.target.value)}
                    className="bg-white border border-[#101014] px-2 py-1 text-[10px] font-mono"
                  >
                    <option value="Concept">Concept</option>
                    <option value="Command">CLI / Code</option>
                    <option value="Gotcha">Gotcha / Pitfall</option>
                    <option value="Review">Exam Review</option>
                  </select>

                  <button
                    type="submit"
                    disabled={!newNoteContent.trim()}
                    className="px-3 py-1 bg-[#101014] text-white hover:bg-[#A77AF5] hover:text-[#101014] font-heading text-xs font-bold uppercase transition-all disabled:opacity-50"
                  >
                    SAVE NOTE
                  </button>
                </div>
              </form>
              <div className="space-y-3 flex-1 overflow-y-auto">
                <div className="text-[10px] font-mono text-[#101014]/60 uppercase font-bold">
                  LESSON NOTES ({notes.length})
                </div>

                {notes.length === 0 ? (
                  <div className="p-6 text-center text-xs font-mono text-[#101014]/50 border border-dashed border-[#101014]/30">
                    No notes for this lesson yet. Write one above while watching!
                  </div>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note._id}
                      className="p-3 bg-white border border-[#101014] shadow-neo-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleSeekToTimestamp(note.timestamp)}
                          className="px-1.5 py-0.5 bg-[#FFD21C] text-[#101014] font-mono text-[10px] font-black border border-[#101014] flex items-center space-x-1 hover:bg-[#FFE066]"
                          title="Click to seek video to this note's timestamp"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>{note.timestampFormatted}</span>
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => api.toggleBookmarkNote(note._id)}
                            className="text-[#101014] hover:text-[#FFD21C]"
                            title="Bookmark note"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${note.bookmarked ? 'fill-[#FFD21C] text-[#101014]' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="text-[#101014]/50 hover:text-[#F34D43]"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {note.title && (
                        <div className="font-heading text-xs font-black uppercase text-[#101014]">
                          {note.title}
                        </div>
                      )}

                      <p className="text-xs font-mono text-[#101014]/90 whitespace-pre-wrap leading-relaxed">
                        {note.content}
                      </p>

                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((t, idx) => (
                            <span key={idx} className="text-[9px] font-mono px-1 bg-[#F1F0E9] border border-[#101014]/20 text-[#101014]">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === 'quiz' && (
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {!lessonQuiz || !lessonQuiz.questions || lessonQuiz.questions.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-[#101014]/60 border border-dashed border-[#101014]">
                  Generating quiz for this lesson...
                </div>
              ) : (
                <form onSubmit={handleSubmitQuiz} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#101014]/20">
                    <span className="font-heading text-xs font-black uppercase text-[#101014]">
                      {lessonQuiz.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#FFD21C] border border-[#101014] font-bold">
                      {lessonQuiz.questions.length} QUESTIONS
                    </span>
                  </div>

                  {lessonQuiz.questions.map((q, qIdx) => {
                    const gradedAnswer = quizResult?.gradedAnswers?.find((a: any) => a.questionId === q.id);

                    return (
                      <div
                        key={q.id}
                        className={`p-3 border-2 transition-all space-y-2.5 ${
                          gradedAnswer
                            ? gradedAnswer.isCorrect
                              ? 'bg-[#35D68B]/10 border-[#35D68B]'
                              : 'bg-[#F34D43]/10 border-[#F34D43]'
                            : 'bg-white border-[#101014]'
                        }`}
                      >
                        <div className="text-xs font-heading font-black text-[#101014] leading-snug">
                          {qIdx + 1}. {q.question}
                        </div>
                        {q.type === 'multiple_choice' || q.type === 'true_false' ? (
                          <div className="space-y-1.5">
                            {q.options?.map((opt, oIdx) => (
                              <label
                                key={oIdx}
                                className={`flex items-center space-x-2 p-2 border text-xs font-mono cursor-pointer transition-colors ${
                                  quizAnswers[q.id] === opt
                                    ? 'bg-[#FFD21C] border-[#101014] font-bold text-[#101014]'
                                    : 'bg-[#F1F0E9] border-[#101014]/30 hover:bg-white text-[#101014]'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={opt}
                                  checked={quizAnswers[q.id] === opt}
                                  onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                                  className="accent-[#101014]"
                                />
                                <span className="flex-1">{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <input
                              type="text"
                              value={quizAnswers[q.id] || ''}
                              onChange={(e) => setQuizAnswers({ ...quizAnswers, [q.id]: e.target.value })}
                              placeholder="Type your concise answer..."
                              className="w-full bg-[#F1F0E9] border border-[#101014] p-2 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white"
                            />
                          </div>
                        )}
                        {gradedAnswer && (
                          <div className="pt-2 border-t border-[#101014]/20 space-y-2 text-xs font-mono">
                            <div className="flex items-center space-x-1.5 font-bold">
                              {gradedAnswer.isCorrect ? (
                                <span className="text-[#35D68B]">✓ CORRECT!</span>
                              ) : (
                                <span className="text-[#F34D43]">✗ INCORRECT (Correct: {gradedAnswer.correctAnswer})</span>
                              )}
                            </div>

                            <p className="text-[11px] text-[#101014]/80 leading-relaxed">
                              {gradedAnswer.explanation}
                            </p>
                            {!gradedAnswer.isCorrect && (
                              <button
                                type="button"
                                onClick={() => handleSeekToTimestamp(q.relevantTimestamp)}
                                className="w-full py-1.5 px-3 bg-[#FFD21C] text-[#101014] border-2 border-[#101014] font-heading font-black text-xs uppercase shadow-neo-sm hover:bg-[#FFE066] flex items-center justify-center space-x-1.5"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>REVISIT THIS CONCEPT IN VIDEO</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submittingQuiz}
                      className="w-full py-2.5 bg-[#35D68B] text-[#101014] font-heading font-black text-xs border-2 border-[#101014] shadow-neo uppercase hover:bg-[#2fc47d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      {submittingQuiz ? 'GRADING ANSWERS...' : quizResult ? 'RE-SUBMIT ANSWERS' : 'SUBMIT QUIZ ANSWERS'}
                    </button>
                  </div>

                  {quizResult && (
                    <div className="p-3 bg-[#101014] text-white text-center font-mono text-xs border-2 border-[#101014]">
                      <div className="font-heading text-lg font-black text-[#FFD21C]">
                        SCORE: {quizResult.score}%
                      </div>
                      <div className="text-white/70 text-[11px] mt-0.5">
                        {quizResult.correctCount} of {quizResult.totalQuestions} questions correct
                      </div>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
          {activeTab === 'concepts' && (
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              <div className="text-[10px] font-mono text-[#101014]/60 uppercase font-bold mb-1">
                DOMAIN CHEAT SHEET & ARCHITECTURE
              </div>

              {currentLesson.keyConcepts?.map((kc, idx) => (
                <div key={idx} className="p-3 bg-[#F1F0E9] border-2 border-[#101014] shadow-neo-sm">
                  <div className="font-heading text-xs font-black uppercase text-[#101014] mb-1">
                    {kc}
                  </div>
                  <p className="text-xs font-sans text-[#101014]/80 leading-snug">
                    Essential production concept introduced in {currentLesson.title}. Review this term before moving to the next section.
                  </p>
                </div>
              ))}

              <div className="p-3 bg-[#FFD21C]/20 border-2 border-[#101014] text-xs font-mono">
                <div className="font-bold uppercase text-[#101014] mb-1">STUDY TIP</div>
                Active recall through the Quiz tab reinforces long-term memory retention by over 300% compared to passive re-watching.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

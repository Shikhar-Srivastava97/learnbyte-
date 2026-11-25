import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  HelpCircle, CheckCircle2, RotateCcw, Award, 
  Play, BookOpen, Clock, AlertCircle, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { ICourse, IQuiz, IQuizAttempt } from '../types';

export const QuizPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCourseId = searchParams.get('courseId') || '';

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [recentAttempts, setRecentAttempts] = useState<IQuizAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getCourses()
      .then(data => {
        setCourses(data);
        if (!selectedCourseId && data.length > 0) {
          setSelectedCourseId(data[0]._id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    api.getQuizzesForCourse(selectedCourseId)
      .then(data => {
        setQuizzes(data);
        if (data.length > 0) {
          setSelectedQuizId(data[0]._id);
        } else {
          setSelectedQuizId('');
        }
        setQuizResult(null);
        setUserAnswers({});
      })
      .catch(err => console.error(err));

    api.getQuizAttempts(selectedCourseId)
      .then(atts => setRecentAttempts(atts))
      .catch(() => {});
  }, [selectedCourseId]);

  const activeQuiz = quizzes.find(q => q._id === selectedQuizId);
  const activeCourse = courses.find(c => c._id === selectedCourseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuiz) return;

    setSubmitting(true);
    try {
      const res = await api.submitQuizAttempt(
        activeQuiz._id,
        userAnswers,
        activeCourse?._id,
        activeQuiz.lessonId
      );
      setQuizResult(res);

      api.getQuizAttempts(selectedCourseId).then(atts => setRecentAttempts(atts));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevisitConcept = (relevantTimestamp: number) => {
    if (activeCourse && activeQuiz) {
      navigate(`/workspace/${activeCourse._id}?lesson=${activeQuiz.lessonId || ''}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 pb-4 border-b-2 border-[#101014] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#35D68B] uppercase mb-1">
            <HelpCircle className="w-4 h-4 text-[#35D68B]" />
            <span>NEMOTRON ADAPTIVE EVALUATION</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#101014] uppercase">
            AI QUIZ & CONCEPT VALIDATION
          </h1>
        </div>

        <Link
          to={activeCourse ? `/workspace/${activeCourse._id}` : '/courses'}
          className="px-3.5 py-1.5 bg-white text-[#101014] font-heading text-xs font-bold border-2 border-[#101014] shadow-neo-sm hover:bg-[#F1F0E9] flex items-center space-x-1.5 uppercase"
        >
          <Play className="w-3.5 h-3.5 fill-[#101014]" />
          <span>RESUME IN WORKSPACE</span>
        </Link>
      </div>
      <div className="bg-white border-2 border-[#101014] shadow-neo p-4 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1.5">
            SELECT COURSE:
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1.5">
            SELECT ASSESSMENT MODULE / LESSON:
          </label>
          <select
            value={selectedQuizId}
            onChange={(e) => {
              setSelectedQuizId(e.target.value);
              setQuizResult(null);
              setUserAnswers({});
            }}
            disabled={quizzes.length === 0}
            className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white disabled:opacity-50"
          >
            {quizzes.length === 0 ? (
              <option value="">No quizzes for this course</option>
            ) : (
              quizzes.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.title}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      {!activeQuiz ? (
        <div className="bg-white border-2 border-[#101014] shadow-neo p-12 text-center max-w-lg mx-auto">
          <HelpCircle className="w-12 h-12 text-[#101014]/40 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-black uppercase mb-2">No Quizzes Selected</h3>
          <p className="text-xs font-sans text-[#101014]/70 mb-4">
            Select a course and lesson from the dropdowns above or generate a new course.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border-2 border-[#101014] shadow-neo p-6">
            <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-[#101014]">
              <div>
                <h2 className="font-heading text-xl font-black uppercase text-[#101014]">
                  {activeQuiz.title}
                </h2>
                {activeQuiz.description && (
                  <p className="text-xs font-sans text-[#101014]/70 mt-1">
                    {activeQuiz.description}
                  </p>
                )}
              </div>
              <span className="px-2.5 py-1 bg-[#FFD21C] border-2 border-[#101014] text-xs font-mono font-bold shadow-neo-sm">
                {activeQuiz.questions.length} QUESTIONS
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeQuiz.questions.map((q, qIndex) => {
                const graded = quizResult?.gradedAnswers?.find((a: any) => a.questionId === q.id);

                return (
                  <div
                    key={q.id}
                    className={`p-4 border-2 transition-all space-y-3 ${
                      graded
                        ? graded.isCorrect
                          ? 'bg-[#35D68B]/10 border-[#35D68B]'
                          : 'bg-[#F34D43]/10 border-[#F34D43]'
                        : 'bg-white border-[#101014] shadow-neo-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-heading text-sm font-black text-[#101014] leading-snug">
                        {qIndex + 1}. {q.question}
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-[#F1F0E9] border border-[#101014] uppercase shrink-0">
                        {q.type.replace('_', ' ')}
                      </span>
                    </div>
                    {q.type === 'multiple_choice' || q.type === 'true_false' ? (
                      <div className="space-y-2">
                        {q.options?.map((opt, optIndex) => (
                          <label
                            key={optIndex}
                            className={`flex items-center space-x-2.5 p-2.5 border-2 text-xs font-mono cursor-pointer transition-all ${
                              userAnswers[q.id] === opt
                                ? 'bg-[#FFD21C] border-[#101014] font-bold text-[#101014]'
                                : 'bg-[#F1F0E9] border-[#101014]/30 hover:bg-white text-[#101014]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={userAnswers[q.id] === opt}
                              onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
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
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                          placeholder="Type your concise technical answer..."
                          className="w-full bg-[#F1F0E9] border-2 border-[#101014] p-2.5 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white"
                        />
                      </div>
                    )}
                    {graded && (
                      <div className="pt-3 border-t-2 border-[#101014]/20 space-y-2 text-xs font-mono">
                        <div className="font-bold flex items-center space-x-2">
                          {graded.isCorrect ? (
                            <span className="text-[#35D68B]">✓ EXCELLENT! CORRECT ANSWER.</span>
                          ) : (
                            <span className="text-[#F34D43]">
                              ✗ INCORRECT. Correct answer: <strong className="underline">{graded.correctAnswer}</strong>
                            </span>
                          )}
                        </div>

                        <p className="text-[#101014]/80 text-[11px] leading-relaxed">
                          {graded.explanation}
                        </p>

                        {!graded.isCorrect && (
                          <button
                            type="button"
                            onClick={() => handleRevisitConcept(q.relevantTimestamp)}
                            className="mt-2 py-2 px-4 bg-[#FFD21C] text-[#101014] font-heading font-black text-xs uppercase border-2 border-[#101014] shadow-neo-sm hover:bg-[#FFE066] flex items-center space-x-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>REVISIT THIS CONCEPT (SEEK VIDEO)</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#35D68B] text-[#101014] font-heading font-black text-sm border-2 border-[#101014] shadow-neo uppercase hover:bg-[#2fc47d] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                {submitting ? 'EVALUATING RESPONSES...' : quizResult ? 'RE-EVALUATE ANSWERS' : 'SUBMIT & GRADE QUIZ'}
              </button>
            </form>
          </div>
          <div className="lg:col-span-4 space-y-6">
            {quizResult && (
              <div className="bg-[#101014] text-white border-2 border-[#101014] shadow-neo p-5">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#FFD21C] uppercase mb-2">
                  <Award className="w-4 h-4 text-[#FFD21C]" />
                  <span>ASSESSMENT RESULTS</span>
                </div>
                <div className="font-heading text-4xl font-black text-[#FFD21C] mb-1">
                  {quizResult.score}%
                </div>
                <p className="text-xs font-mono text-[#F1F0E9]/80 mb-4">
                  {quizResult.correctCount} of {quizResult.totalQuestions} questions answered correctly.
                </p>
                <div className="w-full h-3 bg-white/20 border border-white mb-4">
                  <div
                    className="h-full bg-[#35D68B]"
                    style={{ width: `${quizResult.score}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="bg-white border-2 border-[#101014] shadow-neo p-5">
              <h3 className="font-heading text-sm font-black uppercase text-[#101014] mb-3 pb-2 border-b-2 border-[#101014]">
                RECENT ATTEMPTS ({recentAttempts.length})
              </h3>

              {recentAttempts.length === 0 ? (
                <p className="text-xs font-mono text-[#101014]/60">
                  No previous attempts recorded for this course.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {recentAttempts.slice(0, 5).map((att) => (
                    <div key={att._id} className="p-2.5 bg-[#F1F0E9] border border-[#101014] flex items-center justify-between text-xs font-mono">
                      <div>
                        <div className="font-bold text-[#101014]">Score: {att.score}%</div>
                        <div className="text-[10px] text-[#101014]/60">
                          {new Date(att.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-bold border ${att.score >= 70 ? 'bg-[#35D68B] text-[#101014]' : 'bg-[#F34D43] text-white'}`}>
                        {att.score >= 70 ? 'PASSED' : 'NEEDS REVIEW'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

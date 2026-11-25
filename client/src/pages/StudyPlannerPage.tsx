import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, CheckCircle2, Circle, Clock, Flame, 
  ArrowRight, Sparkles, Sliders, CheckSquare, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { IStudyPlan, ICourse, IStudyTask } from '../types';

export const StudyPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCourseId = searchParams.get('courseId') || '';

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);
  const [studyPlan, setStudyPlan] = useState<IStudyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [dailyHours, setDailyHours] = useState<number>(2);
  const [targetDate, setTargetDate] = useState<string>('2026-12-15');
  const [schedulePref, setSchedulePref] = useState<'daily' | 'weekdays' | 'weekends'>('daily');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      api.getCourses(),
      api.getStudyPlan()
    ]).then(([courseData, planData]) => {
      setCourses(courseData);
      if (!selectedCourseId && courseData.length > 0) {
        setSelectedCourseId(courseData[0]._id);
      }
      if (planData) {
        setStudyPlan(planData);
        setDailyHours(planData.dailyStudyHours || 2);
        setTargetDate(planData.targetCompletionDate || '2026-12-15');
        setSchedulePref(planData.schedulePreference || 'daily');
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updated = await api.updateStudyPlan({
        dailyStudyHours: Number(dailyHours),
        targetCompletionDate: targetDate,
        schedulePreference: schedulePref,
        courseId: selectedCourseId
      });
      setStudyPlan(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    try {
      const updated = await api.toggleStudyTask(taskId, !currentStatus);
      setStudyPlan(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const tasks = studyPlan?.tasks || [];
  const completedTasks = tasks.filter(t => t.completed);
  const remainingTasks = tasks.filter(t => !t.completed);
  const overallPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.targetDate === todayStr || (!t.completed && t.targetDate <= todayStr));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 pb-4 border-b-2 border-[#101014] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#FFD21C] uppercase mb-1">
            <Calendar className="w-4 h-4 text-[#101014]" />
            <span className="text-[#101014]">AI PACED LEARNING SCHEDULER</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#101014] uppercase">
            DAILY STUDY PLANNER
          </h1>
        </div>

        <div className="flex items-center space-x-2 bg-[#FFD21C] border-2 border-[#101014] shadow-neo-sm px-3.5 py-1.5 font-mono text-xs font-black">
          <Flame className="w-4 h-4 text-[#101014] fill-[#101014]" />
          <span>STREAK: 6 DAYS ACTIVE</span>
        </div>
      </div>
      <div className="bg-white border-[3px] border-[#101014] shadow-neo-lg p-6 mb-10">
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b-2 border-[#101014]">
          <Sliders className="w-5 h-5 text-[#A77AF5]" />
          <h2 className="font-heading text-lg font-black uppercase text-[#101014]">
            STUDY PARAMETERS & TARGETS
          </h2>
        </div>

        <form onSubmit={handleUpdatePlan} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1">
              TARGET COURSE:
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
            <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1">
              DAILY STUDY HOURS:
            </label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white"
            >
              <option value={1}>1 Hour / Day</option>
              <option value={2}>2 Hours / Day (Recommended)</option>
              <option value={3}>3 Hours / Day</option>
              <option value={4}>4 Hours / Day (Intensive)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1">
              TARGET COMPLETION DATE:
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1">
              SCHEDULE PREFERENCE:
            </label>
            <select
              value={schedulePref}
              onChange={(e) => setSchedulePref(e.target.value as any)}
              className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white"
            >
              <option value="daily">Daily (Every Day)</option>
              <option value="weekdays">Weekdays Only</option>
              <option value="weekends">Weekends Only</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 mt-2">
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-3 bg-[#FFD21C] text-[#101014] font-heading font-black text-sm border-2 border-[#101014] shadow-neo uppercase hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 fill-[#101014]" />
              <span>{isUpdating ? 'RECALCULATING PACING...' : 'REGENERATE STUDY PLAN'}</span>
            </button>
          </div>
        </form>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 text-center">
          <div className="text-[10px] font-mono text-[#101014]/60 uppercase font-bold">TOTAL TASKS</div>
          <div className="font-heading text-3xl font-black text-[#101014]">{tasks.length}</div>
          <div className="text-[10px] font-mono text-[#101014]/70">LESSONS SCHEDULED</div>
        </div>

        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 text-center">
          <div className="text-[10px] font-mono text-[#101014]/60 uppercase font-bold">COMPLETED</div>
          <div className="font-heading text-3xl font-black text-[#35D68B]">{completedTasks.length}</div>
          <div className="text-[10px] font-mono text-[#35D68B] font-bold">LESSONS FINISHED</div>
        </div>

        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 text-center">
          <div className="text-[10px] font-mono text-[#101014]/60 uppercase font-bold">REMAINING</div>
          <div className="font-heading text-3xl font-black text-[#F34D43]">{remainingTasks.length}</div>
          <div className="text-[10px] font-mono text-[#F34D43] font-bold">TASKS TO GO</div>
        </div>

        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 text-center">
          <div className="text-[10px] font-mono text-[#101014]/60 uppercase font-bold">OVERALL PROGRESS</div>
          <div className="font-heading text-3xl font-black text-[#A77AF5]">{overallPercent}%</div>
          <div className="text-[10px] font-mono text-[#101014]/70">ON TRACK FOR {targetDate}</div>
        </div>
      </div>
      <div className="bg-white border-2 border-[#101014] shadow-neo p-6 mb-10">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#101014]">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-[#35D68B]" />
            <h2 className="font-heading text-xl font-black uppercase text-[#101014]">
              TODAY'S LEARNING OBJECTIVES
            </h2>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#35D68B] text-[#101014] border border-[#101014]">
            {todayTasks.filter(t => t.completed).length} / {todayTasks.length} COMPLETED
          </span>
        </div>

        {todayTasks.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-[#101014]/60 border border-dashed border-[#101014]">
            🎉 You have caught up on all tasks for today! Great job staying ahead of schedule.
          </div>
        ) : (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border-2 transition-all flex items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-[#35D68B]/10 border-[#35D68B]'
                    : 'bg-[#F1F0E9] border-[#101014] shadow-neo-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    className="focus:outline-none"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#35D68B] fill-[#101014]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#101014]/40 hover:text-[#101014]" />
                    )}
                  </button>

                  <div>
                    <h4 className={`font-heading text-sm font-bold uppercase ${task.completed ? 'line-through text-[#101014]/60' : 'text-[#101014]'}`}>
                      {task.lessonTitle}
                    </h4>
                    <div className="flex items-center space-x-3 text-[11px] font-mono text-[#101014]/70 mt-0.5">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.durationMinutes} MIN</span>
                      </span>
                      <span>•</span>
                      <span>{task.courseTitle}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/workspace/${task.courseId}?lesson=${task.lessonId}`}
                  className="px-3 py-1.5 bg-[#FFD21C] text-[#101014] font-heading font-black text-xs border-2 border-[#101014] shadow-neo-sm hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 uppercase shrink-0"
                >
                  START NOW
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULL TIMELINE SCHEDULE */}
      <div className="bg-white border-2 border-[#101014] shadow-neo p-6">
        <h2 className="font-heading text-xl font-black uppercase text-[#101014] mb-4 pb-2 border-b-2 border-[#101014]">
          UPCOMING LESSON SCHEDULE
        </h2>

        <div className="space-y-3">
          {tasks.slice(0, 12).map((t, index) => (
            <div
              key={t.id}
              className="p-3 bg-[#F1F0E9] border border-[#101014] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-[#101014] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                  {index + 1}
                </span>
                <div>
                  <span className="font-bold text-[#101014] uppercase">{t.lessonTitle}</span>
                  <div className="text-[10px] text-[#101014]/60">
                    Est. {t.durationMinutes}m • Target: {t.targetDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <span className={`px-2 py-0.5 text-[10px] font-bold border ${t.completed ? 'bg-[#35D68B] text-[#101014]' : 'bg-white text-[#101014]'}`}>
                  {t.completed ? 'COMPLETED' : 'SCHEDULED'}
                </span>

                <Link
                  to={`/workspace/${t.courseId}?lesson=${t.lessonId}`}
                  className="p-1.5 bg-white hover:bg-[#FFD21C] border border-[#101014] text-[#101014]"
                  title="Open in Workspace"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

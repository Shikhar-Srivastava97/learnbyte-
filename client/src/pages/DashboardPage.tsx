import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, CheckCircle, Clock, Flame, 
  Award, BarChart3, Play, Calendar, ArrowRight, Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { IDashboardStats } from '../types';

export const DashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getDashboard()
      .then(data => setDashboard(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !dashboard) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#101014] border-t-[#FFD21C] rounded-full animate-spin mx-auto mb-4"></div>
        <div className="font-mono text-sm font-bold uppercase">Loading Analytics Dashboard...</div>
      </div>
    );
  }

  const { stats, user, recentCourses, todayTasks } = dashboard;
  const recentCourse = recentCourses[0];

  const maxHours = Math.max(...stats.weeklyActivity.map(d => d.hours), 5);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 pb-4 border-b-2 border-[#101014] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#101014] uppercase mb-1">
            <span className="w-2.5 h-2.5 bg-[#35D68B] border border-[#101014]"></span>
            <span>LEARNER TELEMETRY & MASTERY METRICS</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#101014] uppercase">
            STUDENT DASHBOARD
          </h1>
        </div>

        <div className="flex items-center space-x-2 bg-white border-2 border-[#101014] shadow-neo-sm px-3.5 py-1.5 font-mono text-xs font-bold">
          <span>Student: <strong>{user.name}</strong></span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#101014] mb-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#101014]/60">ENROLLED</span>
            <BookOpen className="w-4 h-4 text-[#A77AF5]" />
          </div>
          <div className="font-heading text-3xl font-black text-[#101014]">
            {stats.enrolledCoursesCount}
          </div>
          <div className="text-[10px] font-mono text-[#101014]/70 mt-1 uppercase">
            COURSES ACTIVE
          </div>
        </div>
        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#101014] mb-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#101014]/60">COMPLETED</span>
            <CheckCircle className="w-4 h-4 text-[#35D68B]" />
          </div>
          <div className="font-heading text-3xl font-black text-[#35D68B]">
            {stats.completedLessonsCount}
          </div>
          <div className="text-[10px] font-mono text-[#101014]/70 mt-1 uppercase">
            LESSONS FINISHED
          </div>
        </div>
        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#101014] mb-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#101014]/60">STUDY TIME</span>
            <Clock className="w-4 h-4 text-[#48B7EC]" />
          </div>
          <div className="font-heading text-3xl font-black text-[#101014]">
            {stats.totalHoursStudied}h
          </div>
          <div className="text-[10px] font-mono text-[#101014]/70 mt-1 uppercase">
            TOTAL HOURS
          </div>
        </div>
        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#101014] mb-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#101014]/60">STREAK</span>
            <Flame className="w-4 h-4 text-[#FFD21C] fill-[#FFD21C]" />
          </div>
          <div className="font-heading text-3xl font-black text-[#101014]">
            {stats.studyStreakDays}
          </div>
          <div className="text-[10px] font-mono text-[#101014]/70 mt-1 uppercase">
            DAYS STREAK 🔥
          </div>
        </div>
        <div className="bg-white border-2 border-[#101014] shadow-neo p-4 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[#101014] mb-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#101014]/60">QUIZ AVG</span>
            <Award className="w-4 h-4 text-[#F27CB5]" />
          </div>
          <div className="font-heading text-3xl font-black text-[#A77AF5]">
            {stats.avgQuizScore}%
          </div>
          <div className="text-[10px] font-mono text-[#101014]/70 mt-1 uppercase">
            {stats.totalQuizzesTaken} ASSESSMENTS
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-7 bg-white border-2 border-[#101014] shadow-neo p-6">
          <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#101014]">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-[#48B7EC]" />
              <h2 className="font-heading text-lg font-black uppercase text-[#101014]">
                WEEKLY LEARNING ACTIVITY
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#101014]">
              PAST 7 DAYS
            </span>
          </div>
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b-2 border-[#101014]">
            {stats.weeklyActivity.map((day) => {
              const heightPercent = Math.round((day.hours / maxHours) * 100);

              return (
                <div key={day.day} className="flex-1 flex flex-col items-center group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#101014] text-white text-[10px] font-mono px-1.5 py-0.5 mb-1 text-center whitespace-nowrap shadow-neo-sm">
                    {day.hours}h ({day.completedLessons} les)
                  </div>
                  <div className="w-full max-w-[42px] bg-[#F1F0E9] border-2 border-[#101014] relative h-40 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-[#FFD21C] border-t-2 border-[#101014] group-hover:bg-[#A77AF5] transition-all"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#101014] mt-2 uppercase">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3 text-xs font-mono text-[#101014]/60">
            <span>Chart: Daily Study Hours</span>
            <span>Target: 2.0h / day</span>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col justify-between bg-white border-2 border-[#101014] shadow-neo p-6">
          <div>
            <div className="text-[10px] font-mono text-[#101014]/60 uppercase font-bold mb-2 flex items-center space-x-1">
              <span className="w-2 h-2 bg-[#35D68B]"></span>
              <span>IN PROGRESS COURSE</span>
            </div>

            {recentCourse ? (
              <div>
                <div className="relative aspect-video w-full border-2 border-[#101014] mb-4 overflow-hidden bg-black shadow-neo-sm">
                  <img
                    src={recentCourse.thumbnailUrl}
                    alt={recentCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#FFD21C] text-[#101014] font-mono text-[10px] font-bold border border-[#101014]">
                    {recentCourse.category}
                  </div>
                </div>

                <h3 className="font-heading text-lg font-black uppercase text-[#101014] leading-snug mb-2">
                  {recentCourse.title}
                </h3>

                <p className="text-xs font-mono text-[#101014]/60 mb-4 truncate">
                  Source: {recentCourse.channelTitle}
                </p>
                <div className="mb-4">
                  <div className="flex justify-between items-center text-xs font-mono font-bold mb-1">
                    <span>SYLLABUS PROGRESS</span>
                    <span>{recentCourse.progressPercent || 32}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#F1F0E9] border-2 border-[#101014]">
                    <div
                      className="h-full bg-[#35D68B]"
                      style={{ width: `${recentCourse.progressPercent || 32}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  to={`/workspace/${recentCourse._id}`}
                  className="w-full py-3 bg-[#FFD21C] text-[#101014] font-heading font-black text-xs border-2 border-[#101014] shadow-neo uppercase hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4 fill-[#101014]" />
                  <span>CONTINUE LEARNING NOW</span>
                </Link>
              </div>
            ) : (
              <p className="text-xs font-mono text-[#101014]/60">No enrolled courses yet.</p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white border-2 border-[#101014] shadow-neo p-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#101014]">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#FFD21C]" />
            <h2 className="font-heading text-lg font-black uppercase text-[#101014]">
              TODAY'S REMAINING STUDY TASKS
            </h2>
          </div>
          <Link
            to="/study-plan"
            className="text-xs font-mono font-bold text-[#101014] hover:text-[#A77AF5] flex items-center space-x-1"
          >
            <span>FULL CALENDAR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <p className="text-xs font-mono text-[#101014]/60 p-4 bg-[#F1F0E9] border border-[#101014]">
            All tasks for today are completed! Relax or review your saved notes.
          </p>
        ) : (
          <div className="divide-y divide-[#101014]/15">
            {todayTasks.map((task) => (
              <div key={task.id} className="py-3 flex items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <div className="font-bold text-[#101014] uppercase">{task.lessonTitle}</div>
                  <div className="text-[11px] text-[#101014]/60">
                    Course: {task.courseTitle} • {task.durationMinutes} min
                  </div>
                </div>

                <Link
                  to={`/workspace/${task.courseId}?lesson=${task.lessonId}`}
                  className="px-3 py-1.5 bg-[#FFD21C] text-[#101014] font-heading font-black text-xs border border-[#101014] shadow-neo-sm hover:bg-[#FFE066] uppercase"
                >
                  START
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

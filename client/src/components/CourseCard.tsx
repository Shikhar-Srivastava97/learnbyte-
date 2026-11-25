import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { ICourse } from '../types';

interface CourseCardProps {
  course: ICourse;
  onDelete?: (id: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete }) => {

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const totalModules = course.modules?.length || 0;
  const progressPercent = course.progress?.percentCompleted ?? course.progressPercent ?? 0;

  const categoryColors: Record<string, string> = {
    'DevOps': 'bg-[#A77AF5]',
    'Programming': 'bg-[#F34D43]',
    'AI & Machine Learning': 'bg-[#48B7EC]',
    'Cloud Computing': 'bg-[#35D68B]',
    'Web Development': 'bg-[#F27CB5]'
  };

  const badgeColor = categoryColors[course.category] || 'bg-[#FFD21C]';

  return (
    <div className="bg-white border-2 border-[#101014] shadow-neo flex flex-col h-full transition-all duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#101014] group">
      <div className="relative aspect-video w-full overflow-hidden border-b-2 border-[#101014] bg-[#101014]">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${course.videoId}/hqdefault.jpg`;
          }}
        />
        <div className={`absolute top-2 left-2 ${badgeColor} text-[#101014] px-2 py-0.5 border border-[#101014] font-mono text-[10px] font-bold tracking-wider uppercase shadow-[1px_1px_0px_#101014]`}>
          {course.category}
        </div>
        <div className="absolute top-2 right-2 bg-[#101014] text-white px-2 py-0.5 border border-white font-mono text-[10px] font-bold tracking-wider uppercase flex items-center space-x-1 shadow-[1px_1px_0px_#101014]">
          <Clock className="w-3 h-3 text-[#FFD21C]" />
          <span>{course.totalDuration}</span>
        </div>
        <div className="absolute bottom-2 right-2 bg-[#101014]/90 text-[#35D68B] px-1.5 py-0.5 text-[9px] font-mono border border-[#35D68B]/60">
          NEMOTRON AI
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 text-[11px] font-mono text-[#101014]/70 mb-2">
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-[#101014]" />
              <span>{totalModules} MODULES</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-[#101014]" />
              <span>{totalLessons} LESSONS</span>
            </span>
            <span>•</span>
            <span className="font-bold text-[#101014] uppercase">{course.difficulty}</span>
          </div>
          <h4 className="font-heading text-base font-bold text-[#101014] leading-snug line-clamp-2 uppercase group-hover:text-[#A77AF5] transition-colors mb-2">
            {course.title}
          </h4>
          <p className="text-xs font-mono text-[#101014]/60 mb-3 truncate">
            Source: <span className="text-[#101014] font-semibold">{course.channelTitle}</span>
          </p>
          <p className="text-xs font-sans text-[#101014]/80 line-clamp-2 mb-4">
            {course.description}
          </p>
        </div>

        <div>
          <div className="mb-4">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#101014] mb-1">
              <span className="uppercase">PROGRESS</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F1F0E9] border border-[#101014] overflow-hidden">
              <div
                className="h-full bg-[#35D68B] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2 border-t border-[#101014]/15">
            <Link
              to={`/workspace/${course._id}`}
              className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 bg-[#FFD21C] text-[#101014] font-heading text-xs font-black border-2 border-[#101014] shadow-[2px_2px_0px_#101014] hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase"
            >
              <Play className="w-3.5 h-3.5 fill-[#101014]" />
              <span>{progressPercent > 0 ? 'CONTINUE LEARNING' : 'START COURSE'}</span>
            </Link>

            <Link
              to={`/courses/${course._id}`}
              className="py-2 px-3 bg-[#F1F0E9] text-[#101014] font-heading text-xs font-bold border-2 border-[#101014] shadow-[2px_2px_0px_#101014] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase"
              title="View Detailed Syllabus"
            >
              SYLLABUS
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

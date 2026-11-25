import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Filter, BookOpen, Layers } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { api } from '../services/api';
import { ICourse } from '../types';

export const MyCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'DevOps',
    'Programming',
    'AI & Machine Learning',
    'Cloud Computing',
    'Web Development'
  ];

  const fetchCoursesList = () => {
    setLoading(true);
    api.getCourses(selectedCategory, searchQuery)
      .then(data => setCourses(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoursesList();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCoursesList();
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await api.deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c._id !== courseId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b-2 border-[#101014]">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#101014] uppercase mb-1">
            <span className="w-2.5 h-2.5 bg-[#FFD21C] border border-[#101014]"></span>
            <span>LEARNING LIBRARY & CURATED SYLLABI</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#101014] uppercase">
            MY COURSES & CATALOG
          </h1>
        </div>
        <Link
          to="/generate"
          className="px-5 py-2.5 bg-[#FFD21C] text-[#101014] font-heading font-black text-sm border-2 border-[#101014] shadow-neo hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center space-x-2 uppercase self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>TRANSFORM YOUTUBE LINK</span>
        </Link>
      </div>
      <div className="bg-white border-2 border-[#101014] shadow-neo p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 font-heading text-xs font-bold border-2 transition-all uppercase ${
                selectedCategory === cat
                  ? 'bg-[#101014] text-[#FFD21C] border-[#101014] shadow-[2px_2px_0px_#A77AF5]'
                  : 'bg-[#F1F0E9] text-[#101014] border-[#101014] hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-80 gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, tools, tags..."
              className="w-full bg-[#F1F0E9] border-2 border-[#101014] pl-8 pr-3 py-1.5 text-xs font-mono text-[#101014] focus:outline-none focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-[#101014]/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#101014] text-white font-heading text-xs font-bold border-2 border-[#101014] hover:bg-[#A77AF5] hover:text-[#101014] transition-all uppercase"
          >
            FILTER
          </button>
        </form>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-white border-2 border-[#101014] shadow-neo animate-pulse"></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border-2 border-[#101014] shadow-neo p-12 text-center max-w-xl mx-auto my-12">
          <BookOpen className="w-12 h-12 text-[#101014]/40 mx-auto mb-4" />
          <h3 className="font-heading text-xl font-black uppercase text-[#101014] mb-2">
            NO COURSES FOUND
          </h3>
          <p className="text-xs font-sans text-[#101014]/70 mb-6">
            No courses matched your current filter. Paste any YouTube video link to generate a custom course instantly!
          </p>
          <Link
            to="/generate"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#FFD21C] text-[#101014] font-heading font-black text-xs border-2 border-[#101014] shadow-neo"
          >
            <PlusCircle className="w-4 h-4" />
            <span>GENERATE YOUR FIRST COURSE</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

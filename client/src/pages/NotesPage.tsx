import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, Search, Plus, Bookmark, Trash2, 
  Edit3, Play, Download, Tag, BookOpen, Clock
} from 'lucide-react';
import { api } from '../services/api';
import { INote, ICourse } from '../types';

export const NotesPage: React.FC = () => {
  const navigate = useNavigate();

  const [notes, setNotes] = useState<INote[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [formCourseId, setFormCourseId] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formTimestampMin, setFormTimestampMin] = useState<number>(0);
  const [formTimestampSec, setFormTimestampSec] = useState<number>(0);
  const [formTags, setFormTags] = useState<string>('DevOps, Architecture');

  const fetchNotesList = () => {
    setLoading(true);
    api.getNotes(selectedCourseId !== 'All' ? selectedCourseId : undefined, searchQuery)
      .then(data => setNotes(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      api.getCourses(),
      api.getNotes()
    ]).then(([courseData, notesData]) => {
      setCourses(courseData);
      setNotes(notesData);
      if (courseData.length > 0) {
        setFormCourseId(courseData[0]._id);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchNotesList();
  }, [selectedCourseId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotesList();
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) return;

    const totalSeconds = formTimestampMin * 60 + formTimestampSec;
    const tagArray = formTags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      if (editingNoteId) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        const updated = await api.updateNote(editingNoteId, {
          title: formTitle,
          content: formContent,
          timestamp: totalSeconds,
          timestampFormatted: `${mins}:${secs < 10 ? '0' : ''}${secs}`,
          tags: tagArray
        });
        setNotes(prev => prev.map(n => n._id === editingNoteId ? updated : n));
      } else {
        const newNote = await api.createNote({
          courseId: formCourseId || (courses[0]?._id ?? 'course_devops_30h'),
          lessonId: 'les_1_1',
          title: formTitle || 'Study Note',
          content: formContent,
          timestamp: totalSeconds,
          tags: tagArray
        });
        setNotes(prev => [newNote, ...prev]);
      }

      setShowEditor(false);
      setEditingNoteId(null);
      setFormTitle('');
      setFormContent('');
      setFormTimestampMin(0);
      setFormTimestampSec(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEdit = (note: INote) => {
    setEditingNoteId(note._id);
    setFormCourseId(note.courseId);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormTimestampMin(Math.floor(note.timestamp / 60));
    setFormTimestampSec(note.timestamp % 60);
    setFormTags(note.tags.join(', '));
    setShowEditor(true);
  };

  const handleDelete = async (noteId: string) => {
    if (window.confirm('Delete this note?')) {
      await api.deleteNote(noteId);
      setNotes(prev => prev.filter(n => n._id !== noteId));
    }
  };

  const handleToggleBookmark = async (noteId: string) => {
    const updated = await api.toggleBookmarkNote(noteId);
    setNotes(prev => prev.map(n => n._id === noteId ? updated : n));
  };

  const handleExportMarkdown = () => {
    let md = `# LEARNBYTE STUDY NOTES EXPORT\nGenerated: ${new Date().toLocaleString()}\n\n---\n\n`;
    notes.forEach((n, i) => {
      const course = courses.find(c => c._id === n.courseId);
      md += `## ${i + 1}. ${n.title}\n`;
      md += `**Course:** ${course?.title || n.courseId} | **Timestamp:** ${n.timestampFormatted}\n`;
      md += `**Tags:** ${n.tags.join(', ')}\n\n`;
      md += `${n.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `LearnByte-Notes-${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredNotes = notes.filter(n => {
    if (bookmarkedOnly && !n.bookmarked) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 pb-4 border-b-2 border-[#101014] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#F27CB5] uppercase mb-1">
            <FileText className="w-4 h-4 text-[#F27CB5]" />
            <span>TIMESTAMPED REVISION NOTEBOOK</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-[#101014] uppercase">
            MY VIDEO-LINKED NOTES
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportMarkdown}
            className="px-3.5 py-2 bg-white text-[#101014] font-heading font-bold text-xs border-2 border-[#101014] shadow-neo-sm hover:bg-[#F1F0E9] flex items-center space-x-1.5 uppercase"
            title="Download all notes as Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT .MD</span>
          </button>

          <button
            onClick={() => {
              setEditingNoteId(null);
              setFormTitle('');
              setFormContent('');
              setFormTimestampMin(0);
              setFormTimestampSec(0);
              setShowEditor(true);
            }}
            className="px-4 py-2 bg-[#FFD21C] text-[#101014] font-heading font-black text-xs border-2 border-[#101014] shadow-neo hover:bg-[#FFE066] active:translate-x-0.5 active:translate-y-0.5 uppercase flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NOTE</span>
          </button>
        </div>
      </div>
      <div className="bg-white border-2 border-[#101014] shadow-neo p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="bg-[#F1F0E9] border-2 border-[#101014] px-3 py-1.5 text-xs font-mono text-[#101014] focus:outline-none"
          >
            <option value="All">All Courses</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={`px-3 py-1.5 font-heading text-xs font-bold border-2 flex items-center space-x-1.5 uppercase transition-all ${
              bookmarkedOnly
                ? 'bg-[#FFD21C] text-[#101014] border-[#101014]'
                : 'bg-[#F1F0E9] text-[#101014] border-[#101014]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-[#101014]' : ''}`} />
            <span>BOOKMARKS ONLY</span>
          </button>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex items-center w-full md:w-72 gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search note contents..."
              className="w-full bg-[#F1F0E9] border-2 border-[#101014] pl-8 pr-3 py-1.5 text-xs font-mono text-[#101014] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#101014]/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#101014] text-white font-heading text-xs font-bold border-2 border-[#101014] hover:bg-[#A77AF5] hover:text-[#101014] transition-all uppercase"
          >
            FIND
          </button>
        </form>
      </div>
      {showEditor && (
        <div className="bg-white border-[3px] border-[#101014] shadow-neo-lg p-6 mb-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#101014]">
            <h3 className="font-heading text-lg font-black uppercase text-[#101014]">
              {editingNoteId ? 'EDIT STUDY NOTE' : 'NEW TIMESTAMPED NOTE'}
            </h3>
            <button
              onClick={() => setShowEditor(false)}
              className="text-xs font-mono font-bold text-[#101014] hover:text-[#F34D43]"
            >
              [CANCEL]
            </button>
          </div>

          <form onSubmit={handleSaveNote} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1">
                  COURSE:
                </label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none"
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
                  VIDEO TIMESTAMP (MIN : SEC):
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={formTimestampMin}
                    onChange={(e) => setFormTimestampMin(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none"
                    placeholder="Min"
                  />
                  <span className="font-mono font-bold">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formTimestampSec}
                    onChange={(e) => setFormTimestampSec(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none"
                    placeholder="Sec"
                  />
                  <span className="text-xs font-mono text-[#101014]/60">[MM:SS]</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1">
                NOTE TITLE:
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Docker non-root execution pattern or etcd consensus..."
                className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1">
                CONTENT (MARKDOWN & CLI SUPPORT):
              </label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={5}
                placeholder="Write your explanation, bash command blocks, or caveats..."
                className="w-full bg-[#F1F0E9] border-2 border-[#101014] p-3 text-xs font-mono text-[#101014] focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-[#101014] uppercase mb-1">
                TAGS (COMMA SEPARATED):
              </label>
              <input
                type="text"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="DevOps, Docker, CLI, Security"
                className="w-full bg-[#F1F0E9] border-2 border-[#101014] px-3 py-2 text-xs font-mono text-[#101014] focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 bg-white text-[#101014] border-2 border-[#101014] font-heading font-bold text-xs uppercase"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#35D68B] text-[#101014] border-2 border-[#101014] shadow-neo-sm font-heading font-black text-xs uppercase"
              >
                SAVE NOTE
              </button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-white border-2 border-[#101014] shadow-neo animate-pulse"></div>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white border-2 border-[#101014] shadow-neo p-12 text-center max-w-lg mx-auto">
          <FileText className="w-12 h-12 text-[#101014]/40 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-black uppercase text-[#101014] mb-2">
            NO NOTES FOUND
          </h3>
          <p className="text-xs font-sans text-[#101014]/70 mb-6">
            Take notes while watching video lectures in the Learning Workspace, or click "Create Note" above!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => {
            const course = courses.find(c => c._id === note.courseId);

            return (
              <div
                key={note._id}
                className="bg-white border-2 border-[#101014] shadow-neo p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Link
                      to={`/workspace/${note.courseId}?lesson=${note.lessonId}&t=${note.timestamp}`}
                      className="px-2.5 py-1 bg-[#FFD21C] text-[#101014] font-mono text-xs font-black border-2 border-[#101014] shadow-[1px_1px_0px_#101014] hover:bg-[#FFE066] flex items-center space-x-1.5"
                      title="Jump to video at this timestamp"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{note.timestampFormatted}</span>
                    </Link>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleToggleBookmark(note._id)}
                        className="p-1 hover:text-[#FFD21C]"
                        title="Toggle bookmark"
                      >
                        <Bookmark className={`w-4 h-4 ${note.bookmarked ? 'fill-[#FFD21C] text-[#101014]' : 'text-[#101014]'}`} />
                      </button>
                      <button
                        onClick={() => handleStartEdit(note)}
                        className="p-1 text-[#101014] hover:text-[#A77AF5]"
                        title="Edit note"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="p-1 text-[#101014]/60 hover:text-[#F34D43]"
                        title="Delete note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-heading text-base font-black uppercase text-[#101014] mb-1">
                    {note.title}
                  </h3>
                  <div className="text-[11px] font-mono text-[#A77AF5] font-bold mb-3 truncate">
                    Course: {course?.title || note.courseId}
                  </div>
                  <div className="p-3 bg-[#F1F0E9] border border-[#101014] text-xs font-mono text-[#101014] whitespace-pre-wrap leading-relaxed mb-4">
                    {note.content}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#101014]/15">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-white border border-[#101014]/30 text-[9px] font-mono font-bold text-[#101014]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="text-[10px] font-mono text-[#101014]/50">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import mongoose, { Schema } from 'mongoose';
import { 
  IUser, ICourse, IModule, ILesson, ITranscript, 
  IQuiz, IQuizAttempt, INote, IStudyPlan, IProgress 
} from './types.js';

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  studyStreak: { type: Number, default: 4 },
  totalHoursStudied: { type: Number, default: 28.5 },
  completedLessonsCount: { type: Number, default: 34 },
  preferredStudyHoursPerDay: { type: Number, default: 2 }
}, { timestamps: true });

export const lessonSchema = new Schema<ILesson>({
  moduleId: { type: String, required: true },
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true },
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  duration: { type: String, required: true },
  learningObjectives: [{ type: String }],
  keyConcepts: [{ type: String }],
  summary: { type: String, default: '' },
  notesMarkdown: { type: String, default: '' },
  completed: { type: Boolean, default: false }
});

export const moduleSchema = new Schema<IModule>({
  courseId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, required: true },
  lessons: [lessonSchema]
});

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['DevOps', 'Programming', 'AI & Machine Learning', 'Cloud Computing', 'Web Development', 'General'],
    default: 'DevOps'
  },
  sourceUrl: { type: String, required: true },
  videoId: { type: String, required: true },
  isPlaylist: { type: Boolean, default: false },
  channelTitle: { type: String, default: 'YouTube Educational' },
  thumbnailUrl: { type: String, required: true },
  totalDuration: { type: String, required: true },
  totalDurationSeconds: { type: Number, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  tags: [{ type: String }],
  learningObjectives: [{ type: String }],
  modules: [moduleSchema],
  generatorModel: { type: String, default: 'nvidia/nemotron-4-340b-instruct' },
  isDemo: { type: Boolean, default: false },
  enrolled: { type: Boolean, default: true },
  progressPercent: { type: Number, default: 0 }
}, { timestamps: true });

const transcriptSchema = new Schema<ITranscript>({
  courseId: { type: String, required: true, index: true },
  videoId: { type: String, required: true },
  language: { type: String, default: 'en' },
  segments: [{
    start: { type: Number, required: true },
    duration: { type: Number, required: true },
    text: { type: String, required: true }
  }],
  rawText: { type: String, required: true }
}, { timestamps: true });

const quizSchema = new Schema<IQuiz>({
  courseId: { type: String, required: true, index: true },
  moduleId: { type: String },
  lessonId: { type: String, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  questions: [{
    id: { type: String, required: true },
    type: { type: String, enum: ['multiple_choice', 'true_false', 'short_answer'], required: true },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String, required: true },
    relevantTimestamp: { type: Number, required: true },
    concept: { type: String, required: true }
  }]
}, { timestamps: true });

const quizAttemptSchema = new Schema<IQuizAttempt>({
  quizId: { type: String, required: true, index: true },
  courseId: { type: String, required: true },
  lessonId: { type: String },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{
    questionId: { type: String, required: true },
    userAnswer: { type: Schema.Types.Mixed, required: true },
    isCorrect: { type: Boolean, required: true }
  }],
  completedAt: { type: Date, default: Date.now }
});

const noteSchema = new Schema<INote>({
  userId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  lessonId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  timestampFormatted: { type: String, required: true },
  tags: [{ type: String }],
  bookmarked: { type: Boolean, default: false }
}, { timestamps: true });

const studyPlanSchema = new Schema<IStudyPlan>({
  userId: { type: String, required: true, unique: true },
  courseId: { type: String },
  dailyStudyHours: { type: Number, default: 2 },
  targetCompletionDate: { type: String, required: true },
  schedulePreference: { type: String, enum: ['daily', 'weekdays', 'weekends'], default: 'daily' },
  tasks: [{
    id: { type: String, required: true },
    lessonId: { type: String, required: true },
    courseId: { type: String, required: true },
    courseTitle: { type: String, required: true },
    lessonTitle: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    targetDate: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date }
  }]
}, { timestamps: true });

const progressSchema = new Schema<IProgress>({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  completedLessonIds: [{ type: String }],
  lastLessonId: { type: String },
  lastTimestamp: { type: Number, default: 0 },
  percentCompleted: { type: Number, default: 0 }
}, { timestamps: true });

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export const CourseModel = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);
export const ModuleModel = mongoose.models.Module || mongoose.model<IModule>('Module', moduleSchema);
export const LessonModel = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', lessonSchema);
export const TranscriptModel = mongoose.models.Transcript || mongoose.model<ITranscript>('Transcript', transcriptSchema);
export const QuizModel = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', quizSchema);
export const QuizAttemptModel = mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
export const NoteModel = mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);
export const StudyPlanModel = mongoose.models.StudyPlan || mongoose.model<IStudyPlan>('StudyPlan', studyPlanSchema);
export const ProgressModel = mongoose.models.Progress || mongoose.model<IProgress>('Progress', progressSchema);

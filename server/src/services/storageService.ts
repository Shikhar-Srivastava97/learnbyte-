import mongoose from 'mongoose';
import { 
  ICourse, IQuiz, IQuizAttempt, INote, IStudyPlan, IUser, IProgress, ITranscript 
} from '../models/types.js';
import { 
  UserModel, CourseModel, QuizModel, QuizAttemptModel, 
  NoteModel, StudyPlanModel, ProgressModel, TranscriptModel 
} from '../models/schemas.js';
import { 
  sampleUser, sampleDevOpsCourse, sampleAIMLCourse, 
  sampleWebDevCourse, sampleCloudCourse, sampleProgrammingCourse, 
  sampleQuizzes, sampleNotes, sampleStudyPlan 
} from '../data/sampleCourses.js';

class StorageService {
  private isMongoConnected: boolean = false;

  private users: Map<string, IUser> = new Map();
  private courses: Map<string, ICourse> = new Map();
  private transcripts: Map<string, ITranscript> = new Map();
  private quizzes: Map<string, IQuiz> = new Map();
  private quizAttempts: IQuizAttempt[] = [];
  private notes: Map<string, INote> = new Map();
  private studyPlans: Map<string, IStudyPlan> = new Map();
  private progress: Map<string, IProgress> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {

    this.users.set(sampleUser._id, { 
      ...sampleUser,
      studyStreak: 1,
      totalHoursStudied: 0,
      completedLessonsCount: 0
    });

    this.courses = new Map();
    this.quizzes = new Map();
    this.notes = new Map();
    this.progress = new Map();
    this.studyPlans = new Map();
  }

  public async init(mongoUri?: string): Promise<boolean> {
    if (!mongoUri) {
      console.log('⚡ Running in high-performance local storage mode (no MONGODB_URI provided).');
      return false;
    }
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
      this.isMongoConnected = true;
      console.log('✅ Connected to MongoDB successfully.');
      return true;
    } catch (err: any) {
      console.warn(`⚠️ Could not connect to MongoDB (${err.message}). Using reactive local database engine.`);
      this.isMongoConnected = false;
      return false;
    }
  }

  public getIsConnected(): boolean {
    return this.isMongoConnected;
  }

  public async getUser(userId: string = 'user_default'): Promise<IUser> {
    if (this.isMongoConnected) {
      try {
        const found = await UserModel.findById(userId).lean();
        if (found) return found as unknown as IUser;
      } catch (e) {}
    }
    return this.users.get(userId) || sampleUser;
  }

  public async updateUser(userId: string, data: Partial<IUser>): Promise<IUser> {
    const current = await this.getUser(userId);
    const updated = { ...current, ...data, updatedAt: new Date() };
    this.users.set(userId, updated);
    if (this.isMongoConnected) {
      try {
        await UserModel.findByIdAndUpdate(userId, data, { new: true, upsert: true });
      } catch (e) {}
    }
    return updated;
  }

  public async getCourses(): Promise<ICourse[]> {
    if (this.isMongoConnected) {
      try {
        const list = await CourseModel.find().lean();
        if (list && list.length > 0) return list as unknown as ICourse[];
      } catch (e) {}
    }
    return Array.from(this.courses.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getCourseById(courseId: string): Promise<ICourse | null> {
    if (this.isMongoConnected) {
      try {
        const found = await CourseModel.findById(courseId).lean();
        if (found) return found as unknown as ICourse;
      } catch (e) {}
    }
    return this.courses.get(courseId) || null;
  }

  public async saveCourse(course: ICourse): Promise<ICourse> {
    course.isUserPasted = true;
    course.enrolled = true;
    this.courses.set(course._id, course);
    if (this.isMongoConnected) {
      try {
        await CourseModel.findByIdAndUpdate(course._id, course, { upsert: true, new: true });
      } catch (e) {
        console.error('Mongo saveCourse error:', e);
      }
    }
    return course;
  }

  public async deleteCourse(courseId: string): Promise<boolean> {
    this.courses.delete(courseId);
    if (this.isMongoConnected) {
      try {
        await CourseModel.findByIdAndDelete(courseId);
      } catch (e) {}
    }
    return true;
  }

  public async saveTranscript(transcript: ITranscript): Promise<ITranscript> {
    this.transcripts.set(transcript.courseId, transcript);
    if (this.isMongoConnected) {
      try {
        await TranscriptModel.findOneAndUpdate({ courseId: transcript.courseId }, transcript, { upsert: true });
      } catch (e) {}
    }
    return transcript;
  }

  public async getTranscript(courseId: string): Promise<ITranscript | null> {
    if (this.isMongoConnected) {
      try {
        const found = await TranscriptModel.findOne({ courseId }).lean();
        if (found) return found as unknown as ITranscript;
      } catch (e) {}
    }
    return this.transcripts.get(courseId) || null;
  }

  public async getQuizzesByCourse(courseId: string): Promise<IQuiz[]> {
    if (this.isMongoConnected) {
      try {
        const list = await QuizModel.find({ courseId }).lean();
        if (list && list.length > 0) return list as unknown as IQuiz[];
      } catch (e) {}
    }
    return Array.from(this.quizzes.values()).filter(q => q.courseId === courseId);
  }

  public async getQuizByLesson(lessonId: string): Promise<IQuiz | null> {
    if (this.isMongoConnected) {
      try {
        const found = await QuizModel.findOne({ lessonId }).lean();
        if (found) return found as unknown as IQuiz;
      } catch (e) {}
    }
    for (const q of this.quizzes.values()) {
      if (q.lessonId === lessonId) return q;
    }
    return null;
  }

  public async saveQuiz(quiz: IQuiz): Promise<IQuiz> {
    this.quizzes.set(quiz._id, quiz);
    if (this.isMongoConnected) {
      try {
        await QuizModel.findByIdAndUpdate(quiz._id, quiz, { upsert: true, new: true });
      } catch (e) {}
    }
    return quiz;
  }

  public async saveQuizAttempt(attempt: IQuizAttempt): Promise<IQuizAttempt> {
    this.quizAttempts.unshift(attempt);
    if (this.isMongoConnected) {
      try {
        await QuizAttemptModel.create(attempt);
      } catch (e) {}
    }
    return attempt;
  }

  public async getQuizAttempts(courseId?: string): Promise<IQuizAttempt[]> {
    if (this.isMongoConnected) {
      try {
        const query = courseId ? { courseId } : {};
        const list = await QuizAttemptModel.find(query).sort({ completedAt: -1 }).lean();
        if (list) return list as unknown as IQuizAttempt[];
      } catch (e) {}
    }
    if (courseId) {
      return this.quizAttempts.filter(a => a.courseId === courseId);
    }
    return this.quizAttempts;
  }

  public async getNotes(userId: string = 'user_default', courseId?: string): Promise<INote[]> {
    if (this.isMongoConnected) {
      try {
        const query: any = { userId };
        if (courseId) query.courseId = courseId;
        const list = await NoteModel.find(query).sort({ createdAt: -1 }).lean();
        if (list && list.length > 0) return list as unknown as INote[];
      } catch (e) {}
    }
    let list = Array.from(this.notes.values()).filter(n => n.userId === userId);
    if (courseId) {
      list = list.filter(n => n.courseId === courseId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async createNote(note: INote): Promise<INote> {
    this.notes.set(note._id, note);
    if (this.isMongoConnected) {
      try {
        await NoteModel.create(note);
      } catch (e) {}
    }
    return note;
  }

  public async updateNote(noteId: string, data: Partial<INote>): Promise<INote | null> {
    const existing = this.notes.get(noteId);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.notes.set(noteId, updated);
    if (this.isMongoConnected) {
      try {
        await NoteModel.findByIdAndUpdate(noteId, data, { new: true });
      } catch (e) {}
    }
    return updated;
  }

  public async deleteNote(noteId: string): Promise<boolean> {
    this.notes.delete(noteId);
    if (this.isMongoConnected) {
      try {
        await NoteModel.findByIdAndDelete(noteId);
      } catch (e) {}
    }
    return true;
  }

  public async getStudyPlan(userId: string = 'user_default'): Promise<IStudyPlan | null> {
    if (this.isMongoConnected) {
      try {
        const found = await StudyPlanModel.findOne({ userId }).lean();
        if (found) return found as unknown as IStudyPlan;
      } catch (e) {}
    }
    return this.studyPlans.get(userId) || null;
  }

  public async saveStudyPlan(plan: IStudyPlan): Promise<IStudyPlan> {
    this.studyPlans.set(plan.userId, plan);
    if (this.isMongoConnected) {
      try {
        await StudyPlanModel.findOneAndUpdate({ userId: plan.userId }, plan, { upsert: true, new: true });
      } catch (e) {}
    }
    return plan;
  }

  public async toggleStudyTask(userId: string, taskId: string, completed: boolean): Promise<IStudyPlan | null> {
    const plan = await this.getStudyPlan(userId);
    if (!plan) return null;
    const task = plan.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = completed;
      task.completedAt = completed ? new Date() : undefined;
      plan.updatedAt = new Date();
      await this.saveStudyPlan(plan);
    }
    return plan;
  }

  public async getProgress(userId: string = 'user_default', courseId: string): Promise<IProgress | null> {
    const key = `${userId}_${courseId}`;
    if (this.isMongoConnected) {
      try {
        const found = await ProgressModel.findOne({ userId, courseId }).lean();
        if (found) return found as unknown as IProgress;
      } catch (e) {}
    }
    return this.progress.get(key) || null;
  }

  public async updateLessonProgress(
    userId: string = 'user_default', 
    courseId: string, 
    lessonId: string, 
    completed: boolean,
    timestamp?: number
  ): Promise<IProgress> {
    const key = `${userId}_${courseId}`;
    let prog = this.progress.get(key);
    const course = this.courses.get(courseId);

    let totalLessons = 0;
    if (course) {
      for (const m of course.modules) {
        totalLessons += m.lessons.length;
      }
    }
    totalLessons = Math.max(1, totalLessons);

    if (!prog) {
      prog = {
        _id: `prog_${Date.now()}`,
        userId,
        courseId,
        completedLessonIds: [],
        lastLessonId: lessonId,
        lastTimestamp: timestamp || 0,
        percentCompleted: 0,
        updatedAt: new Date()
      };
    }

    if (completed) {
      if (!prog.completedLessonIds.includes(lessonId)) {
        prog.completedLessonIds.push(lessonId);
      }
    } else {
      prog.completedLessonIds = prog.completedLessonIds.filter(id => id !== lessonId);
    }

    if (lessonId) prog.lastLessonId = lessonId;
    if (timestamp !== undefined) prog.lastTimestamp = timestamp;
    prog.percentCompleted = Math.round((prog.completedLessonIds.length / totalLessons) * 100);
    prog.updatedAt = new Date();

    this.progress.set(key, prog);

    if (course) {
      for (const m of course.modules) {
        for (const l of m.lessons) {
          if (l._id === lessonId) {
            l.completed = completed;
          }
        }
      }
      course.progressPercent = prog.percentCompleted;
      this.courses.set(courseId, course);
    }

    if (this.isMongoConnected) {
      try {
        await ProgressModel.findOneAndUpdate(
          { userId, courseId },
          prog,
          { upsert: true, new: true }
        );
      } catch (e) {}
    }

    return prog;
  }
}

export const storage = new StorageService();

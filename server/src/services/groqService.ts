import { Groq } from 'groq-sdk';
import { ICourse, IModule, ILesson, IQuiz, IQuizQuestion } from '../models/types.js';
import { YouTubeVideoInfo } from './youtubeService.js';

export class GroqService {
  private groqClient: Groq | null = null;
  private defaultModel: string = 'llama-3.3-70b-versatile';

  constructor() {
    this.initClient();
  }

  private initClient() {
    const apiKey = process.env.GROQ_API_KEY || process.env.AI_API_KEY;
    if (apiKey && apiKey.trim().length > 5) {
      try {
        this.groqClient = new Groq({ apiKey: apiKey.trim() });
        console.log('⚡ Groq SDK initialized successfully with Llama 3.3 70B.');
      } catch (e) {
        console.warn('Could not initialize Groq client:', e);
      }
    }
    if (process.env.GROQ_MODEL) {
      this.defaultModel = process.env.GROQ_MODEL;
    }
  }

  public setApiKey(key: string) {
    process.env.GROQ_API_KEY = key.trim();
    this.groqClient = new Groq({ apiKey: key.trim() });
  }

  public getStatus() {
    const hasKey = !!this.groqClient;
    const key = process.env.GROQ_API_KEY || process.env.AI_API_KEY || '';
    return {
      active: hasKey,
      provider: 'Groq Cloud LPU',
      model: this.defaultModel,
      maskedKey: key.length > 8 ? `${key.substring(0, 6)}...${key.substring(key.length - 4)}` : null
    };
  }

  public async generateCourseFromTranscript(
    videoInfo: YouTubeVideoInfo,
    transcriptText: string
  ): Promise<{ course: ICourse; quizzes: IQuiz[]; generatorModel: string; isDemoMode: boolean }> {
    if (this.groqClient) {
      try {
        console.log(`🚀 Dispatching transcript to Groq SDK (${this.defaultModel})...`);
        const result = await this.callGroqSDK(videoInfo, transcriptText);
        return {
          ...result,
          generatorModel: `Groq / ${this.defaultModel}`,
          isDemoMode: false
        };
      } catch (err: any) {
        console.warn(`⚠️ Groq SDK call failed (${err.message}). Using fallback curriculum engine.`);
      }
    }

    const fallback = this.synthesizeCurriculumLocally(videoInfo, transcriptText);
    return {
      ...fallback,
      generatorModel: `Groq / ${this.defaultModel} (Ready)`,
      isDemoMode: true
    };
  }

  private async callGroqSDK(
    videoInfo: YouTubeVideoInfo,
    transcriptText: string
  ): Promise<{ course: ICourse; quizzes: IQuiz[] }> {
    if (!this.groqClient) throw new Error('Groq client not initialized');

    const prompt = `You are an expert curriculum architect. Analyze the educational YouTube video titled "${videoInfo.title}" with a total duration of ${videoInfo.durationSeconds} seconds (${videoInfo.durationFormatted}).
Here is a sample of the video transcript:
"""
${transcriptText.substring(0, 4000)}
"""

Transform this video into a structured online course resembling Udemy/Coursera.
Respond ONLY with a valid JSON object strictly matching this schema:
{
  "title": "Clear, professional course title",
  "description": "Comprehensive course overview (3-4 sentences)",
  "category": "One of: DevOps, Programming, AI & Machine Learning, Cloud Computing, Web Development",
  "difficulty": "One of: Beginner, Intermediate, Advanced",
  "learningObjectives": ["objective 1", "objective 2", "objective 3", "objective 4"],
  "modules": [
    {
      "title": "Module 1: Title",
      "description": "Module overview",
      "lessons": [
        {
          "title": "Lesson title",
          "description": "Lesson description",
          "startTime": 0,
          "endTime": 900,
          "duration": "15:00",
          "learningObjectives": ["lesson objective 1", "lesson objective 2"],
          "keyConcepts": ["Concept 1", "Concept 2"],
          "summary": "Detailed technical summary with key takeaways."
        }
      ]
    }
  ],
  "quizzes": [
    {
      "lessonTitle": "Lesson title that matches above",
      "questions": [
        {
          "type": "multiple_choice",
          "question": "Clear question?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A",
          "explanation": "Why this is correct",
          "relevantTimestamp": 300,
          "concept": "Concept name"
        }
      ]
    }
  ]
}`;

    const completion = await this.groqClient.chat.completions.create({
      model: this.defaultModel,
      messages: [
        { role: 'system', content: 'You are an educational AI that outputs strictly valid JSON without markdown wrapping or conversational text.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return this.buildCourseFromParsedData(parsed, videoInfo);
  }

  private buildCourseFromParsedData(
    parsed: any,
    videoInfo: YouTubeVideoInfo
  ): { course: ICourse; quizzes: IQuiz[] } {
    const courseId = `course_${Date.now()}`;
    const modules: IModule[] = [];
    const quizzes: IQuiz[] = [];

    (parsed.modules || []).forEach((m: any, mIdx: number) => {
      const modId = `mod_${courseId}_${mIdx + 1}`;
      const lessons: ILesson[] = [];

      (m.lessons || []).forEach((l: any, lIdx: number) => {
        const lesId = `les_${modId}_${lIdx + 1}`;
        const lesson: ILesson = {
          _id: lesId,
          moduleId: modId,
          courseId,
          title: l.title || `Lesson ${lIdx + 1}`,
          description: l.description || '',
          order: lIdx + 1,
          startTime: Number(l.startTime) || 0,
          endTime: Number(l.endTime) || 600,
          duration: l.duration || '10:00',
          learningObjectives: l.learningObjectives || [],
          keyConcepts: l.keyConcepts || [],
          summary: l.summary || '',
          completed: false
        };
        lessons.push(lesson);
      });

      modules.push({
        _id: modId,
        courseId,
        title: m.title || `Module ${mIdx + 1}`,
        description: m.description || '',
        order: mIdx + 1,
        lessons
      });
    });

    (parsed.quizzes || []).forEach((q: any, qIdx: number) => {
      const questions: IQuizQuestion[] = (q.questions || []).map((qst: any, qstIdx: number) => ({
        id: `q_${qIdx}_${qstIdx}`,
        type: qst.type || 'multiple_choice',
        question: qst.question || 'Review question',
        options: qst.options || ['Option A', 'Option B'],
        correctAnswer: qst.correctAnswer || qst.options?.[0] || 'Option A',
        explanation: qst.explanation || 'Correct answer according to lesson.',
        relevantTimestamp: Number(qst.relevantTimestamp) || 0,
        concept: qst.concept || 'Core Topic'
      }));

      quizzes.push({
        _id: `quiz_${courseId}_${qIdx}`,
        courseId,
        title: q.title || `Module Assessment ${qIdx + 1}`,
        description: q.description || '',
        questions,
        createdAt: new Date()
      });
    });

    const course: ICourse = {
      _id: courseId,
      title: parsed.title || videoInfo.title,
      description: parsed.description || videoInfo.description || '',
      category: parsed.category || 'DevOps',
      sourceUrl: videoInfo.sourceUrl,
      videoId: videoInfo.videoId,
      isPlaylist: videoInfo.isPlaylist,
      channelTitle: videoInfo.author,
      thumbnailUrl: videoInfo.thumbnailUrl,
      totalDuration: videoInfo.durationFormatted,
      totalDurationSeconds: videoInfo.durationSeconds,
      difficulty: parsed.difficulty || 'Intermediate',
      tags: parsed.tags || ['Groq-AI', 'Llama-3.3'],
      learningObjectives: parsed.learningObjectives || [],
      modules,
      generatorModel: `Groq / ${this.defaultModel}`,
      isDemo: false,
      isUserPasted: true,
      enrolled: true,
      progressPercent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return { course, quizzes };
  }

  private synthesizeCurriculumLocally(
    videoInfo: YouTubeVideoInfo,
    _transcriptText: string
  ): { course: ICourse; quizzes: IQuiz[] } {
    const courseId = `course_${Date.now()}`;
    const titleLower = videoInfo.title.toLowerCase();

    let category: 'DevOps' | 'Programming' | 'AI & Machine Learning' | 'Cloud Computing' | 'Web Development' = 'DevOps';
    if (titleLower.includes('ai') || titleLower.includes('neural') || titleLower.includes('machine learning') || titleLower.includes('llm') || titleLower.includes('deep learning')) {
      category = 'AI & Machine Learning';
    } else if (titleLower.includes('react') || titleLower.includes('css') || titleLower.includes('html') || titleLower.includes('full stack') || titleLower.includes('nextjs') || titleLower.includes('web')) {
      category = 'Web Development';
    } else if (titleLower.includes('cloud') || titleLower.includes('aws') || titleLower.includes('azure') || titleLower.includes('gcp')) {
      category = 'Cloud Computing';
    } else if (titleLower.includes('python') || titleLower.includes('rust') || titleLower.includes('golang') || titleLower.includes('java') || titleLower.includes('c++') || titleLower.includes('code')) {
      category = 'Programming';
    }

    let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
    if (titleLower.includes('beginner') || titleLower.includes('crash course') || titleLower.includes('intro')) {
      difficulty = 'Beginner';
    } else if (titleLower.includes('advanced') || titleLower.includes('internals') || titleLower.includes('architecture') || titleLower.includes('masterclass')) {
      difficulty = 'Advanced';
    }

    const totalSecs = Math.max(1800, videoInfo.durationSeconds);
    const { modules, quizzes } = this.generateModulesForCategory(category, videoInfo, totalSecs, courseId);

    const learningObjectives = [
      `Analyze core principles and architecture of ${videoInfo.title}`,
      'Implement industry best practices, debugging strategies, and performance optimizations',
      'Translate conceptual foundations into hands-on code and production configurations',
      'Confidently design, verify, and maintain scalable solutions in real-world environments'
    ];

    const course: ICourse = {
      _id: courseId,
      title: videoInfo.title.length > 5 ? videoInfo.title : 'Comprehensive Systems & Engineering Masterclass',
      description: videoInfo.description || `A structured online curriculum transformed from ${videoInfo.author}'s YouTube masterclass using Groq AI. Organized into logical conceptual modules with bite-sized video lessons, real-time quizzes, and interactive notes.`,
      category,
      sourceUrl: videoInfo.sourceUrl,
      videoId: videoInfo.videoId,
      isPlaylist: videoInfo.isPlaylist,
      channelTitle: videoInfo.author,
      thumbnailUrl: videoInfo.thumbnailUrl,
      totalDuration: videoInfo.durationFormatted,
      totalDurationSeconds: totalSecs,
      difficulty,
      tags: [category, 'Groq-AI', 'Hands-On', 'Comprehensive'],
      learningObjectives,
      modules,
      generatorModel: `Groq / ${this.defaultModel}`,
      isDemo: true,
      isUserPasted: true,
      enrolled: true,
      progressPercent: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return { course, quizzes };
  }

  private generateModulesForCategory(
    category: string,
    videoInfo: YouTubeVideoInfo,
    totalSeconds: number,
    courseId: string
  ): { modules: IModule[]; quizzes: IQuiz[] } {
    const curriculumBlueprints: Record<string, { modTitle: string; modDesc: string; lessons: string[] }[]> = {
      DevOps: [
        {
          modTitle: 'Module 1: Operating System Fundamentals & Process Control',
          modDesc: 'Core Linux architecture, kernel interfaces, signals, and bash workflow automation.',
          lessons: ['Kernel Architecture & Process Subsystems', 'Memory Virtualization & File Descriptors', 'Defensive Shell Automation & Signal Trapping']
        },
        {
          modTitle: 'Module 2: Containerization & Secure Image Building',
          modDesc: 'OCI runtimes, multi-stage Dockerfiles, and minimal footprint attack reduction.',
          lessons: ['Namespaces, cgroups & Container Isolation', 'Multi-Stage Build Optimization & Distroless Base', 'Container Networking & Healthcheck Probes']
        },
        {
          modTitle: 'Module 3: Production Kubernetes Orchestration',
          modDesc: 'Cluster control planes, zero-downtime rolling updates, and declarative management.',
          lessons: ['Kubernetes Control Plane & Raft Consensus in etcd', 'Deployments, ReplicaSets & Zero-Downtime Rollouts', 'Ingress Controllers, TLS Termination & Services']
        },
        {
          modTitle: 'Module 4: Infrastructure as Code & Continuous Delivery',
          modDesc: 'Terraform state management, GitHub Actions pipelines, and GitOps synchronization.',
          lessons: ['Terraform State Locking & Composable Cloud Modules', 'Automated CI Pipelines with Vulnerability Scanning', 'GitOps Continuous Delivery with ArgoCD & Flux']
        }
      ],
      'AI & Machine Learning': [
        {
          modTitle: 'Module 1: Mathematical Foundations & Autograd',
          modDesc: 'Computational graphs, partial derivatives, and symbolic backpropagation.',
          lessons: ['Computational Graphs & Reverse-Mode Differentiation', 'Tensor Operations & Vectorized Math', 'Loss Functions & Gradient Descent Dynamics']
        },
        {
          modTitle: 'Module 2: Neural Architecture & Transformer Foundations',
          modDesc: 'Multi-layer perceptrons, embeddings, and self-attention algorithms.',
          lessons: ['Feedforward Networks & Activation Selection', 'Self-Attention Mechanisms & Matrix Scoring', 'Positional Encodings & Layer Normalization']
        },
        {
          modTitle: 'Module 3: Groq LLM Inference & Optimization',
          modDesc: 'Groq LPU architecture, tensor parallelism, and low-latency serving.',
          lessons: ['Groq LPU Architecture & Token Throughput', 'Parameter-Efficient Fine-Tuning (LoRA / QLoRA)', 'Evaluation, Alignment & Safe Guardrails']
        }
      ],
      'Web Development': [
        {
          modTitle: 'Module 1: Advanced TypeScript & Type Modeling',
          modDesc: 'Generics, conditional types, and compile-time correctness guarantees.',
          lessons: ['Discriminated Unions & Exhaustive State Machines', 'Template Literal Types & Type Guards', 'Runtime Schema Validation with Zero Overhead']
        },
        {
          modTitle: 'Module 2: React Performance & Modern State Management',
          modDesc: 'Virtual DOM reconciliation, concurrent rendering, and clean separation of concerns.',
          lessons: ['Component Lifecycle & Profiler Diagnostics', 'Atomic State & Immutable State Transitions', 'Custom Hooks & Reusable Logic Encapsulation']
        },
        {
          modTitle: 'Module 3: Full-Stack Integration & API Architecture',
          modDesc: 'Server rendering, streaming hydration, and secure data contracts.',
          lessons: ['Streaming SSR & Hydration Boundaries', 'REST vs GraphQL vs tRPC Data Contracts', 'Production Bundling, Tree-Shaking & Web Vitals']
        }
      ],
      'Cloud Computing': [
        {
          modTitle: 'Module 1: Cloud Networking & Security Foundations',
          modDesc: 'Virtual Private Clouds, CIDR segmentation, and defense-in-depth isolation.',
          lessons: ['VPC Topology, Subnets & Internet Gateways', 'Security Groups vs Network Access Control Lists', 'IAM Role Assumption & Principle of Least Privilege']
        },
        {
          modTitle: 'Module 2: Compute Platforms & Serverless Scale',
          modDesc: 'EC2 instance families, container tasks, and event-driven microservices.',
          lessons: ['Elastic Compute & Auto-Scaling Policies', 'Serverless Functions & Cold Start Optimization', 'Managed Kubernetes & Container Runtimes']
        },
        {
          modTitle: 'Module 3: High Availability, Storage & Reliability',
          modDesc: 'Multi-AZ disaster recovery, object storage tiering, and low-latency databases.',
          lessons: ['S3 Lifecycle Policies & Envelope Encryption', 'Relational vs Distributed NoSQL Datastores', 'Route 53 DNS Failover & Global Latency Routing']
        }
      ]
    };

    const blueprint = curriculumBlueprints[category] || curriculumBlueprints['DevOps'];
    
    let totalLessonCount = 0;
    blueprint.forEach(m => totalLessonCount += m.lessons.length);
    const lessonDuration = Math.floor(totalSeconds / totalLessonCount);

    const modules: IModule[] = [];
    const quizzes: IQuiz[] = [];
    let currentSecond = 0;

    blueprint.forEach((bMod, modIndex) => {
      const modId = `mod_${courseId}_${modIndex + 1}`;
      const lessons: ILesson[] = [];

      bMod.lessons.forEach((lesTitle, lesIndex) => {
        const lesId = `les_${modId}_${lesIndex + 1}`;
        const start = currentSecond;
        const end = Math.min(totalSeconds, currentSecond + lessonDuration);
        currentSecond = end;

        const minutes = Math.floor((end - start) / 60);
        const seconds = (end - start) % 60;
        const durationFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        const lesson: ILesson = {
          _id: lesId,
          moduleId: modId,
          courseId,
          title: lesTitle,
          description: `Deep dive into ${lesTitle.toLowerCase()} as presented in this video section.`,
          order: lesIndex + 1,
          startTime: start,
          endTime: end,
          duration: durationFormatted,
          learningObjectives: [
            `Understand the operational mechanics of ${lesTitle}`,
            'Apply core architectural design patterns to prevent production failures',
            'Validate functionality using standard diagnostics and command-line tools'
          ],
          keyConcepts: [
            lesTitle.split(' ')[0],
            'Architecture',
            'Best Practices',
            'Production Deployment'
          ],
          summary: `This lesson covers ${lesTitle}. The instructor explains foundational mechanics, architectural trade-offs, and provides step-by-step demonstrations from timestamp ${Math.floor(start/60)}m to ${Math.floor(end/60)}m. Make sure to review the key concepts before attempting the quiz.`,
          completed: false
        };

        lessons.push(lesson);

        const quiz: IQuiz = {
          _id: `quiz_${lesId}`,
          courseId,
          moduleId: modId,
          lessonId: lesId,
          title: `Quiz: ${lesTitle}`,
          description: `Verify your understanding of ${lesTitle}.`,
          questions: [
            {
              id: `q_${lesId}_1`,
              type: 'multiple_choice',
              question: `What is the primary operational objective when implementing ${lesTitle}?`,
              options: [
                'Ensuring deterministic, reliable, and fault-tolerant system behavior',
                'Maximizing arbitrary resource consumption without observability',
                'Bypassing security controls to speed up build iterations',
                'Eliminating all automated checks in favor of manual intervention'
              ],
              correctAnswer: 'Ensuring deterministic, reliable, and fault-tolerant system behavior',
              explanation: 'System resilience and determinism are paramount in production engineering, ensuring workloads recover smoothly from unexpected faults.',
              relevantTimestamp: start + Math.min(60, Math.floor((end - start) * 0.2)),
              concept: lesTitle
            },
            {
              id: `q_${lesId}_2`,
              type: 'true_false',
              question: `True or False: The configuration patterns taught in ${lesTitle} should be version-controlled and tested in staging prior to production deployment.`,
              options: ['True', 'False'],
              correctAnswer: 'True',
              explanation: 'Every infrastructure or code change must be version-controlled, reviewed, and validated through automated testing before reaching production systems.',
              relevantTimestamp: start + Math.min(180, Math.floor((end - start) * 0.5)),
              concept: 'Configuration Management'
            },
            {
              id: `q_${lesId}_3`,
              type: 'short_answer',
              question: `What is the key metric or command discussed in this lesson for validating status? (Hint: check output logs or health endpoint)`,
              correctAnswer: 'health',
              explanation: 'Health checks and status probes provide automated verification that the workload is fully initialized and ready to accept traffic.',
              relevantTimestamp: start + Math.min(300, Math.floor((end - start) * 0.8)),
              concept: 'Health Verification'
            }
          ],
          createdAt: new Date()
        };

        quizzes.push(quiz);
      });

      modules.push({
        _id: modId,
        courseId,
        title: bMod.modTitle,
        description: bMod.modDesc,
        order: modIndex + 1,
        lessons
      });
    });

    return { modules, quizzes };
  }
}

export const groqService = new GroqService();

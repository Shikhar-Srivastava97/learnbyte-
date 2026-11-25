# ⚡ LEARNBYTE — AI YouTube-to-Course Learning Platform

> Transform lengthy YouTube educational videos and playlists into structured, mastery-level online courses powered by NVIDIA Nemotron.

---

## 🎨 Visual Design System & Aesthetics

LEARNBYTE is designed with a **Neo-Brutalist & Retro Arcade** visual identity matching the reference aesthetic:

- **Background:** `#F1F0E9` (warm vintage cream with subtle 24px grid overlay)
- **Primary Contrast:** `#101014` (deep solid black)
- **Vibrant Accent Palette:**
  - **Purple:** `#A77AF5` (DevOps & Systems)
  - **Red:** `#F34D43` (Programming & Languages)
  - **Blue:** `#48B7EC` (AI & Machine Learning)
  - **Green:** `#35D68B` (Cloud Computing & Success)
  - **Pink:** `#F27CB5` (Web Development & Notes)
  - **Yellow:** `#FFD21C` (Primary Action Buttons & Badges)
  - **White:** `#FFFFFF` (Card Interiors)
- **Typography:**
  - **Headings:** *Space Grotesk* (Bold 800/900 uppercase)
  - **Body Text:** *Inter* (Clean, readable sans-serif)
  - **Metadata & Timestamps:** *JetBrains Mono* (Code and telemetry metrics)
- **Key Visual Elements:**
  - Thick black borders (`border-2 border-[#101014]` / `border-[3px] border-[#101014]`)
  - Hard offset drop shadows (`4px 4px 0px #101014`, zero blur)
  - Halftone dot texture overlays (`bg-halftone`)
  - Retro arcade marquee ribbons and pixel badges
  - Sharp rectangular cards (no glassmorphism, no generic SaaS templates)

---

## 🚀 Application Pages & Features

### 1. Home Page (`/`)
- **Hero Section:** `"STOP WATCHING. START LEARNING."` with animated Nemotron badge.
- **YouTube URL Input Bar:** Paste any YouTube video or playlist link with instant clipboard detection.
- **Quick Sample Buttons:** Try popular long-form tutorials (e.g. 30-Hour DevOps Bootcamp, Neural Networks From Scratch, Full-Stack TypeScript, AWS Solutions Architect).
- **Core Value Highlights:** AI Generated Lessons, Smart Study Planner, Timestamped Quizzes, Video-linked Notes.
- **Transform Any Video Into Course:** 3-step interactive breakdown to convert any YouTube link into a structured academy.
- **Continue Learning Section:** Shows only user-pasted and generated courses with progress indicators.

### 2. Course Generation Pipeline (`/generate`)
- Real-time 5-stage progress screen with status indicators:
  1. *Fetching Video Information* (URL validation & metadata extraction)
  2. *Extracting Transcript* (timestamped audio caption tracks)
  3. *Understanding Topics* (Nemotron conceptual hierarchy analysis)
  4. *Structuring Curriculum* (modules, lessons & learning objectives synthesis)
  5. *Generating Lessons* (bite-sized chunks, preserved video timestamps, quiz bank)
- Live terminal log console streaming token generation and curriculum mapping.

### 3. My Courses Catalog (`/courses`)
- Grid of generated and enrolled courses.
- Filter by domain (DevOps, Programming, AI & ML, Cloud, Web Dev).
- Keyword search by tools and topics.
- Course cards showing thumbnail, title, channel, duration, module count, lesson count, and progress bar.

### 4. Course Details & Syllabus (`/courses/:id`)
- Course overview: total duration, difficulty, generator model (`NVIDIA Nemotron 4-340B`), channel credits.
- Learning objectives checklist (*"What You Will Master"*).
- Expandable accordion syllabus: each module expands to display lesson titles, durations, completion status, and direct `"PLAY LESSON"` buttons.

### 5. Learning Workspace (`/workspace/:courseId`)
The signature three-column focused study environment:
- **Left Column:** Expandable curriculum syllabus with live lesson selection and completion checkmarks.
- **Center Column:** Embedded YouTube player with timestamp seeking, previous/next lesson triggers, playback speed toggles (1x - 2x), and a *"Mark Completed"* button that triggers celebratory progress.
- **Right Column (4 Tabs):**
  - **AI Summary:** Nemotron pedagogical breakdown, learning objectives, and an *"Ask Nemotron"* prompt box.
  - **My Notes:** Interactive notebook that auto-tags the current video second (`[+ Note at 05:40]`). Clicking any saved note's timestamp badge immediately seeks the player!
  - **Quiz:** Mini-quiz for the active lesson with instant grading, feedback explanations, and a **"REVISIT THIS CONCEPT"** button that seeks the video to the exact moment where the topic was taught.
  - **Key Concepts:** Flashcards and CLI cheatsheet.

### 6. AI Quiz Center (`/quizzes`)
- Select any course and module/lesson.
- Multiple-choice, True/False, and Short-answer questions.
- Instant grading with explanation breakdowns.
- **"REVISIT THIS CONCEPT"** button that jumps the student to the source timestamp.
- Previous attempts scorecard and history.

### 7. Daily Study Planner (`/study-plan`)
- Set daily study hours (1h - 4h), target completion date, and preferred schedule (Daily, Weekdays, Weekends).
- Auto-generates paced daily lesson tasks.
- Today's tasks checklist with completion toggles.
- Chronological weekly learning timeline.

### 8. Video-Linked Notes (`/notes`)
- Global notebook across all enrolled courses.
- Filter by course, keyword search, and bookmark toggle.
- Create, edit, and delete timestamped notes.
- One-click **"Export .MD"** button to download all study notes as a formatted Markdown document.

### 9. Analytics Dashboard (`/dashboard`)
- 5 core metric cards: Enrolled Courses, Completed Lessons, Study Hours, Study Streak (🔥), Quiz Average.
- Interactive weekly learning activity bar chart.
- Quick-resume active course card.

### 10. Profile & AI Settings (`/profile`)
- Student identity and achievements.
- Optional NVIDIA NIM API Key configuration (`NVIDIA_API_KEY`) and model selector (`nvidia/nemotron-4-340b-instruct`).
- Fallback high-performance curriculum synthesis engine indicator.

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite**
- **Tailwind CSS** with custom Neo-Brutalist design system
- **React Router 6**
- **Lucide Icons**
- **YouTube IFrame API**

### Backend
- **Node.js** & **Express**
- **MongoDB & Mongoose Models:** `User`, `Course`, `Module`, `Lesson`, `Transcript`, `Quiz`, `QuizAttempt`, `Note`, `StudyPlan`, `Progress`
- **Dual-Storage Engine:** Seamlessly connects to MongoDB when `MONGODB_URI` is provided, and automatically uses a high-performance reactive storage engine when running standalone.
- **NVIDIA Nemotron Integration:** Integration-ready service targeting NVIDIA NIM endpoint (`https://integrate.api.nvidia.com/v1/chat/completions`) with structured JSON schema output, plus intelligent fallback simulator.

---

## 👤 Author

Developed by **Shikhar** for the LEARNBYTE AI learning platform.

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
# Server running at http://localhost:5000
```

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
# Frontend running at http://localhost:5173
```

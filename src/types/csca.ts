export type Subject = 
  | 'Mathematics' 
  | 'Physics' 
  | 'Chemistry' 
  | 'Science Chinese' 
  | 'Humanities Chinese'
  | 'Professional Chinese';

export type Language = 'en' | 'zh';

export type QuizMode = 'mock' | 'topic' | 'daily' | 'ai' | 'mistake' | 'past_paper';

export interface Question {
  id: string;
  subject: Subject;
  module: string;
  subtopic: string;
  difficulty: 'Standard' | 'Challenging' | 'Advanced';
  questionEn: string;
  questionZh: string;
  optionsEn: [string, string, string, string];
  optionsZh: [string, string, string, string];
  correctOption: 0 | 1 | 2 | 3;
  explanationEn: string;
  explanationZh: string;
  formula?: string;
  syllabusRef?: string;
  examPaper?: string; // e.g., 'January 2026 Official Exam', 'April 2026 Exam', 'March 2026 Exam', 'December 2025 Exam'
  questionNumber?: number; // 1 to 48 or 1 to 80
  section?: string; // e.g., '识解汉字', '选词填空', '辨析词语', '选词成段', '补全语句', '阅读理解'
}

export interface QuizSession {
  id: string;
  mode: QuizMode;
  subject: Subject | 'All';
  moduleTitle?: string;
  examPaper?: string;
  totalQuestions: number;
  timeLimitSeconds: number; // 3600 for 60 min, 5400 for 90 min, 0 for untimed
  timeSpentSeconds: number;
  questions: Question[];
  userAnswers: Record<number, number>; // questionIndex -> optionIndex (0..3)
  flaggedQuestions: Record<number, boolean>; // questionIndex -> boolean
  isCompleted: boolean;
  score: number; // scaled to 100 points
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number; // percentage
  startedAt: string;
  completedAt?: string;
}

export interface MistakeRecord {
  questionId: string;
  question: Question;
  selectedOption: number;
  firstFailedAt: string;
  lastFailedAt: string;
  incorrectAttempts: number;
  consecutiveCorrect: number;
  resolved: boolean;
}

export interface UserProgress {
  candidateId: string;
  candidateName: string;
  candidateEmail?: string;
  applicationType: 'CGS' | 'Self-Funded' | 'University-Direct';
  targetUniversity?: string;
  registeredSubjects: Subject[];
  sessionsHistory: QuizSession[];
  totalQuestionsAttempted: number;
  totalCorrect: number;
  streakDays: number;
  lastActiveDate: string;
  subjectStats: Record<Subject, {
    attempted: number;
    correct: number;
    testsTaken: number;
    highestScore: number;
    latestScore: number;
  }>;
  moduleMastery: Record<string, {
    subject: Subject;
    attempted: number;
    correct: number;
  }>;
  mistakeBook: MistakeRecord[];
}

export interface SyllabusModule {
  titleEn: string;
  titleZh: string;
  itemsEn: string[];
  itemsZh: string[];
}

export interface SyllabusData {
  subject: Subject;
  code: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  languages: string;
  questionType: string;
  purposeEn: string;
  purposeZh: string;
  modules: SyllabusModule[];
}

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PracticeHub } from './components/PracticeHub';
import { ExamInterface } from './components/ExamInterface';
import { ExamResultModal } from './components/ExamResultModal';
import { ProgressDashboard } from './components/ProgressDashboard';
import { SyllabusExplorer } from './components/SyllabusExplorer';
import { AiGeneratorTutor } from './components/AiGeneratorTutor';
import { MistakeNotebook } from './components/MistakeNotebook';
import { 
  Subject, 
  Language, 
  UserProgress, 
  QuizSession, 
  QuizMode, 
  Question 
} from './types/csca';
import { 
  loadUserProgress, 
  saveUserProgress, 
  recordCompletedSession, 
  seedBaselineProgress 
} from './utils/storage';
import { OFFICIAL_QUESTION_BANK } from './data/questionBank';
import { OFFICIAL_SYLLABI } from './data/syllabusData';
import { CscaLogo } from './components/CscaLogo';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('hub');
  const [userProgress, setUserProgress] = useState<UserProgress>(loadUserProgress());

  // Active quiz state
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [completedSessionToReview, setCompletedSessionToReview] = useState<QuizSession | null>(null);

  // Initialize or seed baseline on mount
  useEffect(() => {
    const loaded = loadUserProgress();
    if (loaded.sessionsHistory.length === 0) {
      const seeded = seedBaselineProgress();
      setUserProgress(seeded);
    } else {
      setUserProgress(loaded);
    }
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'zh' : 'en'));
  };

  /**
   * Start a new Quiz Session
   */
  const handleStartQuiz = (
    mode: QuizMode,
    subject: Subject | 'All',
    options?: { moduleTitle?: string; count?: number; timeLimit?: number }
  ) => {
    // Collect questions
    let candidates = [...OFFICIAL_QUESTION_BANK];

    if (subject !== 'All') {
      candidates = candidates.filter((q) => q.subject === subject);
    }

    if (options?.moduleTitle) {
      candidates = candidates.filter((q) => q.module.toLowerCase().includes(options.moduleTitle!.toLowerCase()));
      // If none match strictly, fallback to subject pool
      if (candidates.length === 0 && subject !== 'All') {
        candidates = OFFICIAL_QUESTION_BANK.filter((q) => q.subject === subject);
      }
    }

    // Shuffle questions
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    const targetCount = options?.count || (mode === 'mock' ? (subject === 'Professional Chinese' ? 80 : 48) : 5);
    
    // In prototype, if pool is smaller than 48, duplicate/cycle to give realistic exam volume if requested
    let finalQuestions: Question[] = [];
    if (shuffled.length >= targetCount) {
      finalQuestions = shuffled.slice(0, targetCount);
    } else {
      while (finalQuestions.length < targetCount && shuffled.length > 0) {
        finalQuestions.push(...shuffled);
      }
      finalQuestions = finalQuestions.slice(0, targetCount).map((q, i) => ({
        ...q,
        id: `${q.id}-q${i + 1}`,
      }));
    }

    // Duration calculation
    let timeLimit = options?.timeLimit;
    if (timeLimit === undefined) {
      if (mode === 'mock') {
        timeLimit = subject === 'Professional Chinese' ? 5400 : 3600; // 90 or 60 min
      } else if (mode === 'daily') {
        timeLimit = 900; // 15 min for 10 Qs
      } else {
        timeLimit = 0; // untimed practice drill
      }
    }

    const newSession: QuizSession = {
      id: `session-${Date.now()}`,
      mode,
      subject,
      moduleTitle: options?.moduleTitle,
      totalQuestions: finalQuestions.length,
      timeLimitSeconds: timeLimit,
      timeSpentSeconds: 0,
      questions: finalQuestions,
      userAnswers: {},
      flaggedQuestions: {},
      isCompleted: false,
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      unansweredCount: finalQuestions.length,
      accuracy: 0,
      startedAt: new Date().toISOString(),
    };

    setCompletedSessionToReview(null);
    setActiveSession(newSession);
  };

  /**
   * Start a custom session from AI-generated questions or Mistake book
   */
  const handleStartCustomQuiz = (questions: Question[], subject: Subject) => {
    const newSession: QuizSession = {
      id: `custom-session-${Date.now()}`,
      mode: 'ai',
      subject,
      totalQuestions: questions.length,
      timeLimitSeconds: questions.length * 90, // 1.5 min per question
      timeSpentSeconds: 0,
      questions,
      userAnswers: {},
      flaggedQuestions: {},
      isCompleted: false,
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      unansweredCount: questions.length,
      accuracy: 0,
      startedAt: new Date().toISOString(),
    };

    setCompletedSessionToReview(null);
    setActiveSession(newSession);
  };

  /**
   * Handle Exam Submission and Auto-Grading
   */
  const handleSubmitExam = (sessionToGrade: QuizSession) => {
    let correct = 0;
    let incorrect = 0;

    sessionToGrade.questions.forEach((q, idx) => {
      const ans = sessionToGrade.userAnswers[idx];
      if (ans === q.correctOption) {
        correct += 1;
      } else if (ans !== undefined) {
        incorrect += 1;
      }
    });

    const total = sessionToGrade.questions.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    // Scale to official 100 points
    const scaledScore = Math.round((correct / total) * 100);

    const completedSession: QuizSession = {
      ...sessionToGrade,
      isCompleted: true,
      score: scaledScore,
      correctCount: correct,
      incorrectCount: incorrect,
      unansweredCount: total - (correct + incorrect),
      accuracy,
      completedAt: new Date().toISOString(),
    };

    // Save and update user progress metrics
    const updatedProgress = recordCompletedSession(completedSession);
    setUserProgress(updatedProgress);

    // Switch view to Result review
    setActiveSession(null);
    setCompletedSessionToReview(completedSession);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* Top Main Navigation Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (activeSession) {
            if (confirm(lang === 'zh' ? '正在进行考试，确定要离开吗？当前答卷将不会被保存。' : 'You are currently in an active exam. Leave without saving?')) {
              setActiveSession(null);
              setCompletedSessionToReview(null);
              setCurrentTab(tab);
            }
          } else {
            setActiveSession(null);
            setCompletedSessionToReview(null);
            setCurrentTab(tab);
          }
        }}
        lang={lang}
        onToggleLang={handleToggleLang}
        userProgress={userProgress}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-24">
        {activeSession ? (
          /* Active Examination Screen */
          <ExamInterface
            session={activeSession}
            lang={lang}
            onUpdateSession={setActiveSession}
            onSubmitExam={handleSubmitExam}
            onExitExam={() => {
              setActiveSession(null);
              setCompletedSessionToReview(null);
            }}
          />
        ) : completedSessionToReview ? (
          /* Post-Exam Graded Result Screen */
          <ExamResultModal
            session={completedSessionToReview}
            lang={lang}
            onRetake={() => {
              handleStartQuiz(
                completedSessionToReview.mode,
                completedSessionToReview.subject,
                { count: completedSessionToReview.questions.length }
              );
            }}
            onGoToHub={() => {
              setCompletedSessionToReview(null);
              setCurrentTab('hub');
            }}
            onGoToMistakes={() => {
              setCompletedSessionToReview(null);
              setCurrentTab('mistakes');
            }}
          />
        ) : (
          /* Tab Views */
          <>
            {currentTab === 'hub' && (
              <PracticeHub
                lang={lang}
                userProgress={userProgress}
                onStartQuiz={handleStartQuiz}
                onNavigate={(tab) => {
                  if (tab === 'mock') {
                    handleStartQuiz('mock', 'Mathematics');
                  } else {
                    setCurrentTab(tab);
                  }
                }}
              />
            )}

            {currentTab === 'mock' && (
              <div className="space-y-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                        Official Timed Mock Assessment
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                        {lang === 'zh' ? 'CSCA 全真模拟考场' : 'CSCA Full-Length Timed Examination'}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {lang === 'zh' 
                          ? '严格模拟真实考场倒计时、单选题题型、100分制计分，全面检验综合应试能力。'
                          : 'Simulate the strict 60/90 minute timed conditions, candidate answer sheet, and 100-point scoring scale.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    {(['Mathematics', 'Physics', 'Chemistry', 'Professional Chinese'] as Subject[]).map((subj) => {
                      const syl = OFFICIAL_SYLLABI[subj];
                      const subjImages: Record<Subject, string> = {
                        Mathematics: '/src/assets/images/math_card_banner_1791957939868.jpg',
                        Physics: '/src/assets/images/physics_card_banner_1791957940677.jpg',
                        Chemistry: '/src/assets/images/chemistry_card_banner_1791957942918.jpg',
                        'Professional Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
                      };

                      return (
                        <div key={subj} className="rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between bg-white overflow-hidden group">
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={subjImages[subj]}
                              alt={subj}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
                            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                              <h3 className="font-bold text-white text-lg">{subj}</h3>
                              <span className="text-xs font-mono font-bold bg-white/90 text-slate-900 px-2.5 py-0.5 rounded-lg shadow-sm">
                                {syl.durationMinutes} min · {syl.totalQuestions} Qs
                              </span>
                            </div>
                          </div>

                          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {lang === 'zh' ? syl.purposeZh : syl.purposeEn}
                            </p>

                            <button
                              onClick={() => handleStartQuiz('mock', subj, { count: syl.totalQuestions, timeLimit: syl.durationMinutes * 60 })}
                              className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                              <span>{lang === 'zh' ? `开始 ${subj} 模考 (${syl.totalQuestions}题)` : `Start ${subj} Mock (${syl.totalQuestions} Qs)`}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'progress' && (
              <ProgressDashboard
                userProgress={userProgress}
                lang={lang}
                onReviewPastSession={(sess) => setCompletedSessionToReview(sess)}
                onUpdateProgress={setUserProgress}
                onNavigateToPractice={() => setCurrentTab('hub')}
              />
            )}

            {currentTab === 'syllabus' && (
              <SyllabusExplorer
                lang={lang}
                onLaunchTopicPractice={(subj, moduleTitle) => {
                  handleStartQuiz('topic', subj, { moduleTitle, count: 5 });
                }}
              />
            )}

            {currentTab === 'ai-tutor' && (
              <AiGeneratorTutor
                lang={lang}
                onStartCustomQuiz={(qs, subj) => handleStartCustomQuiz(qs, subj)}
              />
            )}

            {currentTab === 'mistakes' && (
              <MistakeNotebook
                userProgress={userProgress}
                lang={lang}
                onUpdateProgress={setUserProgress}
                onLaunchMistakeQuiz={(qs) => handleStartCustomQuiz(qs, 'Mathematics')}
              />
            )}
          </>
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#0a192f] text-slate-400 text-xs py-8 border-t border-[#162e4c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <CscaLogo size="sm" />
            <div>
              <div className="font-semibold text-slate-200">
                China Scholastic Competency Assessment (CSCA) Practice & Progress System
              </div>
              <div className="text-[11px] text-slate-500">
                Official 2025 Edition Syllabus Standard · 国家留学基金管理委员会标准测试系统
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <span>Chemistry: 48 Qs / 60 Min</span>
            <span>·</span>
            <span>Mathematics: 48 Qs / 60 Min</span>
            <span>·</span>
            <span>Physics: 48 Qs / 60 Min</span>
            <span>·</span>
            <span>Professional Chinese: 80 Qs / 90 Min</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

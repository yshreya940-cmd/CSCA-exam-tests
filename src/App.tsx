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
import { OFFICIAL_QUESTION_BANK, OFFICIAL_EXAM_PAPERS } from './data/questionBank';
import { OFFICIAL_SYLLABI } from './data/syllabusData';
import { CscaLogo } from './components/CscaLogo';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('hub');
  const [userProgress, setUserProgress] = useState<UserProgress>(loadUserProgress());

  // Active quiz state
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [completedSessionToReview, setCompletedSessionToReview] = useState<QuizSession | null>(null);
  const [mockViewMode, setMockViewMode] = useState<'past_papers' | 'subjects'>('past_papers');
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

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
    options?: { moduleTitle?: string; count?: number; timeLimit?: number; examPaper?: string }
  ) => {
    // Collect questions
    let candidates = [...OFFICIAL_QUESTION_BANK];

    if (options?.examPaper) {
      candidates = candidates.filter((q) => q.examPaper === options.examPaper);
      if (subject !== 'All') {
        const bySubject = candidates.filter((q) => q.subject === subject);
        if (bySubject.length > 0) candidates = bySubject;
      }
    } else {
      if (subject !== 'All') {
        candidates = candidates.filter((q) => q.subject === subject);
      }

      if (options?.moduleTitle) {
        candidates = candidates.filter((q) => q.module.toLowerCase().includes(options.moduleTitle!.toLowerCase()));
        if (candidates.length === 0 && subject !== 'All') {
          candidates = OFFICIAL_QUESTION_BANK.filter((q) => q.subject === subject);
        }
      }
    }

    let finalQuestions: Question[] = [];

    // If an official past paper is selected, preserve the authentic question number ordering
    if (options?.examPaper && candidates.length > 0) {
      finalQuestions = [...candidates].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
    } else {
      // Shuffle questions for randomized practice drills
      const shuffled = [...candidates].sort(() => 0.5 - Math.random());
      const isChinese = subject === 'Professional Chinese' || subject === 'Science Chinese' || subject === 'Humanities Chinese';
      const targetCount = options?.count || (mode === 'mock' ? (isChinese ? 80 : 48) : 5);
      
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
    }

    // Duration calculation
    let timeLimit = options?.timeLimit;
    if (timeLimit === undefined) {
      if (mode === 'mock' || mode === 'past_paper') {
        const isChinese = subject === 'Professional Chinese' || subject === 'Science Chinese' || subject === 'Humanities Chinese';
        timeLimit = isChinese ? 5400 : 3600; // 90 or 60 min
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
      examPaper: options?.examPaper,
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
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                        Official CSCA Examination System
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                        {lang === 'zh' ? 'CSCA 全真真题与模拟考场' : 'CSCA Real Past Papers & Mock Examination'}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {lang === 'zh' 
                          ? '严格模拟真实考场倒计时（60/90分钟）、单选题答题卡、100分制计分，涵盖2026全真试卷与标准大纲。'
                          : 'Official timed CBT environment (60/90 min countdown), answer sheet, and 100-point scale for 2026 real papers.'}
                      </p>
                    </div>

                    {/* Sub-navigation pill toggle */}
                    <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      <button
                        onClick={() => setMockViewMode('past_papers')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          mockViewMode === 'past_papers'
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'zh' ? '历年全真真题 (Past Papers)' : 'Real Past Papers'}
                      </button>
                      <button
                        onClick={() => setMockViewMode('subjects')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          mockViewMode === 'subjects'
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'zh' ? '按学科模考 (Subject Mocks)' : 'Subject Mocks'}
                      </button>
                    </div>
                  </div>

                  {/* VIEW 1: Official Past Papers */}
                  {mockViewMode === 'past_papers' && (
                    <div className="space-y-6 mt-8">
                      {/* Filter Controls Bar */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        {/* Session filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {lang === 'zh' ? '考期筛选:' : 'Session:'}
                          </span>
                          {['All', 'Jan 2026', 'Mar 2026', 'Apr 2026'].map((sess) => (
                            <button
                              key={sess}
                              onClick={() => setSelectedSessionFilter(sess)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                selectedSessionFilter === sess
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {sess === 'All' ? (lang === 'zh' ? '全部考期' : 'All Sessions') : sess}
                            </button>
                          ))}
                        </div>

                        {/* Subject filter */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {lang === 'zh' ? '学科:' : 'Subject:'}
                          </span>
                          {['All', 'Mathematics', 'Physics', 'Chemistry', 'Science Chinese', 'Humanities Chinese'].map((subj) => (
                            <button
                              key={subj}
                              onClick={() => setSelectedSubjectFilter(subj)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                selectedSubjectFilter === subj
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              {subj === 'All' ? (lang === 'zh' ? '全部科目' : 'All') : subj}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-800">
                          {lang === 'zh' ? '2026 官方全真考试卷（中英双语 / 官方答案与详尽推导）' : 'Official CSCA Past Examination Papers (Bilingual & Solutions)'}
                        </div>
                        <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                          {OFFICIAL_EXAM_PAPERS.filter((p) => {
                            const sessMatch = selectedSessionFilter === 'All' || p.sessionMonth === selectedSessionFilter;
                            const subjMatch = selectedSubjectFilter === 'All' || p.subject === selectedSubjectFilter;
                            return sessMatch && subjMatch;
                          }).length} {lang === 'zh' ? '套真题符合条件' : 'Papers Matched'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {OFFICIAL_EXAM_PAPERS
                          .filter((paper) => {
                            const sessMatch = selectedSessionFilter === 'All' || paper.sessionMonth === selectedSessionFilter;
                            const subjMatch = selectedSubjectFilter === 'All' || paper.subject === selectedSubjectFilter;
                            return sessMatch && subjMatch;
                          })
                          .map((paper) => (
                            <div 
                              key={paper.id} 
                              className="p-6 rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between bg-white group"
                            >
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                                      {paper.subject}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                                      {paper.sessionMonth}
                                    </span>
                                  </div>
                                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap flex-shrink-0">
                                    {paper.durationMinutes} min · {paper.totalQuestions} Qs
                                  </span>
                                </div>

                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                  {lang === 'zh' ? paper.nameZh : paper.nameEn}
                                </h3>

                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {lang === 'zh' ? paper.descriptionZh : paper.descriptionEn}
                                </p>
                              </div>

                              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-mono text-slate-400">
                                  Official Key Verified
                                </span>
                                <button
                                  onClick={() => handleStartQuiz('past_paper', paper.subject as any, { 
                                    examPaper: paper.examPaperTag, 
                                    count: paper.totalQuestions, 
                                    timeLimit: paper.durationMinutes * 60 
                                  })}
                                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                                >
                                  <span>{lang === 'zh' ? '开始全真模考' : 'Start Real Exam'}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: Subject Practice Mocks */}
                  {mockViewMode === 'subjects' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                      {(['Mathematics', 'Physics', 'Chemistry', 'Science Chinese', 'Humanities Chinese'] as Subject[]).map((subj) => {
                        const syl = OFFICIAL_SYLLABI[subj] || OFFICIAL_SYLLABI['Mathematics'];
                        const subjImages: Record<string, string> = {
                          Mathematics: '/src/assets/images/math_card_banner_1791957939868.jpg',
                          Physics: '/src/assets/images/physics_card_banner_1791957940677.jpg',
                          Chemistry: '/src/assets/images/chemistry_card_banner_1791957942918.jpg',
                          'Science Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
                          'Humanities Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
                          'Professional Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
                        };

                        return (
                          <div key={subj} className="rounded-3xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all flex flex-col justify-between bg-white overflow-hidden group">
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={subjImages[subj] || subjImages.Mathematics}
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
                  )}
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

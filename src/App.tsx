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
import { OFFICIAL_QUESTION_BANK, OFFICIAL_EXAM_PAPERS, OFFICIAL_MOCK_EXAM_PAPERS } from './data/questionBank';
import { OFFICIAL_SYLLABI } from './data/syllabusData';
import { CscaLogo } from './components/CscaLogo';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('hub');
  const [userProgress, setUserProgress] = useState<UserProgress>(loadUserProgress());

  // Active quiz state
  const [activeSession, setActiveSession] = useState<QuizSession | null>(null);
  const [completedSessionToReview, setCompletedSessionToReview] = useState<QuizSession | null>(null);
  const [mockViewMode, setMockViewMode] = useState<'past_papers' | 'mock_tracks' | 'subjects'>('past_papers');
  const [selectedSessionFilter, setSelectedSessionFilter] = useState<string>('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<'All' | 'Science' | 'Humanities'>('All');

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
   * Start a new Quiz Session (Real exam papers with exact factual question order 1..N)
   */
  const handleStartQuiz = (
    mode: QuizMode,
    subject: Subject | 'All',
    options?: { moduleTitle?: string; count?: number; timeLimit?: number; examPaper?: string; paperId?: string }
  ) => {
    let finalQuestions: Question[] = [];
    let sessionExamPaperName = options?.examPaper;
    let sessionPaperId = options?.paperId;

    // 1. If paperId is passed, locate the exact paper and fetch all its authentic questions in factual order
    if (options?.paperId) {
      const targetPaper = OFFICIAL_EXAM_PAPERS.find((p) => p.id === options.paperId)
        || OFFICIAL_MOCK_EXAM_PAPERS.find((p) => p.id === options.paperId);
      if (targetPaper) {
        const matching = OFFICIAL_QUESTION_BANK.filter(
          (q) => q.examPaper === targetPaper.examPaperTag && q.subject === targetPaper.subject
        );
        finalQuestions = [...matching].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
        sessionExamPaperName = lang === 'zh' ? targetPaper.nameZh : targetPaper.nameEn;
        sessionPaperId = targetPaper.id;
      }
    }

    // 2. If options.examPaper tag is passed
    if (finalQuestions.length === 0 && options?.examPaper) {
      let candidates = OFFICIAL_QUESTION_BANK.filter((q) => q.examPaper === options.examPaper);
      if (subject !== 'All') {
        const bySubject = candidates.filter((q) => q.subject === subject);
        if (bySubject.length > 0) candidates = bySubject;
      }
      finalQuestions = [...candidates].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
      const targetPaper = OFFICIAL_EXAM_PAPERS.find((p) => p.examPaperTag === options.examPaper && (subject === 'All' || p.subject === subject))
        || OFFICIAL_MOCK_EXAM_PAPERS.find((p) => p.examPaperTag === options.examPaper && (subject === 'All' || p.subject === subject));
      if (targetPaper) {
        sessionPaperId = targetPaper.id;
        sessionExamPaperName = lang === 'zh' ? targetPaper.nameZh : targetPaper.nameEn;
      }
    }

    // 3. User directive: "I want the real exam papers with the fact order of questions to replace the official past papers. the questions should be the same!"
    // If starting a mock or past paper without a specific paper selected, default to the real official exam paper in factual 1..N order!
    if (finalQuestions.length === 0 && (mode === 'mock' || mode === 'past_paper') && subject !== 'All') {
      const realPaper = OFFICIAL_EXAM_PAPERS.find((p) => p.subject === subject && p.sessionMonth === 'Apr 2026')
        || OFFICIAL_EXAM_PAPERS.find((p) => p.subject === subject && p.sessionMonth === 'Mar 2026')
        || OFFICIAL_EXAM_PAPERS.find((p) => p.subject === subject);
      if (realPaper) {
        const matching = OFFICIAL_QUESTION_BANK.filter(
          (q) => q.examPaper === realPaper.examPaperTag && q.subject === realPaper.subject
        );
        finalQuestions = [...matching].sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
        sessionExamPaperName = lang === 'zh' ? realPaper.nameZh : realPaper.nameEn;
        sessionPaperId = realPaper.id;
      }
    }

    // 4. Fallback for random topic drills
    if (finalQuestions.length === 0) {
      let candidates = [...OFFICIAL_QUESTION_BANK];
      if (subject !== 'All') {
        candidates = candidates.filter((q) => q.subject === subject);
      }
      if (options?.moduleTitle) {
        const byModule = candidates.filter((q) => q.module.toLowerCase().includes(options.moduleTitle!.toLowerCase()));
        if (byModule.length > 0) candidates = byModule;
      }
      const shuffled = [...candidates].sort(() => 0.5 - Math.random());
      const isChinese = subject === 'Professional Chinese' || subject === 'Science Chinese' || subject === 'Humanities Chinese';
      const targetCount = options?.count || (mode === 'mock' ? (isChinese ? 80 : 48) : 5);
      finalQuestions = shuffled.slice(0, targetCount);
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
      examPaper: sessionExamPaperName || options?.examPaper,
      paperId: sessionPaperId,
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
    <div className="min-h-screen bg-[#f3f9f5] text-slate-900 flex flex-col font-sans">
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
        onSearch={(query) => {
          const q = query.toLowerCase().trim();
          if (!q) return;
          if (q.includes('math') || q.includes('数')) {
            setSelectedSubjectFilter('Mathematics');
          } else if (q.includes('phys') || q.includes('物')) {
            setSelectedSubjectFilter('Physics');
          } else if (q.includes('chem') || q.includes('化')) {
            setSelectedSubjectFilter('Chemistry');
          } else if (q.includes('chin') || q.includes('汉') || q.includes('文')) {
            setSelectedSubjectFilter('Professional Chinese');
          }
          if (q.includes('2025') || q.includes('dec')) {
            setSelectedSessionFilter('Dec 2025');
          } else if (q.includes('jan')) {
            setSelectedSessionFilter('Jan 2026');
          } else if (q.includes('mar')) {
            setSelectedSessionFilter('Mar 2026');
          } else if (q.includes('apr')) {
            setSelectedSessionFilter('Apr 2026');
          }
          setCurrentTab('mock');
          setMockViewMode('past_papers');
        }}
      />

      {/* Main Workspace Body - Full-bleed / zero margin for Dashboard */}
      <main className={`flex-1 w-full ${currentTab === 'hub' && !activeSession && !completedSessionToReview ? 'w-full px-0 pt-0 pb-16' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20'}`}>
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
                { 
                  paperId: completedSessionToReview.paperId,
                  examPaper: completedSessionToReview.examPaper,
                  moduleTitle: completedSessionToReview.moduleTitle,
                  count: completedSessionToReview.questions.length,
                  timeLimit: completedSessionToReview.timeLimitSeconds,
                }
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
                  setCurrentTab(tab);
                }}
              />
            )}

            {currentTab === 'mock' && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-[#d8f3dc]">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e8f5e9] pb-5">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f]">
                        CSCA by Apply for China · CSCA Examination Portal
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-[#143828] mt-1">
                        {lang === 'zh' ? 'CSCA 全真真题与模拟考场' : 'CSCA Real Past Papers & Mock Examination'}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {lang === 'zh' 
                          ? '严格模拟真实考场倒计时（60/90分钟）、单选题答题卡、100分制计分，涵盖历年全真试卷与标准大纲。'
                          : 'Official timed CBT environment (60/90 min countdown), answer sheet, and 100-point scale for official real papers.'}
                      </p>
                    </div>

                    {/* Sub-navigation segmented control */}
                    <div className="flex items-center bg-[#f0f9f4] p-1 rounded-lg border border-[#cbe8d8] flex-wrap gap-1">
                      <button
                        onClick={() => setMockViewMode('past_papers')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          mockViewMode === 'past_papers'
                            ? 'bg-white text-[#2d6a4f] shadow-xs'
                            : 'text-slate-600 hover:text-[#1b4332]'
                        }`}
                      >
                        {lang === 'zh' ? '历年全真真题 (20套真题)' : 'Official Past Papers (20 Papers)'}
                      </button>
                      <button
                        onClick={() => setMockViewMode('mock_tracks')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          mockViewMode === 'mock_tracks'
                            ? 'bg-white text-[#2d6a4f] shadow-xs'
                            : 'text-slate-600 hover:text-[#1b4332]'
                        }`}
                      >
                        {lang === 'zh' ? '3套全真模拟冲刺卷 (文理双轨)' : '3-Set Mock Exams (Tracks)'}
                      </button>
                      <button
                        onClick={() => setMockViewMode('subjects')}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          mockViewMode === 'subjects'
                            ? 'bg-white text-[#2d6a4f] shadow-xs'
                            : 'text-slate-600 hover:text-[#1b4332]'
                        }`}
                      >
                        {lang === 'zh' ? '按学科模考' : 'Subject Mocks'}
                      </button>
                    </div>
                  </div>

                  {/* VIEW 1: Official Past Papers */}
                  {mockViewMode === 'past_papers' && (
                    <div className="space-y-6 mt-8">
                      {/* Filter Controls Bar */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f7fbf8] p-4 rounded-2xl border border-[#d8f3dc]">
                        {/* Session filter */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#40916c] uppercase tracking-wider">
                            {lang === 'zh' ? '考期筛选:' : 'Session:'}
                          </span>
                          {['All', 'Dec 2025', 'Jan 2026', 'Mar 2026', 'Apr 2026'].map((sess) => (
                            <button
                              key={sess}
                              onClick={() => setSelectedSessionFilter(sess)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                selectedSessionFilter === sess
                                  ? 'bg-[#2d6a4f] text-white shadow-xs'
                                  : 'bg-white text-slate-700 hover:bg-[#ecfdf5] border border-[#d8f3dc]'
                              }`}
                            >
                              {sess === 'All' 
                                ? (lang === 'zh' ? '全部考期 (20套)' : 'All Sessions (20)') 
                                : sess === 'Dec 2025'
                                ? (lang === 'zh' ? '2025年12月 (5套)' : 'Dec 2025 (5)')
                                : sess === 'Jan 2026'
                                ? (lang === 'zh' ? '2026年1月 (5套)' : 'Jan 2026 (5)')
                                : sess === 'Mar 2026'
                                ? (lang === 'zh' ? '2026年3月 (5套)' : 'Mar 2026 (5)')
                                : (lang === 'zh' ? '2026年4月 (5套)' : 'Apr 2026 (5)')
                              }
                            </button>
                          ))}
                        </div>

                        {/* Subject filter */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-[#40916c] uppercase tracking-wider">
                            {lang === 'zh' ? '学科:' : 'Subject:'}
                          </span>
                          {['All', 'Mathematics', 'Physics', 'Chemistry', 'Science Chinese', 'Humanities Chinese'].map((subj) => (
                            <button
                              key={subj}
                              onClick={() => setSelectedSubjectFilter(subj)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                selectedSubjectFilter === subj
                                  ? 'bg-[#1b4332] text-white'
                                  : 'bg-white text-slate-600 hover:bg-[#ecfdf5] border border-[#d8f3dc]'
                              }`}
                            >
                              {subj === 'All' ? (lang === 'zh' ? '全部科目' : 'All') : subj}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-[#143828]">
                          {lang === 'zh' ? 'CSCA 官方全真考试卷（中英双语 / 官方答案与详尽推导）' : 'Official CSCA Past Examination Papers (Bilingual & Solutions)'}
                        </div>
                        <span className="text-xs text-[#2d6a4f] font-semibold bg-[#eaf5ee] px-2.5 py-1 rounded-lg border border-[#b7e4c7]">
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
                              className="p-6 rounded-3xl border border-[#d8f3dc] hover:border-[#52b788] hover:shadow-md transition-all flex flex-col justify-between bg-white group"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                                  <div className="flex items-center gap-1.5 font-semibold text-[#2d6a4f]">
                                    <span>{paper.subject}</span>
                                    <span aria-hidden="true" className="text-slate-300">·</span>
                                    <span className="text-slate-600 font-normal">{paper.sessionMonth}</span>
                                  </div>
                                  <span className="font-mono text-slate-500">
                                    {paper.durationMinutes} min · {paper.totalQuestions} Qs
                                  </span>
                                </div>

                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#2d6a4f] transition-colors">
                                  {lang === 'zh' ? paper.nameZh : paper.nameEn}
                                </h3>
                              </div>

                              <div className="mt-5 pt-4 border-t border-[#e8f5e9] flex items-center justify-end">
                                <button
                                  onClick={() => handleStartQuiz('past_paper', paper.subject as any, { 
                                    paperId: paper.id,
                                    examPaper: paper.examPaperTag, 
                                    count: paper.totalQuestions, 
                                    timeLimit: paper.durationMinutes * 60 
                                  })}
                                  className="w-full sm:w-auto px-5 py-2.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                                >
                                  <span>{lang === 'zh' ? '开始全真模考' : 'Start Real Exam'}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: 3-Set Mock Exams for Humanities & Sciences Tracks */}
                  {mockViewMode === 'mock_tracks' && (
                    <div className="space-y-6 mt-8">
                      {/* Filter Controls Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f7fbf8] p-4 rounded-2xl border border-[#d8f3dc]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#40916c] uppercase tracking-wider">
                            {lang === 'zh' ? '学科方向 (Track):' : 'Track Filter:'}
                          </span>
                          {(['All', 'Science', 'Humanities'] as const).map((trk) => (
                            <button
                              key={trk}
                              onClick={() => setSelectedTrackFilter(trk)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                selectedTrackFilter === trk
                                  ? 'bg-[#2d6a4f] text-white shadow-xs'
                                  : 'bg-white text-slate-700 hover:bg-[#ecfdf5] border border-[#d8f3dc]'
                              }`}
                            >
                              {trk === 'All' 
                                ? (lang === 'zh' ? '全部模拟试卷 (6套)' : 'All Mock Sets (6)')
                                : trk === 'Science'
                                ? (lang === 'zh' ? '理科中文方向 (3套冲刺卷)' : 'Sciences Track (3 Sets)')
                                : (lang === 'zh' ? '文科中文方向 (3套冲刺卷)' : 'Humanities Track (3 Sets)')
                              }
                            </button>
                          ))}
                        </div>

                        <div className="text-xs font-medium text-[#40916c]">
                          {lang === 'zh' ? 'CSC CSCA 官方大纲全真标准 · 80题/90分钟' : 'Official CSC CSCA CBT Standard · 80 Qs / 90 Mins'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {OFFICIAL_MOCK_EXAM_PAPERS
                          .filter((paper) => selectedTrackFilter === 'All' || paper.track === selectedTrackFilter)
                          .map((paper) => (
                            <div 
                              key={paper.id} 
                              className="p-6 rounded-3xl border border-[#d8f3dc] hover:border-[#52b788] hover:shadow-md transition-all flex flex-col justify-between bg-white group"
                            >
                              <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 font-medium">
                                  <div className="flex items-center gap-1.5 font-semibold text-[#2d6a4f]">
                                    <span>
                                      {paper.track === 'Science' 
                                        ? (lang === 'zh' ? '理科中文' : 'Sciences Track') 
                                        : (lang === 'zh' ? '文科中文' : 'Humanities Track')}
                                    </span>
                                    <span aria-hidden="true" className="text-slate-300">·</span>
                                    <span className="text-slate-600 font-normal">
                                      {lang === 'zh' ? `第 ${paper.mockSetIndex} 套` : `Set ${paper.mockSetIndex}`}
                                    </span>
                                  </div>
                                  <span className="font-mono text-slate-500">
                                    {paper.durationMinutes}m · {paper.totalQuestions}Q
                                  </span>
                                </div>

                                <h3 className="font-bold text-slate-900 text-base group-hover:text-[#2d6a4f] transition-colors">
                                  {lang === 'zh' ? paper.nameZh : paper.nameEn}
                                </h3>


                                <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                                  <div className="font-semibold text-[#143828]">
                                    {lang === 'zh' ? '涵盖大纲六大完整模块:' : 'Covers All 6 Syllabus Modules:'}
                                  </div>
                                  <div className="text-slate-500">
                                    {lang === 'zh' 
                                      ? '识解汉字 (Q1-10) · 选词填空 (Q11-25) · 辨析词语 (Q26-33) · 选词成段 (Q34-48) · 补全语句 (Q49-70) · 学术阅读 (Q71-80)'
                                      : 'Characters (Q1-10) · Word Choice (Q11-25) · Term Discrimination (Q26-33) · Paragraph (Q34-48) · Syntax (Q49-70) · Reading (Q71-80)'
                                    }
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6 pt-4 border-t border-[#e8f5e9] flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[#2d6a4f] font-semibold bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
                                  CBT Ready
                                </span>
                                <button
                                  onClick={() => handleStartQuiz('mock', paper.subject as any, { 
                                    paperId: paper.id,
                                    examPaper: paper.examPaperTag, 
                                    count: paper.totalQuestions, 
                                    timeLimit: paper.durationMinutes * 60 
                                  })}
                                  className="px-4 py-2 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-98"
                                >
                                  <span>{lang === 'zh' ? '开始全真模考' : 'Start Mock Exam'}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* VIEW 3: Subject Practice Mocks - Real Exam Papers in Factual Order */}
                  {mockViewMode === 'subjects' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                      {(['Mathematics', 'Physics', 'Chemistry', 'Science Chinese', 'Humanities Chinese'] as Subject[]).map((subj) => {
                        const syl = OFFICIAL_SYLLABI[subj] || OFFICIAL_SYLLABI['Mathematics'];
                        const subjPapers = OFFICIAL_EXAM_PAPERS.filter((p) => p.subject === subj);
                        const subjImages: Record<string, string> = {
                          Mathematics: '/src/assets/images/math_card_banner_1791957939868.jpg',
                          Physics: '/src/assets/images/physics_card_banner_1791957940677.jpg',
                          Chemistry: '/src/assets/images/chemistry_card_banner_1791957942918.jpg',
                          'Science Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
                          'Humanities Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
                          'Professional Chinese': '/src/assets/images/chinese_card_banner_1791957941308.jpg',
                        };

                        return (
                          <div key={subj} className="rounded-3xl border border-[#d8f3dc] hover:border-[#52b788] hover:shadow-md transition-all flex flex-col justify-between bg-white overflow-hidden group">
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={subjImages[subj] || subjImages.Mathematics}
                                alt={subj}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0e241b]/85 via-[#0e241b]/30 to-transparent"></div>
                              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                                <h3 className="font-bold text-white text-lg">{subj}</h3>
                                <span className="text-xs font-mono font-bold bg-white/90 text-[#143828] px-2.5 py-0.5 rounded-lg shadow-sm">
                                  {syl.durationMinutes} min · {syl.totalQuestions} Qs
                                </span>
                              </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {lang === 'zh' ? syl.purposeZh : syl.purposeEn}
                              </p>

                              {/* Real Exam Papers by Session in Factual Order */}
                              <div className="space-y-2 pt-1 border-t border-[#e8f5e9]">
                                <div className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
                                  <span>{lang === 'zh' ? '真题原卷（严格原题序号1..N）:' : 'Real Exam Papers (Factual Order 1..N):'}</span>
                                  <span className="text-[#2d6a4f] font-mono text-[10px]">{subjPapers.length} {lang === 'zh' ? '套试卷' : 'Papers'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {subjPapers.map((p) => (
                                    <button
                                      key={p.id}
                                      onClick={() => handleStartQuiz('past_paper', subj, { 
                                        paperId: p.id,
                                        examPaper: p.examPaperTag, 
                                        count: p.totalQuestions, 
                                        timeLimit: p.durationMinutes * 60 
                                      })}
                                      className="p-2 rounded-xl bg-[#f7fbf8] hover:bg-[#ecfdf5] border border-[#d8f3dc] hover:border-[#74c69d] text-left transition-all group/btn cursor-pointer"
                                    >
                                      <div className="text-xs font-bold text-slate-800 group-hover/btn:text-[#2d6a4f]">
                                        {p.sessionMonth}
                                      </div>
                                      <div className="text-[10px] text-slate-500 font-mono">
                                        {p.totalQuestions}题 · 原卷顺序
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  const latestPaper = subjPapers[0];
                                  handleStartQuiz('past_paper', subj, { 
                                    paperId: latestPaper?.id,
                                    examPaper: latestPaper?.examPaperTag, 
                                    count: syl.totalQuestions, 
                                    timeLimit: syl.durationMinutes * 60 
                                  });
                                }}
                                className="w-full py-3 bg-[#2d6a4f] hover:bg-[#1b4332] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                              >
                                <span>{lang === 'zh' ? `开始 ${subj} 全真真题模考 (原题顺序)` : `Start ${subj} Real Exam (Factual Order)`}</span>
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

      {/* CSCA by Apply for China Global Footer - Deep Evergreen & Pastel Mint */}
      <footer className="bg-[#122e22] text-[#d8f3dc] text-xs pt-12 pb-8 border-t border-[#0b1f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl font-black tracking-tight text-white font-sans">
                  CSCA
                </span>
                <span className="text-[#52b788] font-light text-xl">|</span>
                <span className="text-xs sm:text-sm font-bold tracking-tight text-[#b7e4c7] leading-none">
                  by Apply for China
                </span>
              </div>
              <p className="text-[#a7f3d0]/80 text-xs leading-relaxed">
                {lang === 'zh'
                  ? 'CSCA by Apply for China 与国家留学基金管理委员会 (CSC) 联合官方指定 CSCA 全真备考与机考模拟系统。'
                  : 'CSCA by Apply for China official partnership with China Scholarship Council (CSC) for CSCA examination preparation.'}
              </p>
              <div className="text-[11px] text-[#74c69d]">
                {lang === 'zh' ? '支持中英双语 · 真实原卷原序' : '100% Fact Question Sequence'}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-sm text-white uppercase tracking-wider mb-2">
                {lang === 'zh' ? '官方考试科目' : 'Official Subjects'}
              </div>
              <ul className="space-y-1.5 text-[#b7e4c7]/85">
                <li><button onClick={() => { setActiveSession(null); setCompletedSessionToReview(null); setCurrentTab('hub'); }} className="hover:text-white transition-colors cursor-pointer">Mathematics (高等数学)</button></li>
                <li><button onClick={() => { setActiveSession(null); setCompletedSessionToReview(null); setCurrentTab('hub'); }} className="hover:text-white transition-colors cursor-pointer">Physics (大学物理)</button></li>
                <li><button onClick={() => { setActiveSession(null); setCompletedSessionToReview(null); setCurrentTab('hub'); }} className="hover:text-white transition-colors cursor-pointer">Chemistry (基础化学)</button></li>
                <li><button onClick={() => { setActiveSession(null); setCompletedSessionToReview(null); setCurrentTab('hub'); }} className="hover:text-white transition-colors cursor-pointer">Professional Chinese (专业汉语)</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-sm text-white uppercase tracking-wider mb-2">
                {lang === 'zh' ? '学习与测试' : 'Learning & Testing'}
              </div>
              <ul className="space-y-1.5 text-[#b7e4c7]/85">
                <li><button onClick={() => { setActiveSession(null); setCompletedSessionToReview(null); setCurrentTab('mock'); }} className="hover:text-white transition-colors cursor-pointer">{lang === 'zh' ? '历年官方真题 (20套)' : 'Official Past Papers (20 Sets)'}</button></li>
                <li><button onClick={() => { setActiveSession(null); setCompletedSessionToReview(null); setCurrentTab('mock'); setMockViewMode('mock_tracks'); }} className="hover:text-white transition-colors cursor-pointer">{lang === 'zh' ? '全真模拟冲刺卷 (3套)' : '3-Set Timed Mock Exams'}</button></li>
                <li><button onClick={() => { setActiveSession(null); setCompletedSessionToReview(null); setCurrentTab('syllabus'); }} className="hover:text-white transition-colors cursor-pointer">{lang === 'zh' ? '2025 官方考试大纲' : '2025 Official Syllabus'}</button></li>
                <li><button onClick={() => { setActiveSession(null); setCompletedSessionToReview(null); setCurrentTab('mistakes'); }} className="hover:text-white transition-colors cursor-pointer">{lang === 'zh' ? '个人错题本' : 'Personal Mistake Book'}</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-sm text-white uppercase tracking-wider mb-2">
                {lang === 'zh' ? '招生与奖学金标准' : 'CSC Standards & Notice'}
              </div>
              <ul className="space-y-1.5 text-[#a7f3d0]/80 text-[11px] leading-relaxed">
                <li>• {lang === 'zh' ? '中国政府奖学金 (CGS) 本科入学必备' : 'China Scholarship Council (CSC) Standard'}</li>
                <li>• {lang === 'zh' ? '远程在线双机位监考机考 (CBT)' : 'Online CBT Remote Dual-Camera Proctoring'}</li>
                <li>• {lang === 'zh' ? '100分制官方标准考分换算' : '100-Point Official CBT Scoring Scale'}</li>
                <li>• {lang === 'zh' ? '单科 450 元 / 两科及以上 700 元' : 'Official CBT Registration Guidelines'}</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#1f4836] flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-[#74c69d]">
            <div>
              © 2026 CSCA by Apply for China & China Scholarship Council. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[#b7e4c7]/80">
              <span>Chemistry: 48 Qs / 60 Min</span>
              <span>·</span>
              <span>Mathematics: 48 Qs / 60 Min</span>
              <span>·</span>
              <span>Physics: 48 Qs / 60 Min</span>
              <span>·</span>
              <span>Professional Chinese: 80 Qs / 90 Min</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

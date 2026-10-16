import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  HelpCircle, 
  Sparkles, 
  Send, 
  X, 
  Check,
  AlertCircle,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { QuizSession, Language, Question } from '../types/csca';

interface ExamInterfaceProps {
  session: QuizSession;
  lang: Language;
  onUpdateSession: (session: QuizSession) => void;
  onSubmitExam: (session: QuizSession) => void;
  onExitExam: () => void;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({
  session,
  lang,
  onUpdateSession,
  onSubmitExam,
  onExitExam,
}) => {
  const isZh = lang === 'zh';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    session.timeLimitSeconds > 0
      ? Math.max(session.timeLimitSeconds - session.timeSpentSeconds, 0)
      : 0
  );
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // AI Tutor states
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');

  const currentQ: Question | undefined = session.questions[currentIndex];
  const isAnswered = session.userAnswers[currentIndex] !== undefined;
  const isFlagged = Boolean(session.flaggedQuestions[currentIndex]);

  // Timer countdown
  useEffect(() => {
    if (session.timeLimitSeconds === 0 || isPaused || session.isCompleted) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      onUpdateSession({
        ...session,
        timeSpentSeconds: session.timeSpentSeconds + 1,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isPaused]);

  const handleAutoSubmit = useCallback(() => {
    // Automatically submit when timer hits zero
    onSubmitExam(session);
  }, [session, onSubmitExam]);

  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex: number) => {
    const updatedAnswers = { ...session.userAnswers, [currentIndex]: optIndex };
    onUpdateSession({
      ...session,
      userAnswers: updatedAnswers,
    });
  };

  const handleClearOption = () => {
    const updatedAnswers = { ...session.userAnswers };
    delete updatedAnswers[currentIndex];
    onUpdateSession({
      ...session,
      userAnswers: updatedAnswers,
    });
  };

  const handleToggleFlag = () => {
    const updatedFlags = {
      ...session.flaggedQuestions,
      [currentIndex]: !session.flaggedQuestions[currentIndex],
    };
    onUpdateSession({
      ...session,
      flaggedQuestions: updatedFlags,
    });
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAiTutor || showSubmitModal || showExitModal) return;
      if (['a', 'A', '1'].includes(e.key)) handleSelectOption(0);
      else if (['b', 'B', '2'].includes(e.key)) handleSelectOption(1);
      else if (['c', 'C', '3'].includes(e.key)) handleSelectOption(2);
      else if (['d', 'D', '4'].includes(e.key)) handleSelectOption(3);
      else if (e.key === 'ArrowRight' && currentIndex < session.questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setShowExplanation(false);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        setShowExplanation(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, session.questions.length, showAiTutor, showSubmitModal, showExitModal]);

  // Request AI Tutor guidance
  const requestAiTutor = async (customQuestion?: string) => {
    if (!currentQ) return;
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const selectedOptIdx = session.userAnswers[currentIndex];
      const selectedText = selectedOptIdx !== undefined ? currentQ.optionsEn[selectedOptIdx] : 'None selected';
      const correctText = currentQ.optionsEn[currentQ.correctOption];

      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `${currentQ.questionEn} / ${currentQ.questionZh}`,
          selectedOption: selectedText,
          correctOption: correctText,
          subject: currentQ.subject,
          userQuery: customQuestion || userQuery,
        }),
      });

      const data = await res.json();
      if (data.success && data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation('Could not load AI explanation. Please check connection.');
      }
    } catch (err: any) {
      setAiExplanation('Error connecting to CSCA AI Tutor service: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const answeredCount = Object.keys(session.userAnswers).length;
  const flaggedCount = Object.values(session.flaggedQuestions).filter(Boolean).length;
  const unansweredCount = session.questions.length - answeredCount;

  if (!currentQ) {
    return (
      <div className="p-8 text-center text-slate-600">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
        <p>No questions found in this assessment session.</p>
        <button onClick={onExitExam} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Return to Hub
        </button>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];
  const isTimeCritical = timeRemaining > 0 && timeRemaining < 300; // less than 5 min

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8 lg:-mt-8">
      {/* Official CBT Top Test Header */}
      <div className="sticky top-0 z-30 bg-[#0c1f38] text-white border-b border-[#1b3456] px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white">
              {session.mode === 'mock' ? (isZh ? '全真模考' : 'Official Mock') : (isZh ? '考点练习' : 'Practice Drill')}
            </span>
            <div className="text-sm font-bold text-slate-100">
              {session.subject} {session.moduleTitle && `· ${session.moduleTitle}`}
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              [{currentIndex + 1} / {session.questions.length}]
            </span>
          </div>

          {/* Center Timer */}
          {session.timeLimitSeconds > 0 && (
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg font-mono font-bold text-sm border shadow-inner ${
              isTimeCritical
                ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse'
                : 'bg-slate-900/80 text-amber-300 border-slate-700'
            }`}>
              <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400' : 'text-amber-400'}`} />
              <span>{isZh ? '剩余时间: ' : 'Time Left: '}</span>
              <span className="text-base tracking-widest">{formatTime(timeRemaining)}</span>
              {session.mode !== 'mock' && (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="ml-2 text-xs text-slate-400 hover:text-white underline"
                >
                  {isPaused ? (isZh ? '继续' : 'Resume') : (isZh ? '暂停' : 'Pause')}
                </button>
              )}
            </div>
          )}

          {/* Action Header Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAiTutor(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>{isZh ? 'AI 考点解析' : 'AI Tutor'}</span>
            </button>

            <button
              onClick={() => setShowExitModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              {isZh ? '退出考试' : 'Exit'}
            </button>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isZh ? '交卷 (Submit)' : 'Submit Exam'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Examination Workspace */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col lg:flex-row gap-6">
        {/* Left: Question Card (70%) */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex-1 flex flex-col justify-between relative overflow-hidden">
            {/* Watermark styling */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center font-black text-6xl rotate-[-15deg] text-slate-900">
              CHINA SCHOLARSHIP COUNCIL CSCA
            </div>

            <div className="relative z-10 space-y-6">
              {/* Question Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {currentQ.module}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs font-medium text-slate-500">
                    {currentQ.subtopic}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                    2.08 {isZh ? '分' : 'pts'}
                  </span>
                  <button
                    onClick={handleToggleFlag}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      isFlagged
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'text-slate-500 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span>{isFlagged ? (isZh ? '已标记待复查' : 'Flagged') : (isZh ? '标记待复查' : 'Flag Question')}</span>
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  {currentQ.questionEn}
                </div>
                <div className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  {currentQ.questionZh}
                </div>
              </div>

              {/* Formula Callout if available */}
              {currentQ.formula && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-amber-700">
                    {isZh ? '参考公式 / 考点参量:' : 'Key Formula / Concept:'}
                  </span>
                  <code className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200 font-bold">
                    {currentQ.formula}
                  </code>
                </div>
              )}

              {/* Options A, B, C, D */}
              <div className="space-y-3 pt-2">
                {currentQ.optionsEn.map((optEn, optIdx) => {
                  const optZh = currentQ.optionsZh[optIdx];
                  const isSelected = session.userAnswers[currentIndex] === optIdx;
                  const letter = optionLetters[optIdx];

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`group cursor-pointer p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                          : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Radio Circle */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 text-slate-500 group-hover:border-slate-400'
                      }`}>
                        {letter}
                      </div>

                      {/* Option Content */}
                      <div className="flex-1 space-y-1">
                        <div className={`text-sm sm:text-base font-medium ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                          {optEn}
                        </div>
                        {optZh && optZh !== optEn && (
                          <div className={`text-xs ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                            {optZh}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* In Practice/Drill Mode: Instant Solution Preview */}
              {session.mode !== 'mock' && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>
                        {showExplanation 
                          ? (isZh ? '隐藏答案与解析' : 'Hide Solution & Explanation')
                          : (isZh ? '查看名师答案与详细解析' : 'Reveal Solution & Official Explanation')}
                      </span>
                    </button>

                    {isAnswered && (
                      <button
                        onClick={handleClearOption}
                        className="text-xs text-slate-400 hover:text-slate-600 underline"
                      >
                        {isZh ? '清除选择' : 'Clear Choice'}
                      </button>
                    )}
                  </div>

                  {showExplanation && (
                    <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs sm:text-sm space-y-2 text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {isZh ? '正确答案: ' : 'Correct Answer: '}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">
                          Option {optionLetters[currentQ.correctOption]}
                        </span>
                      </div>
                      <div className="pt-2 text-slate-700 leading-relaxed">
                        <div className="font-semibold text-slate-900 mb-1">
                          {isZh ? '解析说明 (Explanation):' : 'Explanation:'}
                        </div>
                        <p>{currentQ.explanationEn}</p>
                        <p className="mt-1 text-slate-600">{currentQ.explanationZh}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Question Navigation Toolbar */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => prev - 1);
                  setShowExplanation(false);
                }}
                className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  currentIndex === 0
                    ? 'text-slate-300 bg-slate-100 cursor-not-allowed'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isZh ? '上一题' : 'Previous'}</span>
              </button>

              <div className="text-xs text-slate-400">
                {isZh ? '快捷键: A/B/C/D 选答案, 左右键切题' : 'Shortcuts: A/B/C/D to select, ←/→ to navigate'}
              </div>

              {currentIndex < session.questions.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentIndex((prev) => prev + 1);
                    setShowExplanation(false);
                  }}
                  className="flex items-center space-x-1 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                >
                  <span>{isZh ? '下一题' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="flex items-center space-x-1 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{isZh ? '交卷核分' : 'Review & Submit'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Answer Sheet Palette (30%) */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-20 space-y-5">
            {/* Answer Sheet Title & Summary */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  {isZh ? '答题卡状态 (Answer Sheet)' : 'Answer Sheet'}
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  {answeredCount}/{session.questions.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${(answeredCount / session.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 border-y border-slate-100 py-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-blue-600"></span>
                <span>{isZh ? `已作答 (${answeredCount})` : `Done (${answeredCount})`}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-amber-400"></span>
                <span>{isZh ? `标记 (${flaggedCount})` : `Flag (${flaggedCount})`}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-slate-200"></span>
                <span>{isZh ? `未答 (${unansweredCount})` : `Left (${unansweredCount})`}</span>
              </div>
            </div>

            {/* 1..N Question Grid */}
            <div className="max-h-72 overflow-y-auto pr-1">
              <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-2">
                {session.questions.map((_, qIdx) => {
                  const isCurrent = currentIndex === qIdx;
                  const hasAnswered = session.userAnswers[qIdx] !== undefined;
                  const isQFlagged = Boolean(session.flaggedQuestions[qIdx]);

                  let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                  if (hasAnswered) {
                    btnStyle = 'bg-blue-600 text-white font-bold border-blue-600';
                  }
                  if (isQFlagged) {
                    btnStyle = 'bg-amber-400 text-amber-950 font-bold border-amber-500';
                  }

                  return (
                    <button
                      key={qIdx}
                      onClick={() => {
                        setCurrentIndex(qIdx);
                        setShowExplanation(false);
                      }}
                      className={`h-9 rounded-lg text-xs font-mono transition-all border flex items-center justify-center relative ${btnStyle} ${
                        isCurrent ? 'ring-2 ring-slate-900 ring-offset-2 scale-105' : ''
                      }`}
                    >
                      {qIdx + 1}
                      {isQFlagged && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isZh ? '确认交卷并生成评测报告' : 'Submit & Grade Exam'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {isZh ? '确认提交考试？' : 'Submit Examination?'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isZh ? '请仔细核对答题卡完成情况' : 'Please check your question completion'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-slate-500">{isZh ? '已作答' : 'Answered'}</div>
                <div className="text-base font-bold text-blue-600">{answeredCount}</div>
              </div>
              <div>
                <div className="text-slate-500">{isZh ? '未答题' : 'Unanswered'}</div>
                <div className={`text-base font-bold ${unansweredCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                  {unansweredCount}
                </div>
              </div>
              <div>
                <div className="text-slate-500">{isZh ? '待复查' : 'Flagged'}</div>
                <div className="text-base font-bold text-amber-600">{flaggedCount}</div>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-rose-600 font-medium">
                {isZh
                  ? `您还有 ${unansweredCount} 道题目未作答，未作答题目将按 0 分计入成绩。确定现在交卷吗？`
                  : `You have ${unansweredCount} unanswered question(s). Unanswered questions will receive 0 points.`}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                {isZh ? '继续答题' : 'Back to Test'}
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  onSubmitExam(session);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md"
              >
                {isZh ? '确认交卷' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Test Warning Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-slate-900">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {isZh ? '确定要退出当前考试吗？' : 'Quit Current Session?'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isZh ? '退出将不会保存本场未提交试卷' : 'Current unsubmitted answers will be discarded'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                {isZh ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={onExitExam}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                {isZh ? '确定退出' : 'Exit to Hub'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Tutor Drawer / Modal */}
      {showAiTutor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-purple-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isZh ? 'CSCA 智能名师答疑' : 'CSCA Master AI Tutor'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isZh ? '依据 2025 CSCA 大纲考点与高频易错陷阱深度拆解' : 'Powered by Gemini AI Fallback Protocol'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowAiTutor(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Explanation Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm text-slate-800">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">{isZh ? '当前题目: ' : 'Question: '}</span>
                <span className="text-slate-600">{currentQ.questionEn}</span>
              </div>

              {aiLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-500 font-medium">
                    {isZh ? '正在调用 CSCA 大纲模型生成名师解题思路...' : 'Consulting 2025 examination syllabus & generating pedagogy...'}
                  </p>
                </div>
              ) : aiExplanation ? (
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-2 whitespace-pre-line leading-relaxed text-slate-800">
                  {aiExplanation}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 space-y-3">
                  <p className="text-xs">
                    {isZh 
                      ? '您可以直接点击“生成考点详细解析”，或在下方输入您对这道题的具体疑惑（例如：“为什么不能选选项C？”）。'
                      : 'Ask for a step-by-step breakdown or specify which option confused you.'}
                  </p>
                  <button
                    onClick={() => requestAiTutor()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    {isZh ? '🚀 生成全套名师解题与避坑解析' : 'Generate Full Pedagogy Breakdown'}
                  </button>
                </div>
              )}
            </div>

            {/* User Custom Query Input */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={isZh ? '输入您的具体困惑（例如：为什么选B而不选C？）' : 'Ask specific question (e.g. Why is C a distractor?)'}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') requestAiTutor();
                }}
              />
              <button
                disabled={aiLoading}
                onClick={() => requestAiTutor()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isZh ? '提问' : 'Ask'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

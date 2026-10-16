import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  BookOpen, 
  ChevronRight, 
  ArrowLeft,
  BookmarkCheck,
  Check,
  X
} from 'lucide-react';
import { QuizSession, Language } from '../types/csca';

interface ExamResultModalProps {
  session: QuizSession;
  lang: Language;
  onRetake: () => void;
  onGoToHub: () => void;
  onGoToMistakes: () => void;
}

export const ExamResultModal: React.FC<ExamResultModalProps> = ({
  session,
  lang,
  onRetake,
  onGoToHub,
  onGoToMistakes,
}) => {
  const isZh = lang === 'zh';
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');

  const optionLetters = ['A', 'B', 'C', 'D'];

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs}s`;
  };

  // Determine tier
  let tier = {
    titleEn: 'Needs Reinforcement',
    titleZh: '需进一步强化基础',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    descEn: 'Review the detailed step-by-step solutions and practice topic drills before the official examination date.',
    descZh: '建议重点复习错题本考点，针对薄弱模块进行专项刷题。',
  };

  if (session.score >= 90) {
    tier = {
      titleEn: 'CSC High Distinction (Top Percentile)',
      titleZh: 'CSC 卓越竞争水平 (极高通过率)',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300',
      descEn: 'Outstanding result! You meet the highest standard for Chinese Government Scholarship admission.',
      descZh: '成绩优异！完全达到中国政府奖学金顶尖院校理科录取与面试豁免门槛。',
    };
  } else if (session.score >= 75) {
    tier = {
      titleEn: 'CSC Competitive Pass',
      titleZh: 'CSC 良好达标水平',
      color: 'text-blue-700 bg-blue-50 border-blue-300',
      descEn: 'Strong performance across core syllabus modules. Keep drilling to reach top tier.',
      descZh: '基础扎实，核心考点掌握良好，继续精进冲刺高分。',
    };
  } else if (session.score >= 60) {
    tier = {
      titleEn: 'Pass Standard',
      titleZh: '基本及格合格线',
      color: 'text-amber-700 bg-amber-50 border-amber-300',
      descEn: 'Passing grade, but review incorrect questions to guarantee admission competitiveness.',
      descZh: '达到基本合格线，但建议重点攻破错题以提高录取竞争力。',
    };
  }

  const filteredQuestions = session.questions.map((q, idx) => ({ q, idx })).filter(({ q, idx }) => {
    const userAns = session.userAnswers[idx];
    const isCorrect = userAns === q.correctOption;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Banner & Grade Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
              {isZh ? '考试成绩评估报告' : 'Assessment Score Report'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {session.subject} · {isZh ? '全真评测完成' : 'Completed'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isZh ? '交卷时间: ' : 'Submitted: '}{new Date(session.completedAt || Date.now()).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRetake}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isZh ? '重新测试' : 'Retake Test'}</span>
            </button>
            <button
              onClick={onGoToHub}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isZh ? '返回大厅' : 'Hub'}</span>
            </button>
          </div>
        </div>

        {/* Big Score Radial / Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 bg-gradient-to-br from-[#0f2744] to-[#1e3e62] text-white rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-md">
            <div className="text-xs uppercase tracking-wider text-blue-200 font-bold">
              {isZh ? '折合总分 (100分制)' : 'Final Scaled Score'}
            </div>
            <div className="my-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">{session.score}</span>
              <span className="text-slate-300 text-lg font-medium"> / 100</span>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-blue-200 border border-white/20">
              {session.accuracy}% {isZh ? '正确率' : 'Accuracy'}
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isZh ? '正确题数' : 'Correct'}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {session.correctCount} <span className="text-xs text-slate-400 font-normal">/ {session.questions.length}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                +{session.score} pts earned
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold mb-1">
                <XCircle className="w-4 h-4" />
                <span>{isZh ? '错误题数' : 'Incorrect'}</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {session.incorrectCount} <span className="text-xs text-slate-400 font-normal">/ {session.questions.length}</span>
              </div>
              <div className="text-[11px] text-rose-500 mt-1">
                {isZh ? '已自动归入错题本' : 'Logged to Mistake Book'}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-center col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold mb-1">
                <Clock className="w-4 h-4" />
                <span>{isZh ? '耗时 / 均题用时' : 'Time Spent'}</span>
              </div>
              <div className="text-xl font-bold text-slate-900">
                {formatTime(session.timeSpentSeconds)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                ~{Math.round(session.timeSpentSeconds / Math.max(session.questions.length, 1))}s / {isZh ? '题' : 'Q'}
              </div>
            </div>

            {/* Performance Tier Callout */}
            <div className={`col-span-2 sm:col-span-3 rounded-xl p-4 border ${tier.color} flex items-center justify-between`}>
              <div className="space-y-0.5">
                <div className="font-bold text-sm">
                  {isZh ? tier.titleZh : tier.titleEn}
                </div>
                <div className="text-xs text-slate-600">
                  {isZh ? tier.descZh : tier.descEn}
                </div>
              </div>
              {session.incorrectCount > 0 && (
                <button
                  onClick={onGoToMistakes}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-rose-600 text-xs font-bold shadow-2xs transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isZh ? '查看本次错题' : 'Review Errors'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs for Questions Review */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isZh ? '试题逐题逐句权威名师解析' : 'Question-by-Question Detailed Review'}
            </h2>
            <p className="text-xs text-slate-500">
              {isZh ? '查看每道题的答题详情、正确解法与官方解析' : 'Review your selected choice vs official answer key'}
            </p>
          </div>

          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isZh ? `全部 (${session.questions.length})` : `All (${session.questions.length})`}
            </button>
            <button
              onClick={() => setFilterMode('incorrect')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'incorrect' ? 'bg-white text-rose-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isZh ? `错题 (${session.incorrectCount})` : `Incorrect (${session.incorrectCount})`}
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterMode === 'correct' ? 'bg-white text-emerald-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isZh ? `正确 (${session.correctCount})` : `Correct (${session.correctCount})`}
            </button>
          </div>
        </div>

        {/* Questions Cards */}
        <div className="space-y-4">
          {filteredQuestions.map(({ q, idx }) => {
            const userChoice = session.userAnswers[idx];
            const isCorrect = userChoice === q.correctOption;
            const isUnanswered = userChoice === undefined;

            return (
              <div
                key={q.id || idx}
                className={`bg-white rounded-2xl border p-6 shadow-xs transition-all space-y-4 ${
                  isCorrect
                    ? 'border-emerald-200'
                    : isUnanswered
                    ? 'border-slate-300'
                    : 'border-rose-200 ring-1 ring-rose-100'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center text-white ${
                      isCorrect ? 'bg-emerald-600' : isUnanswered ? 'bg-slate-400' : 'bg-rose-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {q.module}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {q.subtopic}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isCorrect ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{isZh ? '回答正确' : 'Correct'}</span>
                      </span>
                    ) : isUnanswered ? (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        {isZh ? '未作答' : 'Unanswered'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1">
                        <X className="w-3.5 h-3.5 text-rose-700" />
                        <span>{isZh ? '回答错误' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-2">
                  <div className="font-semibold text-slate-900 text-sm sm:text-base leading-relaxed">
                    {q.questionEn}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {q.questionZh}
                  </div>
                </div>

                {/* Formula */}
                {q.formula && (
                  <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 flex items-center gap-2">
                    <span className="font-bold">{isZh ? '考点公式:' : 'Formula:'}</span>
                    <code className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200">
                      {q.formula}
                    </code>
                  </div>
                )}

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.optionsEn.map((opt, optIdx) => {
                    const isCandidateChoice = userChoice === optIdx;
                    const isOfficialCorrect = q.correctOption === optIdx;

                    let optBg = 'bg-slate-50 border-slate-200 text-slate-700';
                    if (isOfficialCorrect) {
                      optBg = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                    } else if (isCandidateChoice && !isCorrect) {
                      optBg = 'bg-rose-50 border-rose-400 text-rose-950 font-medium ring-1 ring-rose-300';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${optBg}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                          {optionLetters[optIdx]}
                        </span>
                        <div className="flex-1">
                          <div>{opt}</div>
                          {isCandidateChoice && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-rose-600">
                              {isZh ? '← 您的选择' : '← Your Selection'}
                            </span>
                          )}
                          {isOfficialCorrect && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700">
                              {isZh ? '✓ 官方标准答案' : '✓ Official Answer'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Explanation */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/80 text-xs sm:text-sm space-y-1.5 text-slate-800">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4 text-blue-600" />
                    <span>{isZh ? '官方大纲名师解析' : 'Official Syllabus Explanation'}</span>
                  </div>
                  <p className="leading-relaxed text-slate-700">{q.explanationEn}</p>
                  <p className="leading-relaxed text-slate-600 pt-1 border-t border-blue-100">{q.explanationZh}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

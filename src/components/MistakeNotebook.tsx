import React, { useState } from 'react';
import { 
  Bookmark, 
  CheckCircle2, 
  Trash2, 
  Play, 
  RotateCcw, 
  AlertTriangle, 
  BookOpen, 
  Check, 
  Filter,
  Sparkles
} from 'lucide-react';
import { UserProgress, Language, Subject, MistakeRecord, Question } from '../types/csca';
import { saveUserProgress } from '../utils/storage';
import { saveMistakeToFirestore, deleteMistakeFromFirestore } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface MistakeNotebookProps {
  userProgress: UserProgress;
  lang: Language;
  onUpdateProgress: (progress: UserProgress) => void;
  onLaunchMistakeQuiz: (questions: Question[]) => void;
  currentUser?: FirebaseUser | null;
}

export const MistakeNotebook: React.FC<MistakeNotebookProps> = ({
  userProgress,
  lang,
  onUpdateProgress,
  onLaunchMistakeQuiz,
  currentUser,
}) => {
  const isZh = lang === 'zh';
  const [subjectFilter, setSubjectFilter] = useState<Subject | 'All'>('All');
  const [showResolved, setShowResolved] = useState<boolean>(false);

  const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Professional Chinese'];
  const optionLetters = ['A', 'B', 'C', 'D'];

  const filteredMistakes = userProgress.mistakeBook.filter((m) => {
    if (subjectFilter !== 'All' && m.question.subject !== subjectFilter) return false;
    if (!showResolved && m.resolved) return false;
    return true;
  });

  const activeMistakes = userProgress.mistakeBook.filter((m) => !m.resolved);

  const handleToggleResolve = async (questionId: string) => {
    let toggledRecord: MistakeRecord | undefined;
    const updated = userProgress.mistakeBook.map((m) => {
      if (m.questionId === questionId) {
        toggledRecord = { ...m, resolved: !m.resolved };
        return toggledRecord;
      }
      return m;
    });
    const newProgress = { ...userProgress, mistakeBook: updated };
    saveUserProgress(newProgress, currentUser?.uid);
    onUpdateProgress(newProgress);

    // Sync to user's private Firestore subcollection
    if (currentUser && toggledRecord) {
      await saveMistakeToFirestore(currentUser.uid, toggledRecord);
    }
  };

  const handleDeleteMistake = async (questionId: string) => {
    const updated = userProgress.mistakeBook.filter((m) => m.questionId !== questionId);
    const newProgress = { ...userProgress, mistakeBook: updated };
    saveUserProgress(newProgress, currentUser?.uid);
    onUpdateProgress(newProgress);

    // Delete from user's private Firestore subcollection
    if (currentUser) {
      await deleteMistakeFromFirestore(currentUser.uid, questionId);
    }
  };

  const handleClearResolved = async () => {
    const resolvedMistakes = userProgress.mistakeBook.filter((m) => m.resolved);
    const updated = userProgress.mistakeBook.filter((m) => !m.resolved);
    const newProgress = { ...userProgress, mistakeBook: updated };
    saveUserProgress(newProgress, currentUser?.uid);
    onUpdateProgress(newProgress);

    if (currentUser) {
      for (const m of resolvedMistakes) {
        await deleteMistakeFromFirestore(currentUser.uid, m.questionId);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
              Personal Error Notebook
            </span>
            <span className="text-xs font-bold text-rose-600">
              {activeMistakes.length} {isZh ? '道待突破错题' : 'Unresolved Errors'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isZh ? 'CSCA 智能错题本与弱项突破' : 'CSCA Mistake Notebook & Error Cleansing'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isZh 
              ? '历次模拟考与练习中答错的题目均自动收录在此，反复精练直到连续答对2次彻底掌握。'
              : 'Every missed question is tracked here until you score 2 consecutive correct answers.'}
          </p>
        </div>

        {activeMistakes.length > 0 && (
          <button
            onClick={() => onLaunchMistakeQuiz(activeMistakes.map(m => m.question))}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 flex-shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isZh ? `立即重做全部错题 (${activeMistakes.length}题)` : `Practice Missed Questions (${activeMistakes.length})`}</span>
          </button>
        )}
      </div>

      {/* Filter and Tool Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{isZh ? '筛选科目:' : 'Filter:'}</span>
          </span>
          {(['All', ...subjects] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSubjectFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                subjectFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>{isZh ? '显示已掌握题目' : 'Show Resolved'}</span>
          </label>

          <button
            onClick={handleClearResolved}
            className="text-slate-400 hover:text-slate-600 underline"
          >
            {isZh ? '清理已掌握' : 'Clean Resolved'}
          </button>
        </div>
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0056D2] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">
            {isZh ? '太棒了！当前分类下暂无错题' : 'Zero Errors in This Category!'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isZh 
              ? '您已经全部消灭了该科目下的历史错题，或者尚未产生错误记录。继续保持！'
              : 'You have mastered all recorded questions in this category or haven\'t made errors yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((record) => {
            const q = record.question;
            const wrongOpt = record.selectedOption;
            const isResolved = record.resolved;

            return (
              <div
                key={record.questionId}
                className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 transition-all ${
                  isResolved ? 'border-blue-200 bg-blue-50/20' : 'border-rose-200'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      isResolved ? 'bg-blue-100 text-[#0056D2]' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {q.subject}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{q.module}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {isZh ? `累计做错 ${record.incorrectAttempts} 次` : `Failed ${record.incorrectAttempts} time(s)`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleResolve(record.questionId)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        isResolved
                          ? 'bg-[#0056D2] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isResolved ? (isZh ? '已攻克掌握' : 'Mastered') : (isZh ? '标记已掌握' : 'Mark Solved')}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMistake(record.questionId)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title={isZh ? '从错题本移除' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                    <span className="font-bold">{isZh ? '考点公式 / 原理:' : 'Key Formula:'}</span>
                    <code className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200">
                      {q.formula}
                    </code>
                  </div>
                )}

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.optionsEn.map((opt, optIdx) => {
                    const isCandidateChoice = wrongOpt === optIdx;
                    const isOfficialCorrect = q.correctOption === optIdx;

                    let optBg = 'bg-slate-50 border-slate-200 text-slate-700';
                    if (isOfficialCorrect) {
                      optBg = 'bg-blue-50/80 border-[#0056D2] text-blue-950 font-semibold ring-1 ring-blue-300';
                    } else if (isCandidateChoice) {
                      optBg = 'bg-rose-50 border-rose-300 text-rose-950 font-medium';
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
                              {isZh ? '← 曾经做错选择' : '← Your Mistaken Choice'}
                            </span>
                          )}
                          {isOfficialCorrect && (
                            <span className="inline-block mt-1 text-[10px] font-bold text-[#0056D2]">
                              {isZh ? '✓ 官方标准答案' : '✓ Official Answer'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/80 text-xs sm:text-sm space-y-1.5 text-slate-800">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>{isZh ? '解题推导与官方解析' : 'Step-by-Step Solution'}</span>
                  </div>
                  <p className="leading-relaxed text-slate-700">{q.explanationEn}</p>
                  <p className="leading-relaxed text-slate-600 pt-1 border-t border-blue-100">{q.explanationZh}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

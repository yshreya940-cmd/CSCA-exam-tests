import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Download, 
  Upload, 
  RotateCcw, 
  Eye, 
  ChevronRight,
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';
import { UserProgress, Language, Subject, QuizSession } from '../types/csca';
import { OFFICIAL_SYLLABI } from '../data/syllabusData';
import { saveUserProgress, INITIAL_USER_PROGRESS, seedBaselineProgress } from '../utils/storage';

interface ProgressDashboardProps {
  userProgress: UserProgress;
  lang: Language;
  onReviewPastSession: (session: QuizSession) => void;
  onUpdateProgress: (progress: UserProgress) => void;
  onNavigateToPractice: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userProgress,
  lang,
  onReviewPastSession,
  onUpdateProgress,
  onNavigateToPractice,
}) => {
  const isZh = lang === 'zh';
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<Subject | 'All'>('All');

  const accuracy = userProgress.totalQuestionsAttempted > 0
    ? Math.round((userProgress.totalCorrect / userProgress.totalQuestionsAttempted) * 100)
    : 0;

  const subjects: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Professional Chinese'];

  // Export progress
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userProgress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `csca-progress-${userProgress.candidateId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  // Import progress
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.candidateId) {
          saveUserProgress(parsed);
          onUpdateProgress(parsed);
          alert(isZh ? '学习进度档案导入成功！' : 'Progress record imported successfully!');
        }
      } catch (err) {
        alert(isZh ? '文件格式错误，请导入有效的 CSCA JSON 档案' : 'Invalid CSCA progress JSON file');
      }
    };
    reader.readAsText(file);
  };

  // Reset or Seed
  const handleReset = () => {
    if (confirm(isZh ? '确定要重置所有测试记录与错题本吗？' : 'Reset all test history and progress?')) {
      saveUserProgress(INITIAL_USER_PROGRESS);
      onUpdateProgress(INITIAL_USER_PROGRESS);
    }
  };

  const handleSeedBaseline = () => {
    const seeded = seedBaselineProgress();
    onUpdateProgress(seeded);
  };

  // Calculate module mastery sorted by accuracy
  const moduleEntries = Object.entries(userProgress.moduleMastery || {}).map(([key, val]) => {
    const [subj, modName] = key.split('::');
    const modAccuracy = val.attempted > 0 ? Math.round((val.correct / val.attempted) * 100) : 0;
    return {
      key,
      subject: subj as Subject,
      module: modName || key,
      attempted: val.attempted,
      correct: val.correct,
      accuracy: modAccuracy,
    };
  });

  const filteredModules = selectedSubjectFilter === 'All'
    ? moduleEntries
    : moduleEntries.filter(m => m.subject === selectedSubjectFilter);

  // Weakest modules (accuracy < 70%)
  const weakModules = moduleEntries.filter(m => m.accuracy < 70 && m.attempted >= 2);

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header & Candidate ID Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              {userProgress.applicationType} Candidate
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {userProgress.candidateId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isZh ? 'CSCA 个人学情诊断与进度追踪' : 'Personal CSCA Progress & Analytics'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isZh 
              ? '全方位多维量化评估，自动定位大纲弱项模块，提供针对性提分建议。'
              : 'Multi-dimensional analysis based on official CSC 2025 syllabus requirements.'}
          </p>
        </div>

        {/* Data Tools: Export / Import */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZh ? '导出学情档案' : 'Export JSON'}</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>{isZh ? '导入档案' : 'Import'}</span>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>

          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
            title={isZh ? '清空重置进度' : 'Reset progress'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showExportSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{isZh ? '学习档案导出成功！已保存至您的本地电脑。' : 'Progress JSON exported successfully.'}</span>
        </div>
      )}

      {/* 4 Core Big Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{isZh ? '总刷题量' : 'Total Questions'}</div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {userProgress.totalQuestionsAttempted}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{userProgress.totalCorrect} {isZh ? '正确' : 'Correct'}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{isZh ? '整体正确率' : 'Overall Accuracy'}</div>
          <div className="text-3xl font-black text-blue-600 mt-2">
            {accuracy}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {accuracy >= 80 ? (isZh ? '🌟 保持极高水平' : 'Top competitive tier') : (isZh ? '持续练习提升中' : 'In progress')}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{isZh ? '已完成模拟测试' : 'Graded Sessions'}</div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {userProgress.sessionsHistory.filter(s => s.isCompleted).length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isZh ? '全真模拟与模块测验' : 'Full mock & drills'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="text-xs font-semibold text-slate-500">{isZh ? '备考活跃天数' : 'Active Streak'}</div>
          <div className="text-3xl font-black text-amber-500 mt-2 flex items-center gap-1.5">
            <Flame className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span>{userProgress.streakDays} {isZh ? '天' : 'd'}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isZh ? '持续备考保持题感' : 'Daily practice habit'}
          </div>
        </div>
      </div>

      {/* Weak Topic Alert if any */}
      {weakModules.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl p-5 border border-amber-300 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm">
              {isZh ? '重点关注：检测到您有待强化的薄弱考点模块' : 'Diagnostic Alert: Weak Modules Identified'}
            </h3>
          </div>
          <p className="text-xs text-slate-700">
            {isZh 
              ? '依据您的历次答题记录，以下章节模块的正确率偏低（低于 70%），建议优先使用 AI 弱项生成或章节专项练习巩固：'
              : 'Based on your test attempts, accuracy is below 70% in the following areas. Target them for fastest score gain:'}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {weakModules.map((wm) => (
              <span
                key={wm.key}
                className="px-3 py-1 rounded-lg bg-white border border-amber-300 text-xs font-semibold text-amber-900 shadow-2xs flex items-center gap-2"
              >
                <span>{wm.subject} · {wm.module}</span>
                <span className="font-bold text-rose-600">({wm.accuracy}%)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subject-by-Subject Breakdown Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          {isZh ? '四大学科核心掌握度' : 'Subject Competency Overview'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subj) => {
            const stats = userProgress.subjectStats[subj] || { attempted: 0, correct: 0, highestScore: 0, latestScore: 0 };
            const subjAcc = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
            const syllabus = OFFICIAL_SYLLABI[subj];

            return (
              <div
                key={subj}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                        {subj.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{subj}</h3>
                        <p className="text-xs text-slate-400 font-mono">{syllabus?.code}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">{isZh ? '最高分' : 'Best'}</div>
                      <div className="text-lg font-black text-slate-900">{stats.highestScore || 0} / 100</div>
                    </div>
                  </div>

                  {/* Accuracy Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{isZh ? '准确率' : 'Accuracy'}</span>
                      <span className="font-bold">{subjAcc}% ({stats.correct}/{stats.attempted})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${subjAcc}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <span>{isZh ? `已考 ${stats.testsTaken || 0} 次` : `${stats.testsTaken || 0} tests taken`}</span>
                  <span className="text-slate-800 font-medium">
                    {isZh ? `最近得分: ${stats.latestScore || 0}分` : `Latest: ${stats.latestScore || 0} pts`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module Level Mastery Progress Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isZh ? '大纲各章节细分考点掌握率' : 'Syllabus Topic Mastery Matrix'}
            </h3>
            <p className="text-xs text-slate-500">
              {isZh ? '统计各章节练习的答题命中率' : 'Topic-level accuracy across your practice sessions'}
            </p>
          </div>

          {/* Subject Filter */}
          <div className="flex flex-wrap gap-1">
            {(['All', ...subjects] as const).map((filterSubj) => (
              <button
                key={filterSubj}
                onClick={() => setSelectedSubjectFilter(filterSubj)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedSubjectFilter === filterSubj
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filterSubj}
              </button>
            ))}
          </div>
        </div>

        {filteredModules.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs space-y-2">
            <p>{isZh ? '该分类下暂无已作答的模块数据。快去开始第一次练习吧！' : 'No topic data yet. Start practicing to generate topic analytics!'}</p>
            <button
              onClick={handleSeedBaseline}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold"
            >
              {isZh ? '点击载入示例学情数据' : 'Load Sample Analytics'}
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {filteredModules.map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700">
                  <span className="font-semibold text-slate-800">
                    <span className="text-slate-400 font-normal mr-1">[{item.subject}]</span>
                    {item.module}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {item.accuracy}% <span className="text-slate-400 font-normal">({item.correct}/{item.attempted})</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.accuracy >= 80 ? 'bg-emerald-500' : item.accuracy >= 60 ? 'bg-blue-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Exam Sessions History Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {isZh ? '历次测试记录档案' : 'Test Sessions Log'}
            </h3>
            <p className="text-xs text-slate-500">
              {isZh ? '点击任一历史测试可随时重温考题与解析' : 'Click any attempt to review questions and explanations'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {userProgress.sessionsHistory.length} {isZh ? '条记录' : 'records'}
          </span>
        </div>

        {userProgress.sessionsHistory.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            {isZh ? '尚未完成任何测试。完成测试后此处将生成完整成绩单。' : 'No test records yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">{isZh ? '测试时间' : 'Date'}</th>
                  <th className="py-2.5 px-3">{isZh ? '科目 / 模式' : 'Subject & Mode'}</th>
                  <th className="py-2.5 px-3">{isZh ? '得分' : 'Score'}</th>
                  <th className="py-2.5 px-3">{isZh ? '正确率' : 'Accuracy'}</th>
                  <th className="py-2.5 px-3">{isZh ? '用时' : 'Time'}</th>
                  <th className="py-2.5 px-3 text-right">{isZh ? '操作' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {userProgress.sessionsHistory.map((sess) => (
                  <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(sess.completedAt || sess.startedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {sess.subject}
                      <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase font-bold">
                        {sess.mode}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      <span className={sess.score >= 80 ? 'text-emerald-600' : sess.score >= 60 ? 'text-blue-600' : 'text-rose-600'}>
                        {sess.score}
                      </span>
                      <span className="text-slate-400 font-normal"> / 100</span>
                    </td>
                    <td className="py-3 px-3">
                      {sess.accuracy}% ({sess.correctCount}/{sess.questions.length})
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {Math.floor(sess.timeSpentSeconds / 60)}m {sess.timeSpentSeconds % 60}s
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onReviewPastSession(sess)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{isZh ? '回顾试卷' : 'Review'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

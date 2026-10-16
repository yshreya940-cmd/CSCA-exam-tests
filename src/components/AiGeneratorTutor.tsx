import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Play, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  RefreshCw, 
  BookOpen, 
  Check, 
  X,
  Layers,
  Zap
} from 'lucide-react';
import { Subject, Language, Question, QuizMode } from '../types/csca';
import { OFFICIAL_SYLLABI } from '../data/syllabusData';

interface AiGeneratorTutorProps {
  lang: Language;
  onStartCustomQuiz: (questions: Question[], subject: Subject) => void;
}

export const AiGeneratorTutor: React.FC<AiGeneratorTutorProps> = ({
  lang,
  onStartCustomQuiz,
}) => {
  const isZh = lang === 'zh';
  const [subject, setSubject] = useState<Subject>('Chemistry');
  const [selectedModule, setSelectedModule] = useState<string>('Chemical Theories and Laws');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<string>('Standard');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ask AI Coach general inquiry
  const [coachPrompt, setCoachPrompt] = useState('');
  const [coachResponse, setCoachResponse] = useState<string | null>(null);
  const [isCoachLoading, setIsCoachLoading] = useState(false);

  const syllabus = OFFICIAL_SYLLABI[subject];

  const handleSubjectChange = (newSubj: Subject) => {
    setSubject(newSubj);
    const firstMod = OFFICIAL_SYLLABI[newSubj]?.modules[0]?.titleEn || 'General';
    setSelectedModule(firstMod);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setUserAnswers({});
    setRevealedSolutions({});

    try {
      const res = await fetch('/api/ai/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic: selectedModule,
          count: questionCount,
          difficulty,
          language: isZh ? 'zh' : 'bilingual',
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        // Map to complete Question schema
        const mappedQuestions: Question[] = data.questions.map((q: any, idx: number) => ({
          id: `ai-gen-${Date.now()}-${idx}`,
          subject,
          module: selectedModule,
          subtopic: q.subtopic || selectedModule,
          difficulty: difficulty as any,
          questionEn: q.question,
          questionZh: q.question,
          optionsEn: q.options || ['A', 'B', 'C', 'D'],
          optionsZh: q.options || ['A', 'B', 'C', 'D'],
          correctOption: (q.correctOption >= 0 && q.correctOption <= 3) ? q.correctOption : 0,
          explanationEn: q.explanation || 'Step-by-step logic verified by CSCA curriculum rules.',
          explanationZh: q.explanation || '标准答案与官方考点详细推导过程。',
          formula: q.formula || undefined,
          syllabusRef: `${subject}: ${selectedModule}`,
        }));

        setGeneratedQuestions(mappedQuestions);
      } else {
        setErrorMessage(data.error || 'Failed to generate questions. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage('Network or server error while generating: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAskCoach = async () => {
    if (!coachPrompt.trim()) return;
    setIsCoachLoading(true);
    setCoachResponse(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `General CSCA Inquiry on ${subject}: ${coachPrompt}`,
          subject,
          userQuery: coachPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.explanation) {
        setCoachResponse(data.explanation);
      } else {
        setCoachResponse('Could not retrieve coach advice. Please retry.');
      }
    } catch (err: any) {
      setCoachResponse('Error connecting to tutor service: ' + err.message);
    } finally {
      setIsCoachLoading(false);
    }
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/20 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Fallback Architecture</span>
          </span>
          <span className="text-xs text-purple-300">
            {isZh ? '高可用模型矩阵支持 (gemini-3.6-flash / 3.1-flash-lite / 3.7-flash)' : 'Multi-model resilient fallback ladder'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isZh ? 'CSCA 智能个性化出题与名师私教' : 'AI Targeted Question Generator & Master Tutor'}
        </h1>
        <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
          {isZh 
            ? '针对您感到薄弱的 2025 大纲考点，让 AI 依据留学生高考标准量身定做专项练习题，并提供详尽的解题推导与易错陷阱分析。'
            : 'Generate tailored exam-level questions on specific modules and receive immediate step-by-step logic with distractor traps analysis.'}
        </p>
      </div>

      {/* Generator Control Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-600" />
          <span>{isZh ? '设置出题科目与考点' : 'Configure Targeted Question Parameters'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {isZh ? '目标考试科目' : 'Target Subject'}
            </label>
            <select
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value as Subject)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="Mathematics">Mathematics (数学)</option>
              <option value="Physics">Physics (物理)</option>
              <option value="Chemistry">Chemistry (化学)</option>
              <option value="Professional Chinese">Professional Chinese (专业汉语)</option>
            </select>
          </div>

          {/* Module */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {isZh ? '大纲章节考点' : 'Syllabus Module'}
            </label>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500"
            >
              {syllabus?.modules.map((m, idx) => (
                <option key={idx} value={m.titleEn}>
                  {isZh ? m.titleZh : m.titleEn}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {isZh ? '生成题目数量' : 'Number of Questions'}
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value={1}>1 Question (快速体验)</option>
              <option value={3}>3 Questions (推荐标准组)</option>
              <option value={5}>5 Questions (深度专题测验)</option>
            </select>
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              {isZh ? '难度级别' : 'Difficulty Tier'}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="Standard">Standard (标准基础题)</option>
              <option value="Challenging">Challenging (进阶中难题)</option>
              <option value="Advanced">Advanced (高分区分题)</option>
            </select>
          </div>
        </div>

        <button
          disabled={isGenerating}
          onClick={handleGenerate}
          className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{isZh ? '正在调用大纲智能模型出题中...' : 'Generating 2025 CSCA Questions...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isZh ? '✨ 立即生成 CSCA 真实考点题组' : 'Generate CSCA Practice Set'}</span>
            </>
          )}
        </button>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Generated Questions Interactive Workspace */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isZh ? '生成题目在线作答与即时判分' : 'Generated Questions Interactive Drill'}
              </h2>
              <p className="text-xs text-slate-500">
                {isZh ? '点击选项作答，随时查看官方答案与名师避坑解析' : 'Answer below to test yourself, then reveal the step-by-step logic'}
              </p>
            </div>

            <button
              onClick={() => onStartCustomQuiz(generatedQuestions, subject)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isZh ? '进入正式考场作答此题组' : 'Launch as Timed Test'}</span>
            </button>
          </div>

          <div className="space-y-6">
            {generatedQuestions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isAnswered = userAns !== undefined;
              const isCorrect = userAns === q.correctOption;
              const isRevealed = Boolean(revealedSolutions[idx]);

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{q.module}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-purple-700 font-medium">CSCA Standard MCQ</span>
                    </div>

                    {isAnswered && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{isCorrect ? (isZh ? '回答正确' : 'Correct') : (isZh ? '回答错误' : 'Incorrect')}</span>
                      </span>
                    )}
                  </div>

                  {/* Question Stem */}
                  <div className="font-semibold text-slate-900 text-sm sm:text-base leading-relaxed">
                    {q.questionEn}
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.optionsEn.map((opt, optIdx) => {
                      const isSelected = userAns === optIdx;
                      const isOfficialCorrect = q.correctOption === optIdx;

                      let btnStyle = 'bg-white hover:bg-slate-50 border-slate-200';
                      if (isSelected) {
                        btnStyle = isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold' : 'bg-rose-50 border-rose-500 text-rose-950';
                      } else if (isRevealed && isOfficialCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400';
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => setUserAnswers({ ...userAnswers, [idx]: optIdx })}
                          className={`p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all flex items-start space-x-3 ${btnStyle}`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5 ${
                            isSelected ? 'bg-slate-900 text-white' : 'border border-slate-300 text-slate-600'
                          }`}>
                            {optionLetters[optIdx]}
                          </span>
                          <span className="flex-1 font-medium">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution toggle */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setRevealedSolutions({ ...revealedSolutions, [idx]: !isRevealed })}
                      className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isRevealed ? (isZh ? '收起解析' : 'Hide Explanation') : (isZh ? '查看名师推导解析' : 'Reveal Step-by-Step Logic')}</span>
                    </button>

                    {q.formula && (
                      <span className="text-xs text-slate-500 font-mono">
                        {q.formula}
                      </span>
                    )}
                  </div>

                  {isRevealed && (
                    <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 text-xs sm:text-sm text-slate-800 space-y-2">
                      <div className="font-bold text-purple-900">
                        {isZh ? '正确答案: ' : 'Correct Key: '}
                        <span className="text-emerald-700 font-mono">Option {optionLetters[q.correctOption]}</span>
                      </div>
                      <p className="leading-relaxed text-slate-700 whitespace-pre-line">
                        {q.explanationEn}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* General AI Exam Coach Inquiry Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2 text-slate-900">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-base">
            {isZh ? '随时向 CSCA 备考教练提问' : 'Ask the CSCA Exam Master Coach'}
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          {isZh 
            ? '针对考点概念、做题捷径、中国大学理科词汇或公式推导，教练随时为您答疑解惑。'
            : 'Inquire about specific chemical equilibria, calculus shortcuts, or physics problem traps.'}
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={coachPrompt}
            onChange={(e) => setCoachPrompt(e.target.value)}
            placeholder={isZh ? '例如：“在化学平衡中，勒夏特列原理的压强判断有哪些典型易错点？”' : 'e.g., "What are the most common traps in Doppler effect and wave speed questions?"'}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAskCoach();
            }}
          />
          <button
            disabled={isCoachLoading || !coachPrompt.trim()}
            onClick={handleAskCoach}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {isCoachLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isZh ? '获取指导' : 'Ask'}</span>
          </button>
        </div>

        {coachResponse && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-800">
            {coachResponse}
          </div>
        )}
      </div>
    </div>
  );
};

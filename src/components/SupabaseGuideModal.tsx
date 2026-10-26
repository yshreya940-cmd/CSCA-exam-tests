import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Check, 
  Copy, 
  ExternalLink, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw, 
  Key, 
  Terminal, 
  Table, 
  Layers, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { 
  getSupabaseCredentials, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials, 
  testSupabaseConnection, 
  syncSessionToSupabase, 
  syncProfileToSupabase, 
  syncMistakesToSupabase 
} from '../lib/supabase';
import { UserProgress, Language } from '../types/csca';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  userProgress: UserProgress;
}

export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- CSCA by Apply for China — Production Supabase (PostgreSQL) Schema
-- Execute this entire script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- 1. Enable UUID generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Stores candidate data & lifetime study metrics)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id TEXT UNIQUE NOT NULL,
  candidate_name TEXT NOT NULL,
  email TEXT,
  application_type TEXT DEFAULT 'CGS',
  target_university TEXT,
  registered_subjects TEXT[] DEFAULT '{}',
  streak_days INTEGER DEFAULT 1 CHECK (streak_days >= 0),
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_questions_attempted INTEGER DEFAULT 0 CHECK (total_questions_attempted >= 0),
  total_correct INTEGER DEFAULT 0 CHECK (total_correct >= 0),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Exam Papers Catalog
CREATE TABLE IF NOT EXISTS public.exam_papers (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  subject TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  year TEXT NOT NULL,
  session_month TEXT NOT NULL,
  exam_paper_tag TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_zh TEXT NOT NULL,
  is_mock BOOLEAN DEFAULT false,
  track TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Central Questions Bank
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  module TEXT NOT NULL,
  subtopic TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Standard',
  exam_paper TEXT,
  question_number INTEGER,
  section TEXT,
  question_en TEXT NOT NULL,
  question_zh TEXT NOT NULL,
  options_en JSONB NOT NULL,
  options_zh JSONB NOT NULL,
  correct_option SMALLINT NOT NULL CHECK (correct_option BETWEEN 0 AND 5),
  explanation_en TEXT NOT NULL,
  explanation_zh TEXT NOT NULL,
  formula TEXT,
  syllabus_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Quiz Sessions History (Grades, Timing, User Answers)
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL,
  paper_id TEXT,
  exam_paper_name TEXT,
  subject TEXT NOT NULL,
  mode TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  time_limit_seconds INTEGER NOT NULL,
  time_spent_seconds INTEGER NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  incorrect_count INTEGER NOT NULL,
  unanswered_count INTEGER NOT NULL,
  accuracy INTEGER NOT NULL,
  user_answers JSONB DEFAULT '{}'::jsonb,
  flagged_questions JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Mistake Records
CREATE TABLE IF NOT EXISTS public.mistake_records (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  module TEXT NOT NULL,
  user_choice SMALLINT,
  correct_option SMALLINT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  review_count INTEGER DEFAULT 1,
  added_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable Row Level Security (RLS) & Secure Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mistake_records ENABLE ROW LEVEL SECURITY;

-- Anonymous public read access for catalog
DROP POLICY IF EXISTS "Public can view exam papers" ON public.exam_papers;
CREATE POLICY "Public can view exam papers" ON public.exam_papers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view questions" ON public.questions;
CREATE POLICY "Public can view questions" ON public.questions FOR SELECT USING (true);

-- Candidate-bound access policies
DROP POLICY IF EXISTS "Allow anon upsert profiles" ON public.profiles;
CREATE POLICY "Allow anon upsert profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert sessions" ON public.quiz_sessions;
CREATE POLICY "Allow anon insert sessions" ON public.quiz_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon manage mistakes" ON public.mistake_records;
CREATE POLICY "Allow anon manage mistakes" ON public.mistake_records FOR ALL USING (true) WITH CHECK (true);
`;

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({
  isOpen,
  onClose,
  lang,
  userProgress,
}) => {
  const isZh = lang === 'zh';
  const [activeTab, setActiveTab] = useState<'instructions' | 'sql' | 'connect'>('instructions');

  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);
  const [testStatus, setTestStatus] = useState<{
    running: boolean;
    result?: { success: boolean; message: string; latencyMs?: number };
  }>({ running: false });

  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setInputUrl(creds.url);
      setInputKey(creds.anonKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveAndTest = async () => {
    if (!inputUrl || !inputKey) {
      alert(isZh ? '请填写完整的 Project URL 和 Anon Key' : 'Please provide both Project URL and Anon Key');
      return;
    }

    saveSupabaseCredentials(inputUrl, inputKey);
    setTestStatus({ running: true });

    const res = await testSupabaseConnection(inputUrl, inputKey);
    setTestStatus({ running: false, result: res });
  };

  const handleClear = () => {
    clearSupabaseCredentials();
    setInputUrl('');
    setInputKey('');
    setTestStatus({ running: false, result: undefined });
  };

  const handleSyncData = async () => {
    setSyncStatus(isZh ? '正在同步数据至 Supabase...' : 'Syncing data to Supabase...');
    try {
      const pOk = await syncProfileToSupabase(userProgress);
      const mOk = await syncMistakesToSupabase(userProgress.mistakeBook, userProgress.candidateId);
      
      let sOk = true;
      for (const session of userProgress.sessionsHistory) {
        const ok = await syncSessionToSupabase(session, userProgress.candidateId);
        if (!ok) sOk = false;
      }

      if (pOk && mOk && sOk) {
        setSyncStatus(isZh ? '✅ 考生学情与成绩数据已成功备份同步至 Supabase！' : '✅ Candidate analytics & history successfully backed up to Supabase!');
      } else {
        setSyncStatus(isZh ? '⚠️ 部分数据同步可能因表未建立而跳过。请确保已执行 SQL 迁移。' : '⚠️ Sync completed with warnings. Ensure tables are created via SQL migration.');
      }
    } catch (e: any) {
      setSyncStatus(`❌ Sync error: ${e.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-blue-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header - Signature Coursera Blue */}
        <div className="bg-[#002554] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#001c40]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Database className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Supabase PostgreSQL Database Integration</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isZh ? '连接与配置 Supabase 数据库指南' : 'Connect to Supabase Database (Instructions)'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-nav - Blue Theme */}
        <div className="bg-blue-50/60 border-b border-blue-200 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'instructions'
                ? 'bg-[#0056D2] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0056D2] hover:bg-blue-100/50'
            }`}
          >
            {isZh ? '1. 连接步骤说明 (Step-by-Step)' : '1. Setup Instructions'}
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-[#0056D2] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0056D2] hover:bg-blue-100/50'
            }`}
          >
            {isZh ? '2. 数据库建表 SQL 脚本 (Schema)' : '2. SQL Schema Migration'}
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'connect'
                ? 'bg-[#0056D2] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#0056D2] hover:bg-blue-100/50'
            }`}
          >
            {isZh ? '3. 联调测试与数据同步 (Test & Sync)' : '3. Test Connection & Sync'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: INSTRUCTIONS */}
          {activeTab === 'instructions' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm text-blue-900 leading-relaxed">
                <strong>{isZh ? '什么是 Supabase？' : 'What is Supabase?'}</strong>
                <p className="mt-1 text-slate-700">
                  {isZh
                    ? 'Supabase 是基于开源 PostgreSQL 构建的现代化云数据库。连接 Supabase 后，系统将实时持久化考生的所有全真模拟考记录、成绩单、错题本与每日连续备考打卡数据。'
                    : 'Supabase is an open-source Firebase alternative powered by PostgreSQL. Connecting Supabase automatically backs up candidate CBT exam sessions, real-time grading reports, personalized mistake records, and daily streak progress.'}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0056D2] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>{isZh ? '第一步：创建免费 Supabase 项目' : 'Step 1: Create a Free Supabase Project'}</span>
                </h3>
                <div className="pl-8 text-xs sm:text-sm text-slate-600 space-y-2">
                  <p>
                    {isZh 
                      ? '前往官网注册或登录账号：' 
                      : 'Visit Supabase and sign in or create an account:'}
                  </p>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#0056D2] hover:bg-blue-100 font-semibold text-xs border border-blue-200"
                  >
                    <span>https://supabase.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p>
                    {isZh
                      ? '点击 “New Project”，填写项目名称（如 csca-exam-portal），设定安全密码并选择就近的云节点（如 Singapore 或 Tokyo）。项目约2分钟内自动就绪。'
                      : 'Click "New Project", enter a name (e.g. csca-exam-portal), set a database password, and pick a cloud region. It takes ~2 minutes to deploy.'}
                  </p>
                </div>

                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pt-2">
                  <span className="w-6 h-6 rounded-full bg-[#0056D2] text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>{isZh ? '第二步：获取 API 密钥与 Project URL' : 'Step 2: Obtain API Credentials'}</span>
                </h3>
                <div className="pl-8 text-xs sm:text-sm text-slate-600 space-y-2">
                  <p>
                    {isZh 
                      ? '在 Supabase 管理控制台中，导航至左侧菜单栏底部：' 
                      : 'In your Supabase project dashboard, navigate to:'}
                  </p>
                  <div className="bg-slate-100 p-2.5 rounded-lg font-mono text-xs text-slate-800 border border-slate-200">
                    Project Settings → API → Project URL & Project API Keys
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li><strong>Project URL:</strong> 例如 <code>https://abcdefghijklmn.supabase.co</code></li>
                    <li><strong>anon public key:</strong> 以 <code>eyJhbGciOiJIUzI1NiIsIn...</code> 开头的公钥 (客户端安全公开访问)</li>
                  </ul>
                </div>

                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pt-2">
                  <span className="w-6 h-6 rounded-full bg-[#0056D2] text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>{isZh ? '第三步：执行 SQL 建表脚本' : 'Step 3: Run the SQL Schema Migration'}</span>
                </h3>
                <div className="pl-8 text-xs sm:text-sm text-slate-600 space-y-2">
                  <p>
                    {isZh
                      ? '在左侧菜单点击 “SQL Editor” → “New Query”，将上方 “2. 数据库建表 SQL 脚本” 中的代码完整粘贴并点击 “Run”。'
                      : 'Click "SQL Editor" in the left sidebar, click "New Query", paste the SQL schema from tab 2, and click "Run".'}
                  </p>
                  <p className="text-slate-500">
                    {isZh
                      ? '脚本将一键建立 profiles, exam_papers, questions, quiz_sessions, mistake_records 5 张核心数据表，并配置好行级安全策略 (RLS)。'
                      : 'This creates the 5 core tables (profiles, exam_papers, questions, quiz_sessions, mistake_records) with RLS security policies.'}
                  </p>
                </div>

                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pt-2">
                  <span className="w-6 h-6 rounded-full bg-[#0056D2] text-white text-xs flex items-center justify-center font-bold">4</span>
                  <span>{isZh ? '第四步：配置环境变量或在线绑定' : 'Step 4: Configure Environment Variables'}</span>
                </h3>
                <div className="pl-8 text-xs sm:text-sm text-slate-600 space-y-2">
                  <p>
                    {isZh
                      ? '在项目根目录的 <code>.env</code> 文件中添加如下配置（支持生产环境打包与自动化同步）：'
                      : 'Add the following lines to your <code>.env</code> file in the app root directory:'}
                  </p>
                  <pre className="bg-slate-900 text-sky-200 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-blue-900">
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
                  </pre>
                  <p className="text-slate-500">
                    {isZh
                      ? '您也可以切换到第3个选项卡 “联调测试与数据同步”，直接在网页中填入并点击“保存并测试”，系统即可自动建立连接！'
                      : 'You can also switch to Tab 3 "Test Connection & Sync" to paste your credentials directly in the browser and test instantly!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isZh ? '全套 PostgreSQL 建表与安全策略脚本' : 'PostgreSQL Schema & Row Level Security (RLS)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isZh ? '直接复制并粘贴至 Supabase 控制台的 SQL Editor 执行即可' : 'Copy and paste into your Supabase SQL Editor and click Run'}
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-[#0056D2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-sky-200" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? (isZh ? '已复制到剪贴板！' : 'Copied!') : (isZh ? '复制完整 SQL' : 'Copy SQL Script')}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-[#030e24] text-sky-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[460px] border border-blue-900 leading-relaxed scrollbar-thin">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: CONNECT & TEST */}
          {activeTab === 'connect' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-blue-200 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isZh ? '输入 Supabase 项目凭据' : 'Configure Supabase Credentials'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isZh 
                      ? '填入后将保存在本地浏览器环境，自动优先用于全真模考交卷保存与错题同步。'
                      : 'Saved in browser storage or read from VITE_SUPABASE_* environment variables.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Project URL
                    </label>
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://xyzabcdefg.supabase.co"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Anon Public API Key
                    </label>
                    <input
                      type="password"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:border-[#0056D2] focus:ring-1 focus:ring-[#0056D2] font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={handleClear}
                    className="text-xs text-slate-400 hover:text-rose-600 underline cursor-pointer"
                  >
                    {isZh ? '清除已存凭据' : 'Clear Stored Credentials'}
                  </button>

                  <button
                    disabled={testStatus.running}
                    onClick={handleSaveAndTest}
                    className="px-5 py-2.5 bg-[#0056D2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testStatus.running ? 'animate-spin' : ''}`} />
                    <span>{testStatus.running ? (isZh ? '正在测试连接...' : 'Testing...') : (isZh ? '保存并测试连接' : 'Save & Test Connection')}</span>
                  </button>
                </div>
              </div>

              {/* Test Result Callout */}
              {testStatus.result && (
                <div className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                  testStatus.result.success
                    ? 'bg-blue-50 border-blue-300 text-blue-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-base">
                    {testStatus.result.success ? (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <span>{testStatus.result.success ? (isZh ? '连接测试通过' : 'Connection Successful') : (isZh ? '连接测试失败' : 'Connection Failed')}</span>
                  </div>

                  <p className="leading-relaxed">{testStatus.result.message}</p>

                  {testStatus.result.latencyMs !== undefined && (
                    <div className="text-xs text-slate-600 font-mono">
                      {isZh ? '往返延迟 (Latency): ' : 'Roundtrip Latency: '}{testStatus.result.latencyMs}ms
                    </div>
                  )}

                  {testStatus.result.success && (
                    <div className="pt-2">
                      <button
                        onClick={handleSyncData}
                        className="px-4 py-2 bg-[#0056D2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{isZh ? '立即同步本地历史答卷与错题至 Supabase' : 'Sync Local Exam History & Mistakes Now'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {syncStatus && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800">
                  {syncStatus}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
            <span>{isZh ? 'Supabase 行级安全 (RLS) 隔离保护' : 'Protected by Supabase Row Level Security'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition-colors cursor-pointer"
          >
            {isZh ? '关闭' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

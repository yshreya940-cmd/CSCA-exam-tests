import React from 'react';
import { BookOpen, BarChart3, Award, Sparkles, FileText, Bookmark, Globe, UserCheck } from 'lucide-react';
import { Language, UserProgress } from '../types/csca';
import { CscaLogo } from './CscaLogo';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lang: Language;
  onToggleLang: () => void;
  userProgress: UserProgress;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onToggleLang,
  userProgress,
}) => {
  const isZh = lang === 'zh';

  const navItems = [
    { id: 'hub', labelEn: 'Practice Hub', labelZh: '练习首页', icon: BookOpen },
    { id: 'mock', labelEn: 'Timed Mock Exam', labelZh: '全真模考', icon: Award },
    { id: 'progress', labelEn: 'Progress & Analytics', labelZh: '学情进度', icon: BarChart3 },
    { id: 'syllabus', labelEn: '2025 Syllabus', labelZh: '考试大纲', icon: FileText },
    { id: 'ai-tutor', labelEn: 'AI Practice & Tutor', labelZh: 'AI 智能考题', icon: Sparkles },
    { id: 'mistakes', labelEn: 'Mistake Book', labelZh: '错题本', icon: Bookmark, badge: userProgress.mistakeBook.filter(m => !m.resolved).length },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0f2744] text-white border-b border-[#1e3e62] shadow-md">
      {/* Top CSC Institutional Sub-bar */}
      <div className="bg-[#0a192f] px-4 py-1.5 border-b border-[#162e4c] text-xs text-slate-300 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">
            {isZh ? '国家留学基金管理委员会 (CSC) · CSCA 官方大纲模拟测试平台' : 'China Scholarship Council (CSC) · CSCA Official Examination Assessment Portal'}
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-amber-300 font-semibold">
            {isZh ? '2025 版考试大纲全面适用' : '2025 Edition Syllabus Fully Supported'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-cyan-300">{userProgress.candidateId}</span>
            <span className="text-slate-400">({userProgress.applicationType})</span>
          </div>

          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
            title={isZh ? 'Switch to English' : '切换为中文'}
          >
            <Globe className="w-3 h-3 text-amber-400" />
            <span className="font-medium">{isZh ? 'English' : '中文'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Platform Name */}
          <div
            onClick={() => onTabChange('hub')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <CscaLogo size="md" />
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-300 transition-colors">
                CSCA {isZh ? '中国学术水平能力测试' : 'China Scholastic Competency Assessment'}
              </span>
              <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                2025 Ready
              </span>
            </div>
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{isZh ? item.labelZh : item.labelEn}</span>
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex overflow-x-auto py-2 space-x-1 border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-shrink-0 flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isZh ? item.labelZh : item.labelEn}</span>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="px-1 bg-rose-500 text-white text-[9px] rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
